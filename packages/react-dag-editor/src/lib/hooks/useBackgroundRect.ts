import { IGraphState } from "../models/state";
import { useRenderedArea } from "./useRenderedArea";

export const useBackgroundRect = (state: IGraphState) => {
  const { viewport } = state;

  const renderedArea = useRenderedArea(viewport, true);

  return { rect: renderedArea };
};
