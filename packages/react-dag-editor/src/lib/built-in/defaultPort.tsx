import * as React from "react";
import type { ICanvasNode } from "../models/node";
import type { ICanvasPort } from "../models/port";
import { GraphModel } from "../models/GraphModel";
import { GraphPortStatus } from "../models/status";
import * as Bitset from "../utils/bitset";
import type { IPortConfig, IPortDrawArgs } from "../models/config/types";
import { defaultColors } from "../common/constants";

class DefaultPort implements IPortConfig {
  public getStyle(
    port: ICanvasPort,
    parentNode: ICanvasNode,
    data: GraphModel,
    connectedAsSource: boolean,
    connectedAsTarget: boolean
  ): Partial<React.CSSProperties> {
    const stroke = defaultColors.portStroke;
    let fill = defaultColors.portFill;

    if (connectedAsSource || connectedAsTarget) {
      fill = defaultColors.connectedPortColor;
    }

    if (Bitset.has(GraphPortStatus.Activated)(port.status)) {
      fill = defaultColors.primaryColor;
    }

    return {
      stroke,
      fill,
    };
  }

  public getIsConnectable(): boolean | undefined {
    return true;
  }

  public render(args: IPortDrawArgs): React.ReactNode {
    const { model: port, data, parentNode } = args;

    const connectedAsSource = data.isPortConnectedAsSource(
      parentNode.id,
      port.id
    );
    const connectedAsTarget = data.isPortConnectedAsTarget(
      parentNode.id,
      port.id
    );

    const style = this.getStyle(
      port,
      parentNode,
      data,
      connectedAsSource,
      connectedAsTarget
    );

    const { x, y } = args;
    const polygonPoints = `${x - 5} ${y}, ${x + 7} ${y}, ${x + 1} ${y + 8}`;

    return connectedAsTarget ? (
      <polygon points={polygonPoints} style={style} />
    ) : (
      <circle
        key={`${args.parentNode.id}-${args.model.id}`}
        r={5}
        cx={x}
        cy={y}
        style={style}
      />
    );
  }
}

export const defaultPort = new DefaultPort();
