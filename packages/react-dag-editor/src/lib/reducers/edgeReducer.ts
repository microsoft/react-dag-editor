import { IGraphReactReducer } from "../contexts";
import { GraphFeatures } from "../Features";
import { GraphEdgeEvent } from "../models/event";
import { GraphEdgeStatus, liftStatus } from "../models/status";
import { pushHistory, unSelectAllEntity } from "../utils";
import * as Bitset from "../utils/bitset";

export const edgeReducer: IGraphReactReducer = (state, action) => {
  switch (action.type) {
    case GraphEdgeEvent.DoubleClick:
      if (!state.settings.features.has(GraphFeatures.EditEdge)) {
        return state;
      }
      return {
        ...state,
        data: {
          ...state.data,
          present: state.data.present.updateEdge(
            action.edge.id,
            liftStatus(Bitset.replace(GraphEdgeStatus.Editing))
          ),
        },
      };
    case GraphEdgeEvent.MouseEnter:
      return {
        ...state,
        data: {
          ...state.data,
          present: state.data.present.updateEdge(
            action.edge.id,
            liftStatus(Bitset.add(GraphEdgeStatus.Activated))
          ),
        },
      };
    case GraphEdgeEvent.MouseLeave:
      return {
        ...state,
        data: {
          ...state.data,
          present: state.data.present.updateEdge(
            action.edge.id,
            liftStatus(Bitset.remove(GraphEdgeStatus.Activated))
          ),
        },
      };
    case GraphEdgeEvent.Click:
    case GraphEdgeEvent.ContextMenu:
      return {
        ...state,
        data: {
          ...state.data,
          present: unSelectAllEntity()(state.data.present).updateEdge(
            action.edge.id,
            liftStatus(Bitset.add(GraphEdgeStatus.Selected))
          ),
        },
      };
    case GraphEdgeEvent.Add:
      return {
        ...state,
        data: pushHistory(
          state.data,
          state.data.present.insertEdge(action.edge)
        ),
      };
    default:
      return state;
  }
};
