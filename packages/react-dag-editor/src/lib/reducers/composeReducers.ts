import { IGraphReducer } from "../contexts";

export function composeReducers<Action = never>(
  reducers: ReadonlyArray<IGraphReducer<Action>>
): IGraphReducer<Action> {
  return (next) => reducers.reduceRight((prev, current) => current(prev), next);
}
