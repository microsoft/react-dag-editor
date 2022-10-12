import { useRenderedArea } from "./useRenderedArea";
import { IGraphState } from "../models/state";

export const useBackgroundRect = (state: IGraphState) => {
  const { viewport } = state;

  const renderedArea = useRenderedArea(viewport, true);

  return { rect: renderedArea };
};
