import { COPIED_NODE_SPACING } from "../common/constants";
import { IGraphReactReducer } from "../contexts";
import { GraphFeatures } from "../Features";
import { GraphCanvasEvent } from "../models/event";
import { GraphNodeStatus, notSelected } from "../models/status";
import { getRealPointFromClientPoint, isViewportComplete, resetUndoStack, unSelectAllEntity } from "../utils";
import { pushHistory, redo, undo } from "../utils/history";

export const canvasReducer: IGraphReactReducer = (state, action) => {
  switch (action.type) {
    case GraphCanvasEvent.Paste: {
      const { position } = action;
      if (!isViewportComplete(state.viewport)) {
        return state;
      }
      const { rect } = state.viewport;
      let pasteNodes = action.data.nodes;

      if (position && rect) {
        const realPoint = getRealPointFromClientPoint(position.x, position.y, state.viewport);

        let dx: number;
        let dy: number;

        pasteNodes = pasteNodes.map((n, idx) => {
          // (dx,dy) are same for all copied nodes
          if (idx === 0) {
            dx = realPoint.x - n.x;
            dy = realPoint.y - n.y;
          }

          return {
            ...n,
            x: dx ? n.x - COPIED_NODE_SPACING + dx : n.x,
            y: dy ? n.y - COPIED_NODE_SPACING + dy : n.y,
            state: GraphNodeStatus.Selected,
          };
        });
      }

      let next = unSelectAllEntity()(state.data.present);
      pasteNodes.forEach(node => {
        next = next.insertNode(node);
      });
      action.data.edges.forEach(edge => {
        next = next.insertEdge(edge);
      });
      return {
        ...state,
        data: pushHistory(state.data, next),
      };
    }
    case GraphCanvasEvent.Delete:
      if (!state.settings.features.has(GraphFeatures.Delete)) {
        return state;
      }
      return {
        ...state,
        data: pushHistory(
          state.data,
          state.data.present.deleteItems({
            node: notSelected,
            edge: notSelected,
          }),
          unSelectAllEntity(),
        ),
      };
    case GraphCanvasEvent.Undo:
      return {
        ...state,
        data: undo(state.data),
      };
    case GraphCanvasEvent.Redo:
      return {
        ...state,
        data: redo(state.data),
      };
    case GraphCanvasEvent.KeyDown: {
      const key = action.rawEvent.key.toLowerCase();
      if (state.activeKeys.has(key)) {
        return state;
      }
      const set = new Set(state.activeKeys);
      set.add(key);
      return {
        ...state,
        activeKeys: set,
      };
    }
    case GraphCanvasEvent.KeyUp: {
      const key = action.rawEvent.key.toLowerCase();
      if (!state.activeKeys.has(key)) {
        return state;
      }
      const set = new Set(state.activeKeys);
      set.delete(key);
      return {
        ...state,
        activeKeys: set,
      };
    }
    case GraphCanvasEvent.SetData:
      return {
        ...state,
        data: resetUndoStack(action.data),
      };
    case GraphCanvasEvent.UpdateData:
      return {
        ...state,
        data: action.shouldRecord
          ? pushHistory(state.data, action.updater(state.data.present))
          : {
              ...state.data,
              present: action.updater(state.data.present),
            },
      };
    case GraphCanvasEvent.ResetUndoStack:
      return {
        ...state,
        data: resetUndoStack(state.data.present),
      };
    case GraphCanvasEvent.UpdateSettings: {
      const { type, ...settings } = action;
      return {
        ...state,
        settings: {
          ...state.settings,
          ...settings,
        },
      };
    }
    default:
      return state;
  }
};
