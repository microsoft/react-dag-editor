/* eslint-disable react/jsx-no-bind */
import * as React from "react";
import { useGraphConfig } from "../hooks/context";
import { GraphNodeEvent, INodeCommonEvent, INodeContextMenuEvent } from "../models/event";
import { IViewport } from "../models/geometry";
import { NodeModel } from "../models/NodeModel";
import { getNodeAutomationId, getNodeConfig, getNodeUid } from "../utils";
import { Debug } from "../utils/debug";
import { EventChannel } from "../utils/eventChannel";
import { checkIsMultiSelect } from "../utils/keyboard";
import { IGraphProps } from "./Graph/IGraphProps";
import classes from "./Graph.styles";

export interface IGraphNodeCommonProps {
  isNodeEditDisabled?: boolean;
  eventChannel: EventChannel;
  viewport: Required<IViewport>;
  getNodeAriaLabel: Required<IGraphProps>["getNodeAriaLabel"];
  graphId: string;
}

export interface IGraphNodeProps extends IGraphNodeCommonProps {
  node: NodeModel;
}

const GraphNode: React.FunctionComponent<IGraphNodeProps> = props => {
  const { node, eventChannel, getNodeAriaLabel, viewport, graphId } = props;
  const graphConfig = useGraphConfig();
  const nodeConfig = getNodeConfig(node, graphConfig);

  const nodeEvent =
    (type: (INodeCommonEvent | INodeContextMenuEvent)["type"]) =>
    (evt: React.SyntheticEvent | React.MouseEvent): void => {
      evt.persist();
      const e = {
        type,
        node,
        rawEvent: evt,
      } as INodeCommonEvent | INodeContextMenuEvent;
      eventChannel.trigger(e);
    };

  const onClick = (e: React.MouseEvent): void => {
    e.persist();
    const isMultiSelect = checkIsMultiSelect(e);
    eventChannel.trigger({
      type: GraphNodeEvent.Click,
      rawEvent: e,
      isMultiSelect,
      node,
    });
  };

  const id = getNodeUid(graphId, node);

  const automationId = node.automationId ?? getNodeAutomationId(node);

  if (!nodeConfig?.render) {
    Debug.warn(`Missing "render" method in node config`);

    return null;
  }

  return (
    <g
      id={id}
      // for IE and Edge
      // eslint-disable-next-line react/no-unknown-property
      focusable="true"
      tabIndex={0} // why hard coded 0? - Dynamically calculating tabindex costs a lot in big graph. Then we always let it have tabIndex 0 to be focusable and override the "tab" key behavior.
      className={classes.node}
      onPointerDown={nodeEvent(GraphNodeEvent.PointerDown)}
      onPointerEnter={nodeEvent(GraphNodeEvent.PointerEnter)}
      onPointerMove={nodeEvent(GraphNodeEvent.PointerMove)}
      onPointerLeave={nodeEvent(GraphNodeEvent.PointerLeave)}
      onPointerUp={nodeEvent(GraphNodeEvent.PointerUp)}
      onDoubleClick={nodeEvent(GraphNodeEvent.DoubleClick)}
      onMouseDown={nodeEvent(GraphNodeEvent.MouseDown)}
      onMouseUp={nodeEvent(GraphNodeEvent.MouseUp)}
      onMouseEnter={nodeEvent(GraphNodeEvent.MouseEnter)}
      onMouseLeave={nodeEvent(GraphNodeEvent.MouseLeave)}
      onContextMenu={nodeEvent(GraphNodeEvent.ContextMenu)}
      onMouseMove={nodeEvent(GraphNodeEvent.MouseMove)}
      onMouseOver={nodeEvent(GraphNodeEvent.MouseOver)}
      onMouseOut={nodeEvent(GraphNodeEvent.MouseOut)}
      onClick={onClick}
      onKeyDown={nodeEvent(GraphNodeEvent.KeyDown)}
      aria-label={getNodeAriaLabel(node)}
      role="group"
      aria-roledescription="node"
      data-automation-id={automationId}
    >
      <g className="node-box-container">
        {nodeConfig.render({
          model: node,
          viewport,
        })}
      </g>
    </g>
  );
};

export { GraphNode };
