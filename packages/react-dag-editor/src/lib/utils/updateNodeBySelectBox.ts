import type { ISelectBoxPosition } from "../components/Graph/SelectBox";
import { selectNodes } from "../content-utils";
import type { IGraphConfig } from "../models/config/types";
import type { ContentState } from "../models/ContentState";
import type { IRectShape, ITransformMatrix } from "../models/geometry";
import { checkRectIntersect } from "./geometric";
import { getNodeSize } from "./layout";
import { reverseTransformPoint } from "./transformMatrix";

export const selectNodeBySelectBox = (
  graphConfig: IGraphConfig,
  transformMatrix: ITransformMatrix,
  selectBox: ISelectBoxPosition,
  data: ContentState
): ContentState => {
  if (!selectBox.width || !selectBox.height) {
    return data;
  }

  const selectAreaMinX = Math.min(
    selectBox.startX,
    selectBox.startX + selectBox.width
  );
  const selectAreaMaxX = Math.max(
    selectBox.startX,
    selectBox.startX + selectBox.width
  );
  const selectAreaMinY = Math.min(
    selectBox.startY,
    selectBox.startY + selectBox.height
  );
  const selectAreaMaxY = Math.max(
    selectBox.startY,
    selectBox.startY + selectBox.height
  );

  const primeSelectionMin = reverseTransformPoint(
    selectAreaMinX,
    selectAreaMinY,
    transformMatrix
  );
  const primeSelectionMax = reverseTransformPoint(
    selectAreaMaxX,
    selectAreaMaxY,
    transformMatrix
  );

  // padding box does not apply transform matrix
  const primeRectSelectionBox: IRectShape = {
    minX: primeSelectionMin.x,
    minY: primeSelectionMin.y,
    maxX: primeSelectionMax.x,
    maxY: primeSelectionMax.y,
  };

  return data.pipe(
    selectNodes((n) => {
      const { width, height } = getNodeSize(n, graphConfig);
      const rectNode: IRectShape = {
        minX: n.x,
        minY: n.y,
        maxX: n.x + width,
        maxY: n.y + height,
      };
      return checkRectIntersect(primeRectSelectionBox, rectNode);
    })
  );
};
