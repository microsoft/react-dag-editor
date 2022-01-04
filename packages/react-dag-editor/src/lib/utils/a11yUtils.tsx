import * as React from "react";
import * as ReactDOM from "react-dom";
import { VisitPortHelper } from "../components/A11yHelpers/VisitPortHelper";
import type { GraphController } from "../controllers/GraphController";
import type {
  IGetConnectableParams,
  IGraphConfig,
} from "../models/config/types";
import { GraphCanvasEvent, GraphNodeEvent } from "../models/event";

import type { GraphModel } from "../models/GraphModel";
import type { NodeModel } from "../models/NodeModel";
import type { PortModel } from "../models/PortModel";
import type { EventChannel } from "./eventChannel";
import { getNeighborPorts, getNodeUid, getPortUid } from "./graphDataUtils";

export interface INextItem {
  node: NodeModel | undefined;
  port: PortModel | undefined;
}

const item = (
  node: NodeModel | undefined = undefined,
  port: PortModel | undefined = undefined
): INextItem => ({
  node,
  port,
});

export type TGetNextItemHandler = (
  data: GraphModel,
  node: NodeModel,
  portId?: PortModel
) => INextItem;

export const findDOMElement = (
  svg: SVGSVGElement,
  { node, port }: INextItem
): Element | null => {
  let id: string;
  if (node && port) {
    id = getPortUid(svg.dataset.graphId ?? "", node, port);
  } else if (node) {
    id = getNodeUid(svg.dataset.graphId ?? "", node);
  } else {
    return null;
  }
  return svg.getElementById(id);
};

export const focusItem = (
  svgRef: React.RefObject<SVGSVGElement>,
  nextItem: INextItem,
  evt: React.KeyboardEvent,
  eventChannel: EventChannel
): void => {
  if (!svgRef.current) {
    return;
  }
  const el = findDOMElement(svgRef.current, nextItem);
  if (el) {
    evt.preventDefault();
    evt.stopPropagation();
    (el as SVGGElement).focus({ preventScroll: true });
    eventChannel.trigger({
      type: GraphCanvasEvent.Navigate,
      node: nextItem.node,
      port: nextItem.port,
      rawEvent: evt,
    });
  } else if (!nextItem.node && !nextItem.port) {
    eventChannel.trigger({
      type: GraphCanvasEvent.Navigate,
      node: nextItem.node,
      port: nextItem.port,
      rawEvent: evt,
    });
  }
};

export const getNextItem: TGetNextItemHandler = (data, curNode, port) => {
  if (curNode.ports) {
    const portIndex = port
      ? curNode.ports.findIndex((p) => p.id === port.id)
      : -1;
    const nextPortIndex = portIndex + 1;
    if (nextPortIndex < curNode.ports.length) {
      return item(curNode, curNode.ports[nextPortIndex]);
    }
  }
  const nextNode = curNode.next && data.nodes.get(curNode.next);
  if (nextNode) {
    return item(nextNode);
  }

  return item();
};

export const getPrevItem: TGetNextItemHandler = (data, curNode, port) => {
  if (port && curNode.ports) {
    const prevPortIndex = curNode.ports.findIndex((p) => p.id === port.id) - 1;
    if (prevPortIndex >= 0) {
      return item(curNode, curNode.ports[prevPortIndex]);
    }
    return item(curNode);
  }
  const prevNode = curNode.prev && data.nodes.get(curNode.prev);
  if (prevNode) {
    return item(
      prevNode,
      prevNode.ports && prevNode.ports.length
        ? prevNode.ports[prevNode.ports.length - 1]
        : undefined
    );
  }

  return item();
};

