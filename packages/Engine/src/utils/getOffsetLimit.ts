import { getClientDeltaByPointDelta } from "../utils/transformMatrix";
import { GraphModel } from "../models/GraphModel";
import { memoize } from "../utils/memoize";
import { IGraphConfig } from "../contexts/GraphConfigContext";
import { IContainerRect, IGap } from "../Graph.interface";
import { TTransformMatrix, getContentArea as getContentAreaRaw } from "./zoomAndPan";

export interface IOffsetLimit {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const getContentArea = memoize(getContentAreaRaw);

export const getOffsetLimit = (
  data: GraphModel,
  graphConfig: IGraphConfig,
  rect: IContainerRect,
  transformMatrix: TTransformMatrix,
  groupPadding?: IGap
): IOffsetLimit => {
  const contentArea = getContentArea(data, graphConfig);
  const nodeMin = getClientDeltaByPointDelta(
    contentArea.minNodeX - (groupPadding?.left || 0),
    contentArea.minNodeY - (groupPadding?.top || 0),
    transformMatrix
  );
  const nodeMax = getClientDeltaByPointDelta(
    contentArea.maxNodeX + (groupPadding?.right || 0),
    contentArea.maxNodeY + (groupPadding?.bottom || 0),
    transformMatrix
  );
  let minX = -nodeMin.x || 0;
  let minY = -nodeMin.y || 0;
  let maxX = rect.width - nodeMax.x || 0;
  let maxY = rect.height - nodeMax.y || 0;
  if (maxX < minX) {
    const temp = maxX;
    maxX = minX;
    minX = temp;
  }
  if (maxY < minY) {
    const temp = maxY;
    maxY = minY;
    minY = temp;
  }
  return {
    minX,
    minY,
    maxX,
    maxY
  };
};
