import { IGraphReducer } from "../contexts";
import { GraphPortEvent } from "../models/event";
import { GraphPortStatus, liftStatus } from "../models/status";
import { unSelectAllEntity } from "../utils";
import * as Bitset from "../utils/bitset";

export const portReducer: IGraphReducer = (state, action) => {
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
            liftStatus(Bitset.add(GraphPortStatus.Activated))
          ),
        },
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
            liftStatus(Bitset.remove(GraphPortStatus.Activated))
          ),
        },
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
            liftStatus(Bitset.add(GraphPortStatus.Selected))
          ),
        },
      };
    default:
      return state;
  }
};
