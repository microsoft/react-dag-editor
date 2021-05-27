import * as React from "react";
import { GraphCanvasEvent } from "../common/GraphEvent.constant";
import { ISelectBoxPosition } from "../components/Graph/SelectBox";
import { IDispatch } from "../contexts/GraphStateContext";
import { useDeferredValue } from "./useDeferredValue";

export const useSelectBox = (dispatch: IDispatch, selectBoxPositionState: ISelectBoxPosition) => {
  const selectBoxPosition = useDeferredValue<ISelectBoxPosition>(selectBoxPositionState, { timeout: 100 });

  React.useEffect(() => {
    dispatch({
      type: GraphCanvasEvent.UpdateNodeSelectionBySelectBox
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectBoxPosition]);
};
