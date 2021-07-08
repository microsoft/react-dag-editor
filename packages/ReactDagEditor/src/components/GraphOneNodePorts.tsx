import * as React from "react";
import { GraphConfigContext, IGraphConfig } from "../contexts";
import { ConnectingStateContext } from "../contexts/ConnectingStateContext";
import { useTheme } from "../hooks";
import { GraphPortEvent } from "../models/event";
import { GraphModel } from "../models/GraphModel";
import { NodeModel } from "../models/NodeModel";
import { ICanvasPort } from "../models/port";
import { getPortAutomationId, getPortUid } from "../utils";
import { Debug } from "../utils/debug";
import { IGraphProps } from "./Graph/IGraphProps";
import { IGraphNodeCommonProps } from "./GraphNode";

export interface IGraphOneNodePortsProps
  extends Required<Omit<IGraphNodeCommonProps, "onNodeEvent" | "isNodeEditDisabled">> {
  node: NodeModel;
  data: GraphModel;
  getPortAriaLabel: Required<IGraphProps>["getPortAriaLabel"];
}

export const GraphOneNodePorts: React.FunctionComponent<IGraphOneNodePortsProps> = props => {
  const { data, node, getPortAriaLabel, eventChannel, viewport, graphId } = props;
  const graphConfig = React.useContext<IGraphConfig>(GraphConfigContext);
  const { theme } = useTheme();

  const ports = node.ports;

  if (!ports) {
    return null;
  }

  const portEvent = (type: GraphPortEvent, port: ICanvasPort) => (e: React.SyntheticEvent): void => {
    e.persist();
    eventChannel.trigger({
      type,
      node,
      port,
      rawEvent: e
    });
  };

  return (
    <g>
      {ports.map(p => {
        const portShape = p.shape ? p.shape : graphConfig.defaultPortShape;
        const portConfig = graphConfig.getPortConfigByName(portShape);

        if (!portConfig || !portConfig.render) {
          Debug.warn(`invalid port config ${node.id}:${node.name} - ${p.id}:${p.name}, shape: ${p.shape}`);

          return null;
        }

        const pos = node.getPortPosition(p.id, graphConfig);
        if (!pos) {
          return null;
        }

        const portKey = getPortUid(graphId, node, p);
        const automationId = p.automationId ?? getPortAutomationId(p, node);

        return (
          <g
            key={portKey}
            id={portKey}
            tabIndex={0}
            // for IE and Edge
            focusable="true"
            onPointerDown={portEvent(GraphPortEvent.PointerDown, p)}
            onPointerUp={portEvent(GraphPortEvent.PointerUp, p)}
            onDoubleClick={portEvent(GraphPortEvent.DoubleClick, p)}
            onMouseDown={portEvent(GraphPortEvent.MouseDown, p)}
            onMouseUp={portEvent(GraphPortEvent.MouseUp, p)}
            onContextMenu={portEvent(GraphPortEvent.ContextMenu, p)}
            onPointerEnter={portEvent(GraphPortEvent.PointerEnter, p)}
            onPointerLeave={portEvent(GraphPortEvent.PointerLeave, p)}
            onMouseMove={portEvent(GraphPortEvent.MouseMove, p)}
            onMouseOver={portEvent(GraphPortEvent.MouseOver, p)}
            onMouseOut={portEvent(GraphPortEvent.MouseOut, p)}
            onFocus={portEvent(GraphPortEvent.Focus, p)}
            onBlur={portEvent(GraphPortEvent.Blur, p)}
            onKeyDown={portEvent(GraphPortEvent.KeyDown, p)}
            aria-label={getPortAriaLabel(data, node, p)}
            role="group"
            aria-roledescription="port"
            data-automation-id={automationId}
          >
            <ConnectingStateContext.Consumer>
              {({ sourceNode, sourcePort }) =>
                portConfig?.render({
                  model: p,
                  data,
                  parentNode: node,
                  theme,
                  anotherNode: sourceNode,
                  anotherPort: sourcePort,
                  zoomPanSettings: viewport,
                  containerRect: viewport.rect,
                  viewport,
                  ...pos
                })
              }
            </ConnectingStateContext.Consumer>
          </g>
        );
      })}
    </g>
  );
};
