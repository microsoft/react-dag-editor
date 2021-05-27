import * as React from "react";
import { GraphNodeEvent } from "../common/GraphEvent.constant";
import { GraphConfigContext, IGraphConfig } from "../contexts";
import { IViewPort } from "../contexts/GraphStateContext";
import { INodeCommonEvent, INodeContextMenuEvent } from "../Graph.interface";
import { useTheme } from "../hooks";
import { NodeModel } from "../models/NodeModel";
import { getNodeAutomationId, getNodeConfig, getNodeUid } from "../utils";
import { Debug } from "../utils/debug";
import { EventChannel } from "../utils/eventChannel";
import classes from "./Graph.styles.m.scss";
import { IGraphProps } from "./Graph/IGraphProps";

export interface IGraphNodeCommonProps {
  isNodeEditDisabled?: boolean;
  eventChannel: EventChannel;
  viewPort: Required<IViewPort>;
  getNodeAriaLabel: Required<IGraphProps>["getNodeAriaLabel"];
  graphId: string;
}

export interface IGraphNodeProps extends IGraphNodeCommonProps {
  node: NodeModel;
}

const GraphNode: React.FunctionComponent<IGraphNodeProps> = props => {
  const { node, eventChannel, getNodeAriaLabel, viewPort, graphId } = props;
  const graphConfig = React.useContext<IGraphConfig>(GraphConfigContext);
  const shape = node.shape ? node.shape : graphConfig.defaultNodeShape;
  const nodeConfig = getNodeConfig(node, graphConfig);
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

  const id = getNodeUid(graphId, node);

  const automationId = node.automationId ?? getNodeAutomationId(node);

  if (!nodeConfig.render) {
    Debug.warn(`Missing "render" method in node config ${shape}`);

    return null;
  }

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
      aria-label={getNodeAriaLabel(node)}
      role="group"
      aria-roledescription="node"
      data-automation-id={automationId}
    >
      <g className="node-box-container">
        {nodeConfig.render({
          model: node,
          theme,
          viewPort,
          zoomPanSettings: {
            transformMatrix: viewPort.transformMatrix
          },
          containerRect: viewPort.rect
        })}
      </g>
    </g>
  );
};

export { GraphNode };
