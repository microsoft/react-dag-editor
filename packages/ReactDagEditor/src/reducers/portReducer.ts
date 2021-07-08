import { GraphPortState } from "../models/element-state";
import { GraphPortEvent } from "../models/event";
import { addState, removeState, unSelectAllEntity, updateState } from "../utils";
import { IBuiltinReducer } from "./builtinReducer.type";

export const portReducer: IBuiltinReducer = (state, action) => {
  switch (action.type) {
    case GraphPortEvent.Focus:
    case GraphPortEvent.PointerEnter:
      return {
        ...state,
        data: {
          ...state.data,
          present: state.data.present.updatePort(
            action.node.id,
            action.port.id,
            updateState(addState(GraphPortState.activated))
          )
        }
      };
    case GraphPortEvent.Blur:
    case GraphPortEvent.PointerLeave:
      return {
        ...state,
        data: {
          ...state.data,
          present: state.data.present.updatePort(
            action.node.id,
            action.port.id,
            updateState(removeState(GraphPortState.activated))
          )
        }
      };
    case GraphPortEvent.Click:
    case GraphPortEvent.ContextMenu:
      return {
        ...state,
        data: {
          ...state.data,
          present: unSelectAllEntity()(state.data.present).updatePort(
            action.node.id,
            action.port.id,
            updateState(addState(GraphPortState.selected))
          )
        }
      };
    default:
      return state;
  }
};
