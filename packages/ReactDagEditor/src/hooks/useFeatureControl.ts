import * as React from "react";

import { GraphFeatures } from "../Features";

export const useFeatureControl = (features: ReadonlySet<GraphFeatures>) => {
  return React.useMemo(() => {
    const isNodesDraggable = features.has(GraphFeatures.nodeDraggable);
    const isNodeResizable = features.has(GraphFeatures.nodeResizable);
    const isAutoFitDisabled = !features.has(GraphFeatures.autoFit);
    const isPanDisabled = !features.has(GraphFeatures.panCanvas);
    const isMultiSelectDisabled = !features.has(GraphFeatures.multipleSelect);
    const isLassoSelectEnable = features.has(GraphFeatures.lassoSelect);
    const isNodeHoverViewEnabled = features.has(GraphFeatures.nodeHoverView);
    const isClickNodeToSelectDisabled = !features.has(GraphFeatures.clickNodeToSelect);
    const isConnectDisabled = !features.has(GraphFeatures.addNewEdges);
    const isPortHoverViewEnable = features.has(GraphFeatures.portHoverView);
    const isNodeEditDisabled = !features.has(GraphFeatures.editNode);
    const isVerticalScrollDisabled = !features.has(GraphFeatures.canvasVerticalScrollable);
    const isHorizontalScrollDisabled = !features.has(GraphFeatures.canvasHorizontalScrollable);
    const isSidePanelEnabled = features.has(GraphFeatures.sidePanel);
    const isA11yEnable = features.has(GraphFeatures.a11yFeatures);
    const isAutoAlignEnable = features.has(GraphFeatures.autoAlign);
    const isCtrlKeyZoomEnable = features.has(GraphFeatures.ctrlKeyZoom);
    const isLimitBoundary = features.has(GraphFeatures.limitBoundary);
    const isVirtualizationEnabled = !features.has(GraphFeatures.autoFit);
    const isEdgeEditable = features.has(GraphFeatures.editEdge);
    const isDeleteDisabled = !features.has(GraphFeatures.delete);
    const isPasteDisabled = !features.has(GraphFeatures.addNewNodes) || !features.has(GraphFeatures.addNewEdges);
    const isUndoEnabled = features.has(GraphFeatures.undoStack);

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
      isSidePanelEnabled,
      isA11yEnable,
      isAutoAlignEnable,
      isCtrlKeyZoomEnable,
      isLimitBoundary,
      isVirtualizationEnabled,
      isEdgeEditable,
      isDeleteDisabled,
      isPasteDisabled,
      isUndoEnabled
    };
  }, [features]);
};
