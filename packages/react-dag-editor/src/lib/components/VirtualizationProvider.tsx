import * as React from "react";
import {
  IVirtualizationContext,
  VirtualizationContext,
} from "../contexts/VirtualizationContext";
import { useDeferredValue, useRenderedArea } from "../hooks";
import { GraphCanvasEvent } from "../models/event";
import { IViewport } from "../models/geometry";
import { getVisibleArea } from "../utils";
import { EventChannel } from "../utils/eventChannel";

export interface IVirtualizationProviderProps {
  viewport: Required<IViewport>;
  isVirtualizationEnabled: boolean;
  virtualizationDelay: number;
  eventChannel: EventChannel;
}

export const VirtualizationProvider: React.FunctionComponent<
  IVirtualizationProviderProps
> = ({
  viewport,
  isVirtualizationEnabled,
  virtualizationDelay,
  eventChannel,
  children,
}) => {
  const renderedArea = useRenderedArea(viewport, isVirtualizationEnabled);
  const visibleArea = React.useMemo(() => getVisibleArea(viewport), [viewport]);

  const contextValue = React.useMemo<IVirtualizationContext>(
    () => ({
      viewport,
      renderedArea,
      visibleArea,
      renderedEdges: new Set(),
      renderedNodes: new Set(),
      timestamp: performance.now(),
    }),
    [viewport, renderedArea, visibleArea]
  );

  const context = useDeferredValue(contextValue, {
    timeout: virtualizationDelay,
  });

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
      previousRenderedEdges: previousContext.renderedEdges,
    });
  }, [context, eventChannel]);

  return (
    <VirtualizationContext.Provider value={context}>
      {children}
    </VirtualizationContext.Provider>
  );
};
