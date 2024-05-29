import * as React from "react";

import { GraphFeatures } from "../Features";

export const useFeatureControl = (features: ReadonlySet<GraphFeatures>) => {
  return React.useMemo(() => {
    const isNodesDraggable = features.has(GraphFeatures.NodeDraggable);
    const isNodeResizable = features.has(GraphFeatures.NodeResizable);
    const isAutoFitDisabled = !features.has(GraphFeatures.AutoFit);
    const isPanDisabled = !features.has(GraphFeatures.PanCanvas);
    const isMultiSelectDisabled = !features.has(GraphFeatures.MultipleSelect);
    const isLassoSelectEnable = features.has(GraphFeatures.LassoSelect);
    const isNodeHoverViewEnabled = features.has(GraphFeatures.NodeHoverView);
    const isClickNodeToSelectDisabled = !features.has(
      GraphFeatures.ClickNodeToSelect
    );
    const isConnectDisabled = !features.has(GraphFeatures.AddNewEdges);
    const isPortHoverViewEnable = features.has(GraphFeatures.PortHoverView);
    const isNodeEditDisabled = !features.has(GraphFeatures.EditNode);
    const isVerticalScrollDisabled = !features.has(
      GraphFeatures.CanvasVerticalScrollable
    );
    const isHorizontalScrollDisabled = !features.has(
      GraphFeatures.CanvasHorizontalScrollable
    );
    const isA11yEnable = features.has(GraphFeatures.A11yFeatures);
    const isAutoAlignEnable = features.has(GraphFeatures.AutoAlign);
    const isCtrlKeyZoomEnable = features.has(GraphFeatures.CtrlKeyZoom);
    const isLimitBoundary = features.has(GraphFeatures.LimitBoundary);
    const isVirtualizationEnabled = !features.has(GraphFeatures.AutoFit);
    const isEdgeEditable = features.has(GraphFeatures.EditEdge);
    const isDeleteDisabled = !features.has(GraphFeatures.Delete);
    const isPasteDisabled =
      !features.has(GraphFeatures.AddNewNodes) ||
      !features.has(GraphFeatures.AddNewEdges);
    const isUndoEnabled = features.has(GraphFeatures.UndoStack);
    const isScrollbarVisible =
      (!isVerticalScrollDisabled ||
        !isHorizontalScrollDisabled ||
        !isPanDisabled) &&
      isLimitBoundary &&
      !features.has(GraphFeatures.InvisibleScrollbar);

    return {
      isNodesDraggable,
      isNodeResizable,
      isAutoFitDisabled,
      isPanDisabled,
      isMultiSelectDisabled,
      isLassoSelectEnable,
      isNodeHoverViewEnabled,
      isClickNodeToSelectDisabled,
      isConnectDisabled,
      isPortHoverViewEnable,
      isNodeEditDisabled,
      isVerticalScrollDisabled,
      isHorizontalScrollDisabled,
      isA11yEnable,
      isAutoAlignEnable,
      isCtrlKeyZoomEnable,
      isLimitBoundary,
      isVirtualizationEnabled,
      isEdgeEditable,
      isDeleteDisabled,
      isPasteDisabled,
      isUndoEnabled,
      isScrollbarVisible,
    };
  }, [features]);
};
