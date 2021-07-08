import * as React from "react";
import { emptyDummyNodes } from "../components/dummyNodes";
import { IGraphConfig, IGraphReactReducer } from "../contexts";
import { GraphFeatures } from "../Features";
import { IDummyNode, IDummyNodes } from "../models/dummy-node";
import {
  GraphCanvasEvent,
  GraphNodeEvent,
  ICanvasAddNodeEvent,
  INodeCentralizeEvent,
  INodeDragEndEvent,
  INodeDragEvent,
  INodeDragStartEvent,
  INodeLocateEvent
} from "../models/event";
import { GraphNodeState } from "../models/element-state";
import { GraphModel } from "../models/GraphModel";
import { GraphBehavior, IGraphState } from "../models/state";
import {
  addState,
  focusArea,
  getContentArea,
  getNodeSize,
  getPointDeltaByClientDelta,
  getRelativePoint,
  getRenderedNodes,
  isSelected,
  isViewportComplete,
  pan,
  pushHistory,
  removeState,
  scrollIntoView,
  transformPoint,
  unSelectAllEntity,
  updateState,
  zoom
} from "../utils";
import { getAlignmentLines, getAutoAlignDisplacement } from "../utils/autoAlign";
import { graphController } from "../utils/graphController";
import { pipe } from "../utils/pipe";

const getDelta = (start: number, end: number, value: number): number => {
  if (value < start) {
    return -10;
  }
  if (value > end) {
    return 10;
  }
  return 0;
};

function getSelectedNodes(data: GraphModel, graphConfig: IGraphConfig): IDummyNode[] {
  const nodes: IDummyNode[] = [];
  data.nodes.forEach(node => {
    if (!isSelected(node)) {
      return;
    }
    nodes.push({
      id: node.id,
      x: node.x,
      y: node.y,
      ...getNodeSize(node, graphConfig)
    });
  });
  return nodes;
}

function dragNodeHandler(state: IGraphState, event: INodeDragEvent): IGraphState {
  if (!isViewportComplete(state.viewport)) {
    return state;
  }
  const e = event.rawEvent as MouseEvent;
  const { rect } = state.viewport;
  const nextState = {
    ...state
  };
  const data = state.data.present;
  const viewportDx = getDelta(rect.left, rect.right, e.clientX);
  const viewportDy = getDelta(rect.top, rect.bottom, e.clientY);
  const scale = viewportDx !== 0 || viewportDy !== 0 ? 0.999 : 1;
  const viewport =
    viewportDx !== 0 || viewportDx !== 0
      ? pipe(pan(-viewportDx, -viewportDy), zoom(scale, getRelativePoint(rect, e)))(state.viewport)
      : state.viewport;
  const delta = getPointDeltaByClientDelta(
    event.dx + viewportDx * scale,
    event.dy + viewportDy * scale,
    viewport.transformMatrix
  );
  const dummyNodes: IDummyNodes = {
    ...state.dummyNodes,
    dx: state.dummyNodes.dx + delta.x,
    dy: state.dummyNodes.dy + delta.y,
    isVisible: event.isVisible
  };
  if (event.isAutoAlignEnable) {
    const renderedNodes = getRenderedNodes(data.nodes, state.viewport);
    if (renderedNodes.length < event.autoAlignThreshold) {
      const nodes = dummyNodes.nodes.map(it => ({
        ...it,
        x: it.x + dummyNodes.dx,
        y: it.y + dummyNodes.dy
      }));
      const alignmentLines = getAlignmentLines(
        nodes,
        renderedNodes,
        state.settings.graphConfig,
        state.viewport.transformMatrix[0] > 0.3 ? 2 : 5
      );
      if (alignmentLines.length) {
        const dxAligned = getAutoAlignDisplacement(alignmentLines, nodes, state.settings.graphConfig, "x");
        const dyAligned = getAutoAlignDisplacement(alignmentLines, nodes, state.settings.graphConfig, "y");
        dummyNodes.alignedDX = dummyNodes.dx + dxAligned;
        dummyNodes.alignedDY = dummyNodes.dy + dyAligned;
      } else {
        dummyNodes.alignedDX = undefined;
        dummyNodes.alignedDY = undefined;
      }
      nextState.alignmentLines = alignmentLines;
    } else {
      dummyNodes.alignedDX = undefined;
      dummyNodes.alignedDY = undefined;
    }
  }
  nextState.dummyNodes = dummyNodes;
  nextState.viewport = viewport;
  return nextState;
}

function handleDraggingNewNode(state: IGraphState, action: ICanvasAddNodeEvent): IGraphState {
  if (!state.settings.features.has(GraphFeatures.autoAlign)) {
    return state;
  }
  const data = state.data.present;
  const renderedNodes = getRenderedNodes(data.nodes, state.viewport);
  const alignmentLines = getAlignmentLines(
    [action.node],
    renderedNodes,
    state.settings.graphConfig,
    state.viewport.transformMatrix[0] > 0.3 ? 2 : 5
  );
  return {
    ...state,
    alignmentLines
  };
}

function dragStart(state: IGraphState, action: INodeDragStartEvent): IGraphState {
  let data = state.data.present;
  const targetNode = data.nodes.get(action.node.id);
  if (!targetNode) {
    return state;
  }
  let selectedNodes: IDummyNode[];
  if (action.isMultiSelect) {
    data = data.selectNodes(node => node.id === action.node.id || isSelected(node));
    selectedNodes = getSelectedNodes(data, state.settings.graphConfig);
  } else if (!isSelected(targetNode)) {
    selectedNodes = [
      {
        id: action.node.id,
        x: action.node.x,
        y: action.node.y,
        ...getNodeSize(action.node, state.settings.graphConfig)
      }
    ];
  } else {
    selectedNodes = getSelectedNodes(data, state.settings.graphConfig);
  }
  return {
    ...state,
    data: {
      ...state.data,
      present: data
    },
    dummyNodes: {
      ...emptyDummyNodes(),
      isVisible: false,
      nodes: selectedNodes
    }
  };
}

