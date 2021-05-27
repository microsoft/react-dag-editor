import { useCallback, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useClientRect = (): [any, ((node: any) => void) | null] => {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
};