export const nextConnectablePort =
  (
    graphConfig: IGraphConfig,
    params: Omit<IGetConnectableParams, "model" | "parentNode" | "data">
  ): TGetNextItemHandler =>
  (data, node, port?) => {
    let next = getNextItem(data, node, port);
    while (!(next.node?.id === node.id && next.port?.id === port?.id)) {
      if (!next.node) {
        next = item(data.getNavigationFirstNode());
      } else if (next.port) {
        const portShape = next.port.shape
          ? next.port.shape
          : graphConfig.defaultPortShape;

        if (
          graphConfig.getPortConfigByName(portShape)?.getIsConnectable({
            ...params,
            data,
            parentNode: next.node,
            model: next.port,
          })
        ) {
          return next;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      next = getNextItem(data, next.node!, next.port);
    }
    return item();
  };

export const focusNextPort = (
  ports: readonly PortModel[],
  node: NodeModel,
  curPortId: string,
  svgRef: React.RefObject<SVGSVGElement>,
  evt: React.KeyboardEvent,
  eventChannel: EventChannel
): void => {
  const curPortIndex = ports.findIndex((p) => p.id === curPortId);
  const nextPortIndex = (curPortIndex + 1) % ports.length;
  const nextPort = ports[nextPortIndex];

  if (nextPort && svgRef.current) {
    focusItem(svgRef, { node, port: nextPort }, evt, eventChannel);
  }
};

export const focusPrevPort = (
  ports: readonly PortModel[],
  node: NodeModel,
  curPortId: string,
  svgRef: React.RefObject<SVGSVGElement>,
  evt: React.KeyboardEvent,
  eventChannel: EventChannel
): void => {
  const curPortIndex = ports.findIndex((p) => p.id === curPortId);
  const prevPortIndex = (curPortIndex - 1 + ports.length) % ports.length;
  const prevPort = ports[prevPortIndex];

  if (prevPort && svgRef.current) {
    focusItem(svgRef, { node, port: prevPort }, evt, eventChannel);
  }
};

export const getFocusNodeHandler =
  (compareFn?: (a: NodeModel, b: NodeModel) => number) =>
  (
    data: GraphModel,
    curNodeId: string,
    svgRef: React.RefObject<SVGSVGElement>,
    graphController: GraphController,
    evt: React.KeyboardEvent,
    eventChannel: EventChannel
  ): void => {
    const sortedNodes = Array.from(data.nodes.values()).sort(compareFn);
    const curNodeIndex = sortedNodes.findIndex((n) => n.id === curNodeId);
    const nextNode = sortedNodes[(curNodeIndex + 1) % sortedNodes.length];

    if (nextNode && svgRef.current) {
      graphController.dispatch({
        type: GraphNodeEvent.Select,
        nodes: [nextNode.id],
      });
      graphController.dispatch({
        type: GraphNodeEvent.Centralize,
        nodes: [nextNode.id],
      });

      focusItem(svgRef, { node: nextNode, port: undefined }, evt, eventChannel);
    }
  };

export const focusLeftNode = getFocusNodeHandler(
  (n1, n2) => n1.x * 10 + n1.y - n2.x * 10 - n2.y
);

export const focusRightNode = getFocusNodeHandler(
  (n1, n2) => n2.x * 10 + n2.y - n1.x * 10 - n1.y
);

export const focusDownNode = getFocusNodeHandler(
  (n1, n2) => n1.x + n1.y * 10 - n2.x - n2.y * 10
);

export const focusUpNode = getFocusNodeHandler(
  (n1, n2) => n2.x + n2.y * 10 - n1.x - n1.y * 10
);

export const goToConnectedPort = (
  data: GraphModel,
  node: NodeModel,
  port: PortModel,
  svgRef: React.RefObject<SVGSVGElement>,
  evt: React.KeyboardEvent,
  eventChannel: EventChannel
) => {
  const neighborPorts = getNeighborPorts(data, node.id, port.id);

  if (neighborPorts.length === 1 && svgRef.current) {
    const targetNode = data.nodes.get(neighborPorts[0].nodeId);

    if (!targetNode) {
      return;
    }

    const targetPort = targetNode.ports?.find(
      (p) => p.id === neighborPorts[0].portId
    );

    if (!targetPort) {
      return;
    }

    focusItem(
      svgRef,
      { node: targetNode, port: targetPort },
      evt,
      eventChannel
    );
  } else if (neighborPorts.length > 1 && svgRef.current) {
    const onComplete = (nextPort: { nodeId: string; portId: string }) => {
      ReactDOM.unmountComponentAtNode(visitPortHelperContainer);
      if (svgRef.current) {
        const curEditorContainer = svgRef.current.closest(
          ".react-dag-editor-container"
        );

        if (curEditorContainer) {
          curEditorContainer.removeChild(visitPortHelperContainer);
        }
      }

      const targetNode = data.nodes.get(nextPort.nodeId);

      if (!targetNode) {
        return;
      }

      const targetPort = targetNode.ports?.find(
        (p) => p.id === nextPort.portId
      );

      if (!targetPort) {
        return;
      }

      focusItem(
        svgRef,
        { node: targetNode, port: targetPort },
        evt,
        eventChannel
      );
    };

    const visitPortHelperContainer = document.createElement("div");

    const editorContainer = svgRef.current.closest(
      ".react-dag-editor-container"
    );

    if (editorContainer) {
      editorContainer.appendChild(visitPortHelperContainer);
    }

    visitPortHelperContainer.style.position = "fixed";
    visitPortHelperContainer.style.top = "0";

    ReactDOM.render(
      <VisitPortHelper
        neighborPorts={neighborPorts}
        // eslint-disable-next-line react/jsx-no-bind
        onComplete={onComplete}
        data={data}
      />,
      visitPortHelperContainer
    );
  }
};

/**
 * @param data graph data
 * @param node node model
 * @param port port data
 *
 * @returns port arial label
 */
export function defaultGetPortAriaLabel(
  data: GraphModel,
  node: NodeModel,
  port: PortModel
): string | undefined {
  return port.ariaLabel;
}

/**
 *
 * @param node the node data
 *
 * @returns the string value for the aria label
 */
export function defaultGetNodeAriaLabel(node: NodeModel): string | undefined {
  return node.ariaLabel;
}
