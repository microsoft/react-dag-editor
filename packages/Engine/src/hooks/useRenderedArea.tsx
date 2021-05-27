import { useMemo } from "react";
import { IViewPort } from "../contexts";
import { getRenderedArea, IRectShape } from "../utils";

export const useRenderedArea = (viewPort: IViewPort, isVirtualizationEnabled: boolean): IRectShape => {
  return useMemo<IRectShape>(() => {
    return isVirtualizationEnabled
      ? getRenderedArea(viewPort)
      : {
          minX: -Number.MAX_SAFE_INTEGER,
          minY: -Number.MAX_SAFE_INTEGER,
          maxX: Number.MAX_SAFE_INTEGER,
          maxY: Number.MAX_SAFE_INTEGER
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewPort, isVirtualizationEnabled]);
};
