import type { IGraphConfig } from "../models/config/types";
import type { IContainerRect, IGap, ITransformMatrix } from "../models/geometry";
import type { GraphModel } from "../models/GraphModel";
import { memoize } from "../utils/memoize";
import { getClientDeltaByPointDelta } from "../utils/transformMatrix";
import { getContentArea as getContentAreaRaw } from "./viewport";

export interface IOffsetLimit {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const getContentArea = memoize(getContentAreaRaw);

export interface IOffsetLimitParams {
  data: GraphModel;
  graphConfig: IGraphConfig;
  rect: IContainerRect;
  transformMatrix: ITransformMatrix;
  canvasBoundaryPadding?: IGap;
  groupPadding?: IGap;
}

export const getOffsetLimit = ({
  data,
  graphConfig,
  rect,
  transformMatrix,
  canvasBoundaryPadding,
  groupPadding
}: IOffsetLimitParams): IOffsetLimit => {
  const contentArea = getContentArea(data, graphConfig);
  const nodeMin = getClientDeltaByPointDelta(
    contentArea.minNodeX - (groupPadding?.left || 0),
    contentArea.minNodeY - (groupPadding?.top || 0),
    transformMatrix
  );
  nodeMin.x -= canvasBoundaryPadding?.left ?? 0;
  nodeMin.y -= canvasBoundaryPadding?.top ?? 0;
  const nodeMax = getClientDeltaByPointDelta(
    contentArea.maxNodeX + (groupPadding?.right || 0),
    contentArea.maxNodeY + (groupPadding?.bottom || 0),
    transformMatrix
  );
  nodeMax.x += canvasBoundaryPadding?.right ?? 0;
  nodeMax.y += canvasBoundaryPadding?.bottom ?? 0;
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
