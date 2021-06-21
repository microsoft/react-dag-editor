import { MouseEventButton } from "../common/constants";
import {
  GraphCanvasEvent,
  GraphContextMenuEvent,
  GraphEdgeEvent,
  GraphNodeEvent,
  GraphPortEvent
} from "../common/GraphEvent.constant";
import { IBuiltinReducer } from "./builtinReducer.type";

export const contextMenuReducer: IBuiltinReducer = (prevState, action) => {
  let nextContextMenuPosition = prevState.contextMenuPosition;

  switch (action.type) {
    case GraphCanvasEvent.ContextMenu:
    case GraphNodeEvent.ContextMenu:
    case GraphEdgeEvent.ContextMenu:
    case GraphPortEvent.ContextMenu:
      {
        const e = action.rawEvent as MouseEvent;
        if (e.button === MouseEventButton.Secondary) {
          nextContextMenuPosition = {
            x: e.clientX,
            y: e.clientY
          };
        }
      }
      break;
    case GraphCanvasEvent.Click:
    case GraphNodeEvent.Click:
    case GraphEdgeEvent.Click:
    case GraphPortEvent.Click:
      nextContextMenuPosition = undefined;
      break;
    case GraphContextMenuEvent.Open:
      nextContextMenuPosition = {
        x: action.x,
        y: action.y
      };
      break;
    case GraphContextMenuEvent.Close:
      nextContextMenuPosition = undefined;
      break;
    default:
  }

  if (prevState.contextMenuPosition === nextContextMenuPosition) {
    return prevState;
  }

  return {
    ...prevState,
    contextMenuPosition: nextContextMenuPosition
  };
};
