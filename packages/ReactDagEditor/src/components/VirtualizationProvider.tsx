import * as React from "react";
import { IVirtualizationContext, VirtualizationContext } from "../contexts/VirtualizationContext";
import { VirtualizationRenderedContext } from "../contexts/VirtualizationRenderedContext";
import { useRenderedArea } from "../hooks";
import { useDeferredValue } from "../hooks/useDeferredValue";
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

export const VirtualizationProvider: React.FunctionComponent<IVirtualizationProviderProps> = ({
  viewport,
  isVirtualizationEnabled,
  virtualizationDelay,
  eventChannel,
  children
}) => {
  const renderedArea = useRenderedArea(viewport, isVirtualizationEnabled);
  const visibleArea = React.useMemo(() => getVisibleArea(viewport), [viewport]);

  const renderedContext = React.useContext(VirtualizationRenderedContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const performanceStartTime = React.useMemo(() => window.performance.now(), [renderedArea]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderedNodesCountBeforeRerender = renderedContext.nodes.size;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderedEdgesCountBeforeRerender = renderedContext.edges.size;

  const context = React.useMemo<IVirtualizationContext>(
    () => ({
      viewport,
      renderedArea,
      visibleArea
    }),
    [viewport, renderedArea, visibleArea]
  );

  const value = useDeferredValue(context, { timeout: virtualizationDelay });

  React.useEffect(() => {
    eventChannel.trigger({
      type: GraphCanvasEvent.VirtualizationRecalculated,
      performanceStartTime,
      renderedNodesCountBeforeRerender,
      renderedEdgesCountBeforeRerender
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <VirtualizationContext.Provider value={value}>{children}</VirtualizationContext.Provider>;
};