function dragEnd(state: IGraphState, action: INodeDragEndEvent): IGraphState {
  let data = state.data.present;
  if (action.isDragCanceled) {
    return {
      ...state,
      alignmentLines: [],
      dummyNodes: emptyDummyNodes()
    };
  }
  const { dx, dy } = state.dummyNodes;
  data = data.updateNodesPositionAndSize(
    state.dummyNodes.nodes.map(node => ({
      ...node,
      x: node.x + dx,
      y: node.y + dy,
      width: undefined,
      height: undefined
    }))
  );
  return {
    ...state,
    alignmentLines: [],
    dummyNodes: emptyDummyNodes(),
    data: pushHistory(state.data, data, unSelectAllEntity())
  };
}

// centralize node or locate node to the specific position
function locateNode(action: INodeCentralizeEvent | INodeLocateEvent, state: IGraphState): IGraphState {
  const data = state.data.present;
  if (!isViewportComplete(state.viewport) || !action.nodes.length) {
    return state;
  }
  if (action.nodes.length === 1) {
    const nodeId = action.nodes[0];
    const node = data.nodes.get(nodeId);
    if (!node) {
      return state;
    }

    const { width, height } = getNodeSize(node, state.settings.graphConfig);
    const nodeX = action.type === GraphNodeEvent.Centralize ? node.x + width / 2 : node.x;
    const nodeY = action.type === GraphNodeEvent.Centralize ? node.y + height / 2 : node.y;

    const { x: clientX, y: clientY } = transformPoint(nodeX, nodeY, state.viewport.transformMatrix);
    const position = action.type === GraphNodeEvent.Locate ? action.position : undefined;

    return {
      ...state,
      viewport: scrollIntoView(clientX, clientY, state.viewport.rect, true, position)(state.viewport)
    };
  }
  const { minNodeX, minNodeY, maxNodeX, maxNodeY } = getContentArea(
    data,
    state.settings.graphConfig,
    new Set(action.nodes)
  );
  return {
    ...state,
    viewport: focusArea(minNodeX, minNodeY, maxNodeX, maxNodeY, state.viewport)
  };
}

export const nodeReducer: IGraphReactReducer = (state, action) => {
  const data = state.data.present;
  switch (action.type) {
    //#region resize
    case GraphNodeEvent.ResizingStart:
      return {
        ...state,
        dummyNodes: {
          ...emptyDummyNodes(),
          isVisible: true,
          nodes: getSelectedNodes(data, state.settings.graphConfig)
        }
      };
    case GraphNodeEvent.Resizing:
      return {
        ...state,
        dummyNodes: {
          ...state.dummyNodes,
          dx: action.dx,
          dy: action.dy,
          dWidth: action.dWidth,
          dHeight: action.dHeight
        }
      };
    case GraphNodeEvent.ResizingEnd: {
      const { dx, dy, dWidth, dHeight } = state.dummyNodes;
      return {
        ...state,
        dummyNodes: emptyDummyNodes(),
        data: pushHistory(
          state.data,
          data.updateNodesPositionAndSize(
            state.dummyNodes.nodes.map(node => ({
              ...node,
              x: node.x + dx,
              y: node.y + dy,
              width: node.width + dWidth,
              height: node.height + dHeight
            }))
          ),
          unSelectAllEntity()
        )
      };
    }
    //#endregion resize

    //#region drag
    case GraphNodeEvent.DragStart:
      return dragStart(state, action);
    case GraphNodeEvent.Drag:
      return dragNodeHandler(state, action);
    case GraphNodeEvent.DragEnd:
      return dragEnd(state, action);
    //#endregion drag

    case GraphNodeEvent.PointerEnter:
      switch (state.behavior) {
        case GraphBehavior.connecting:
          if ((action.rawEvent as React.PointerEvent).pointerId !== graphController.pointerId) {
            return state;
          }
        // eslint-disable-next-line no-fallthrough
        case GraphBehavior.default:
          return {
            ...state,
            data: {
              ...state.data,
              present: data.updateNode(action.node.id, updateState(addState(GraphNodeState.activated)))
            }
          };
        default:
          return state;
      }
    case GraphNodeEvent.PointerLeave:
      switch (state.behavior) {
        case GraphBehavior.default:
        case GraphBehavior.connecting:
          return {
            ...state,
            data: {
              ...state.data,
              present: data.updateNode(action.node.id, updateState(removeState(GraphNodeState.activated)))
            }
          };
        default:
          return state;
      }
    case GraphCanvasEvent.DraggingNodeFromItemPanel:
      return handleDraggingNewNode(state, action);
    case GraphCanvasEvent.DraggingNodeFromItemPanelEnd: {
      if (action.node) {
        return {
          ...state,
          alignmentLines: [],
          data: pushHistory(
            state.data,
            state.data.present.insertNode({
              ...action.node,
              state: GraphNodeState.selected
            }),
            unSelectAllEntity()
          )
        };
      }
      return {
        ...state,
        alignmentLines: []
      };
    }
    case GraphNodeEvent.Centralize:
    case GraphNodeEvent.Locate:
      return locateNode(action, state);
    case GraphNodeEvent.Add:
      return {
        ...state,
        data: pushHistory(state.data, data.insertNode(action.node))
      };
    default:
      return state;
  }
};
