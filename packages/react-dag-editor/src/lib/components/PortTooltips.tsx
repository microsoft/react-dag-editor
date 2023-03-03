import * as React from "react";
import { ConnectingStateContext } from "../contexts/ConnectingStateContext";
import { useGraphConfig } from "../hooks/context";
import { IViewport } from "../models/geometry";
import { ICanvasPort } from "../models/port";
import { GraphModel } from "../models/GraphModel";
import { NodeModel } from "../models/NodeModel";
import { GraphPortStatus } from "../models/status";
import * as Bitset from "../utils/bitset";

interface IPortTooltipsProps {
  port: ICanvasPort;
  parentNode: NodeModel;
  data: GraphModel;
  viewport: Required<IViewport>;
}

export const PortTooltips: React.FunctionComponent<IPortTooltipsProps> = (
  props
) => {
  const graphConfig = useGraphConfig();

  const { parentNode, port, viewport } = props;

  const isPortTooltipsVisible = Bitset.has(GraphPortStatus.Activated)(
    port.status
  );

  if (!isPortTooltipsVisible) {
    return null;
  }

  const portConfig = graphConfig.getPortConfig(port);
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
