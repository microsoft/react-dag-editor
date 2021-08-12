import * as React from "react";
import { IVirtualizationContext, VirtualizationContext } from "../contexts/VirtualizationContext";
import { GraphCanvasEvent } from "../models/event";
import { IViewport } from "../models/geometry";
import { getRenderedArea, getVisibleArea } from "../utils";
import { EventChannel } from "../utils/eventChannel";

export interface IVirtualizationProviderProps {
  viewport: Required<IViewport>;
  isVirtualizationEnabled: boolean;
  virtualizationDelay: number;
  eventChannel: EventChannel;
}

export const VirtualizationProvider: React.FunctionComponent<IVirtualizationProviderProps> = ({
  viewport,
  isVirtualizationEnabled,
  virtualizationDelay,
  eventChannel,
  children
}) => {
  const getVirtualizationContext = React.useCallback((): IVirtualizationContext => {
    const renderedArea = isVirtualizationEnabled
      ? getRenderedArea(viewport)
      : {
          minX: -Number.MAX_SAFE_INTEGER,
          minY: -Number.MAX_SAFE_INTEGER,
          maxX: Number.MAX_SAFE_INTEGER,
          maxY: Number.MAX_SAFE_INTEGER
        };
    const visibleArea = getVisibleArea(viewport);
    return {
      viewport,
      renderedArea,
      visibleArea,
      renderedNodes: new Set(),
      renderedEdges: new Set(),
      timestamp: performance.now()
    };
  }, [isVirtualizationEnabled, viewport]);

  const [context, setContext] = React.useState<IVirtualizationContext>(getVirtualizationContext);
  React.useMemo(() => {
    context.timestamp = performance.now();
  }, [context]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setContext(getVirtualizationContext);
    }, virtualizationDelay);
    return () => {
      clearTimeout(timer);
    };
  }, [getVirtualizationContext, virtualizationDelay]);

  const previousContextRef = React.useRef(context);

  React.useEffect(() => {
    const previousContext = previousContextRef.current;
    previousContextRef.current = context;
    eventChannel.trigger({
      type: GraphCanvasEvent.VirtualizationRecalculated,
      performanceStartTime: context.timestamp,
      renderedNodes: previousContext.renderedNodes,
      renderedEdges: previousContext.renderedEdges,
      previousRenderedNodes: previousContext.renderedNodes,
      previousRenderedEdges: previousContext.renderedEdges
    });
  }, [context, eventChannel]);

  return <VirtualizationContext.Provider value={context}>{children}</VirtualizationContext.Provider>;
};
