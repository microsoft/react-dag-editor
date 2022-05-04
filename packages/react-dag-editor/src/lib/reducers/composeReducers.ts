import { IGraphMiddleware } from "../contexts";

export function composeReducers<Action = never>(
  reducers: ReadonlyArray<IGraphMiddleware<Action>>
): IGraphMiddleware<Action> {
  return (next) => reducers.reduceRight((prev, current) => current(prev), next);
}
