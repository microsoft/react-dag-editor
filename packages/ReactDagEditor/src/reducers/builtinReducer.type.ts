import { IGraphReducerContext} from "../contexts";
import { IEvent } from "../models/event";
import { IGraphState } from "../models/state";

export type IBuiltinReducer = (state: IGraphState, action: IEvent, context: IGraphReducerContext) => IGraphState;
