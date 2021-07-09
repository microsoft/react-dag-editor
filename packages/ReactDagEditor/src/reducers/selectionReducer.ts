import { emptySelectBoxPosition } from "../components/Graph/SelectBox";
import { IGraphReactReducer } from "../contexts";
import { GraphFeatures } from "../Features";
import { GraphCanvasEvent, GraphNodeEvent, ICanvasNavigateEvent } from "../models/event";
import { GraphPortState } from "../models/element-state";
import { GraphBehavior, IGraphState } from "../models/state";
import { addState, getRelativePoint, nodeSelection, unSelectAllEntity, updateState } from "../utils";
import { selectNodeBySelectBox } from "../utils/updateNodeBySelectBox";

function handleNavigate(state: IGraphState, action: ICanvasNavigateEvent): IGraphState {
  let data = unSelectAllEntity()(state.data.present);
  if (action.node && action.port) {
    data = data.updatePort(action.node.id, action.port.id, updateState(addState(GraphPortState.selected)));
  } else if (action.node) {
    const nodeId = action.node.id;
    data = data.selectNodes(node => node.id === nodeId);
  }
  return {
    ...state,
    data: {
      ...state.data,
      present: data
    }
  };
}

export const selectionReducer: IGraphReactReducer = (state, action) => {
  const data = state.data.present;
  const isLassoSelectEnable = state.settings.features.has(GraphFeatures.lassoSelect);

  switch (action.type) {
    case GraphCanvasEvent.Click:
    case GraphCanvasEvent.ResetSelection:
    case GraphCanvasEvent.ContextMenu:
      return {
        ...state,
        data: {
          ...state.data,
          present: unSelectAllEntity()(data)
        }
      };
    case GraphNodeEvent.Click:
    case GraphNodeEvent.ContextMenu:
      return {
        ...state,
        data: {
          ...state.data,
          present: nodeSelection(action.rawEvent, action.node)(data)
        }
      };
    case GraphCanvasEvent.SelectStart: {
      const point = getRelativePoint(state.viewport.rect, action.rawEvent);
      if (!point) {
        return state;
      }
      return {
        ...state,
        data: {
          ...state.data,
          present: unSelectAllEntity()(data)
        },
        selectBoxPosition: {
          startX: point.x,
          startY: !isLassoSelectEnable ? point.y : 0,
          width: 0,
          height: 0
        }
      };
    }
    case GraphCanvasEvent.SelectMove:
      if (state.behavior !== GraphBehavior.multiSelect) {
        return state;
      }
      return {
        ...state,
        selectBoxPosition: {
          ...state.selectBoxPosition,
          width: state.selectBoxPosition.width + action.dx,
          height: !isLassoSelectEnable
            ? state.selectBoxPosition.height + action.dy
            : state.viewport.rect?.height ?? state.selectBoxPosition.height
        }
      };
    case GraphCanvasEvent.SelectEnd:
      return {
        ...state,
        selectBoxPosition: emptySelectBoxPosition(),
        data: {
          ...state.data,
          present: selectNodeBySelectBox(
            state.settings.graphConfig,
            state.viewport.transformMatrix,
            state.selectBoxPosition,
            data
          )
        }
      };
    case GraphCanvasEvent.UpdateNodeSelectionBySelectBox: {
      if (state.behavior !== GraphBehavior.multiSelect) {
        return state;
      }
      return {
        ...state,
        data: {
          ...state.data,
          present: selectNodeBySelectBox(
            state.settings.graphConfig,
            state.viewport.transformMatrix,
            state.selectBoxPosition,
            data
          )
        }
      };
    }
    case GraphCanvasEvent.Navigate:
      return handleNavigate(state, action);
    case GraphNodeEvent.SelectAll:
      return {
        ...state,
        data: {
          ...state.data,
          present: data.selectNodes(() => true)
        }
      };
    default:
      return state;
  }
};
