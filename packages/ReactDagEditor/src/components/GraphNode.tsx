/* eslint-disable react/jsx-no-bind */
import * as React from "react";
import { useTheme } from "../hooks";
import { GraphNodeEvent, INodeCommonEvent, INodeContextMenuEvent } from "../models/event";
import { IViewport } from "../models/geometry";
import { NodeModel } from "../models/NodeModel";
import { INodeConfig } from "../models/settings";
import { getNodeAutomationId, getNodeUid } from "../utils";
import { EventChannel } from "../utils/eventChannel";
import { checkIsMultiSelect } from "../utils/keyboard";
import classes from "./Graph.styles.m.scss";
import { IGraphProps } from "./Graph/IGraphProps";

export interface IGraphNodeCommonProps {
  isNodeEditDisabled?: boolean;
  eventChannel: EventChannel;
  viewport: Required<IViewport>;
  getNodeAriaLabel: Required<IGraphProps>["getNodeAriaLabel"];
  graphId: string;
}

export interface IGraphNodeProps extends IGraphNodeCommonProps {
  node: NodeModel;
  nodeConfig: INodeConfig;
}

const GraphNode: React.FunctionComponent<IGraphNodeProps> = props => {
  const { node, eventChannel, getNodeAriaLabel, viewport, graphId, nodeConfig } = props;
  const { theme } = useTheme();

  const nodeEvent = (type: (INodeCommonEvent | INodeContextMenuEvent)["type"]) => (
    evt: React.SyntheticEvent | React.MouseEvent
  ) => {
    evt.persist();
    const e = {
      type,
      node,
      rawEvent: evt
    } as INodeCommonEvent | INodeContextMenuEvent;
    eventChannel.trigger(e);
  };

  const clickEvent: React.MouseEventHandler = e => {
    e.persist();
    eventChannel.trigger({
      type: GraphNodeEvent.Click,
      rawEvent: e,
      isMultiSelect: checkIsMultiSelect(e),
      node
    });
  };

  const id = getNodeUid(graphId, node);

  const automationId = node.automationId ?? getNodeAutomationId(node);

  return (
    <g
      id={id}
      // for IE and Edge
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
      onKeyDown={nodeEvent(GraphNodeEvent.KeyDown)}
      onClick={clickEvent}
      aria-label={getNodeAriaLabel(node)}
      role="group"
      aria-roledescription="node"
      data-automation-id={automationId}
    >
      <g className="node-box-container">
        {nodeConfig.render({
          model: node,
          theme,
          viewport
        })}
      </g>
    </g>
  );
};

export { GraphNode };
