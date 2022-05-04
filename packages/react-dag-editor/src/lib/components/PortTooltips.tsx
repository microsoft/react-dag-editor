import * as React from "react";
import { ConnectingStateContext } from "../contexts/ConnectingStateContext";
import { useGraphConfig } from "../hooks/context";
import type { IViewport } from "../models/geometry";
import type { PortModel } from "../models/port";
import { GraphPortStatus } from "../models/status";
import * as Bitset from "../utils/bitset";
import type { ContentState } from "../models/ContentState";
import type { NodeModel } from "../models/node";

interface IPortTooltipsProps {
  port: PortModel;
  parentNode: NodeModel;
  data: ContentState;
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

  const portShape = port.shape ? port.shape : graphConfig.defaultPortShape;
  const portConfig = graphConfig.getPortConfigByName(portShape);
  if (!portConfig || !portConfig.renderTooltips) {
    return null;
  }

  const pos = parentNode.getPortPosition(port.id);

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
