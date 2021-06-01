import { RefObject, useEffect, useLayoutEffect, useState } from "react";
import { IContainerRect } from "../models/viewport";
import { throttle } from "../utils/scheduling";

export const getMinimapRect = (
  svgRef: RefObject<SVGSVGElement>
): ClientRect | DOMRect | undefined => {
  return svgRef.current
    ?.closest<HTMLDivElement>(".minimap-container")
    ?.getBoundingClientRect();
};

export const useMinimapRect = (
  svgRef: RefObject<SVGSVGElement>
): IContainerRect | undefined => {
  const [rect, setRect] = useState<ClientRect | DOMRect | undefined>(undefined);

  useLayoutEffect(() => {
    setRect(getMinimapRect(svgRef));
  }, [svgRef]);

  useEffect(() => {
    const onResize = throttle(() => {
      setRect(getMinimapRect(svgRef));
    }, 20);

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [svgRef]);

  return rect;
};
