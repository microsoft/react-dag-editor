import { useGraphConfig } from "./context";

export const useClipboard = () => {
  const graphConfig = useGraphConfig();
  return graphConfig.getClipboard();
};
