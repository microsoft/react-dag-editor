import { useGraphState } from "./useGraphState";
import { useRenderedArea } from "./useRenderedArea";

export const useBackgroundRect = () => {
  const { state } = useGraphState();
  const { viewport } = state;

  const renderedArea = useRenderedArea(viewport, true);

  return { rect: renderedArea };
};
