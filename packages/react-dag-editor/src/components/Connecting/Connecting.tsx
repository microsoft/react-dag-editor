import * as React from "react";
import { useConnectingState } from "../../hooks/context";
import type { IGraphConfig } from "../../models/config/types";
import type { IPoint, IViewport } from "../../models/geometry";
import { transformPoint } from "../../utils";
import type { EventChannel } from "../../utils/eventChannel";
import { emptyLine, ILine } from "../Line";
import { ConnectingLine } from "./ConnectingLine";

interface IConnectingProps {
  graphConfig: IGraphConfig;
  styles?: React.CSSProperties;
  eventChannel: EventChannel;
  viewport: IViewport;
  movingPoint: IPoint | undefined;
}

export const Connecting = React.memo<IConnectingProps>(props => {
  const { styles, graphConfig, viewport, movingPoint } = props;
  const { sourcePort, sourceNode, targetPort, targetNode } = useConnectingState();
  if (!sourceNode || !sourcePort) {
    return null;
  }
  const sourcePortPosition = sourceNode.getPortPosition(sourcePort.id, graphConfig);
  let targetPortPosition: IPoint | undefined;
  let isAttach = false;
  if (targetNode && targetPort) {
    isAttach = true;
    targetPortPosition = targetNode?.getPortPosition(targetPort.id, graphConfig);
  } else {
    targetPortPosition = sourcePortPosition;
  }

  if (!sourcePortPosition || !targetPortPosition) {
    return null;
  }
  const sourcePoint = transformPoint(sourcePortPosition.x, sourcePortPosition.y, viewport.transformMatrix);
  const targetPoint = transformPoint(targetPortPosition.x, targetPortPosition.y, viewport.transformMatrix);
  const connectingLine: ILine = movingPoint
    ? {
        x1: sourcePoint.x,
        y1: sourcePoint.y,
        x2: movingPoint.x,
        y2: movingPoint.y,
        visible: !isAttach
      }
    : emptyLine();
  const autoAttachLine: ILine = {
    x1: sourcePoint.x,
    y1: sourcePoint.y,
    x2: targetPoint.x,
    y2: targetPoint.y,
    visible: isAttach
  };
  return <ConnectingLine connectingLine={connectingLine} autoAttachLine={autoAttachLine} styles={styles} />;
});

Connecting.displayName = "Connecting";
