import { RefObject, useLayoutEffect, useState } from "react";
import { IContainerRect } from "../../models/viewport";

export function useSvgRect(svgRef: RefObject<SVGSVGElement>): IContainerRect | undefined {
  const [rect, setRect] = useState<IContainerRect | undefined>(undefined);

  useLayoutEffect((): void => {
    if (!svgRef.current) {
      return;
    }
    setRect(svgRef.current.getBoundingClientRect());
  }, [svgRef]);

  return rect;
}
