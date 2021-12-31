import { lift } from "record-class";
import type { IGraphReducer } from "../contexts";
import { GraphFeatures } from "../Features";
import { EdgeModel } from "../models/edge";
import { GraphEdgeEvent } from "../models/event";
import { GraphEdgeStatus, liftStatus } from "../models/status";
import { pushHistory, unSelectAllEntity } from "../utils";
import * as Bitset from "../utils/bitset";

export const edgeReducer: IGraphReducer = (state, action) => {
  switch (action.type) {
    case GraphEdgeEvent.DoubleClick:
      if (!state.settings.features.has(GraphFeatures.EditEdge)) {
        return state;
      }
      return {
        ...state,
        data: {
          ...state.data,
          present: state.data.present.merge({
            edges: state.data.present.edges.update(
              action.edge.id,
              lift(liftStatus(Bitset.replace(GraphEdgeStatus.Editing)))
            ),
          }),
        },
      };
    case GraphEdgeEvent.MouseEnter:
      return {
        ...state,
        data: {
          ...state.data,
          present: state.data.present.merge({
            edges: state.data.present.edges.update(
              action.edge.id,
              lift(liftStatus(Bitset.add(GraphEdgeStatus.Activated)))
            ),
          }),
        },
      };
    case GraphEdgeEvent.MouseLeave:
      return {
        ...state,
        data: {
          ...state.data,
          present: state.data.present.merge({
            edges: state.data.present.edges.update(
              action.edge.id,
              lift(liftStatus(Bitset.remove(GraphEdgeStatus.Activated)))
            ),
          }),
        },
      };
    case GraphEdgeEvent.Click:
    case GraphEdgeEvent.ContextMenu:
      return {
        ...state,
        data: {
          ...state.data,
          present: state.data.present.pipe(unSelectAllEntity()).merge({
            edges: state.data.present.edges.update(
              action.edge.id,
              lift(liftStatus(Bitset.add(GraphEdgeStatus.Selected)))
            ),
          }),
        },
      };
    case GraphEdgeEvent.Add:
      return {
        ...state,
        data: pushHistory(
          state.data,
          state.data.present.merge({
            edges: state.data.present.edges.set(
              action.edge.id,
              EdgeModel.fromJSON(action.edge)
            ),
          })
        ),
      };
    default:
      return state;
  }
};
