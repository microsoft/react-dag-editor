import * as React from "react";
import { ConnectingStateContext } from "../contexts/ConnectingStateContext";
import { useGraphConfig } from "../hooks/context";
import { IViewport } from "../models/geometry";
import { ICanvasPort } from "../models/port";
import { GraphPortState } from "../models/element-state";
import { GraphModel } from "../models/GraphModel";
import { NodeModel } from "../models/NodeModel";
import { hasState } from "../utils";

interface IPortTooltipsProps {
  port: ICanvasPort;
  parentNode: NodeModel;
  data: GraphModel;
  viewport: Required<IViewport>;
}

export const PortTooltips: React.FunctionComponent<IPortTooltipsProps> = (props) => {
  const graphConfig = useGraphConfig();

  const { parentNode, port, viewport } = props;

  const isPortTooltipsVisible = hasState(GraphPortState.activated)(port.state);

  if (!isPortTooltipsVisible) {
    return null;
  }

  const portShape = port.shape ? port.shape : graphConfig.defaultPortShape;
  const portConfig = graphConfig.getPortConfigByName(portShape);
  if (!portConfig || !portConfig.renderTooltips) {
    return null;
  }

  const pos = parentNode.getPortPosition(port.id, graphConfig);

  if (!pos) {
    return null;
  }

  return (
    <div className="port-tooltips">
      <ConnectingStateContext.Consumer>
        {({ sourceNode, sourcePort }) =>
          portConfig.renderTooltips &&
          portConfig.renderTooltips({
            model: port,
            parentNode,
            data: props.data,
            anotherNode: sourceNode,
            anotherPort: sourcePort,
            viewport,
            ...pos,
          })
        }
      </ConnectingStateContext.Consumer>
    </div>
  );
};
