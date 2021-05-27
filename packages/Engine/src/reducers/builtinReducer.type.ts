import { IGraphReducerContext, IGraphState } from "../contexts";
import { IEvent } from "../Graph.interface";

export type IBuiltinReducer = (state: IGraphState, action: IEvent, context: IGraphReducerContext) => IGraphState;
