import * as React from "react";
import { MouseEventButton } from "../common/constants";
import { IGraphConfig } from "../contexts";
import { DragController, IOnDragEnd } from "../controllers";
import { MouseMoveEventProvider } from "../event-provider/MouseMoveEventProvider";
import { GraphCanvasEvent, ICanvasCommonEvent, IEvent } from "../models/event";
import { IPoint } from "../models/geometry";
import { CanvasMouseMode, IGraphState } from "../models/state";
import { EventChannel } from "../utils/eventChannel";
import { GraphController } from "../controllers/GraphController";
import { isWithinThreshold } from "../utils/isWithinThreshold";

export interface IContainerMouseDownParams {
  state: IGraphState;
  canvasMouseMode: CanvasMouseMode | undefined;
  isPanDisabled: boolean;
  isMultiSelectDisabled: boolean;
  isLassoSelectEnable: boolean;
  dragThreshold: number;
  containerRef: React.RefObject<HTMLDivElement>;
  eventChannel: EventChannel;
  graphConfig: IGraphConfig;
  graphController: GraphController;
  getPositionFromEvent(e: MouseEvent): IPoint;
}

const withSimulatedClick = (params: IContainerMouseDownParams, type: ICanvasCommonEvent["type"]) => ({
  totalDX,
  totalDY,
  e: rawEvent
}: IOnDragEnd) => {
  const { eventChannel, dragThreshold, containerRef } = params;
  const events: IEvent[] = [];
  events.push({
    type,
    rawEvent
  });
  if (
    rawEvent.target instanceof Node &&
    containerRef.current?.contains(rawEvent.target) &&
    isWithinThreshold(totalDX, totalDY, dragThreshold)
  ) {
    events.push({
      type: GraphCanvasEvent.Click,
      rawEvent
    });
  }
  eventChannel.batch(events);
};

const dragMultiSelect = (e: MouseEvent, params: IContainerMouseDownParams): void => {
  const { getPositionFromEvent, graphConfig, eventChannel } = params;
  const dragging = new DragController(
    new MouseMoveEventProvider(graphConfig.getGlobalEventTarget()),
    getPositionFromEvent
  );
  dragging.onMove = ({ dx, dy, e: rawEvent }) => {
    eventChannel.trigger({
      type: GraphCanvasEvent.SelectMove,
      rawEvent,
      dx,
      dy
    });
  };
  dragging.onEnd = withSimulatedClick(params, GraphCanvasEvent.SelectEnd);

  eventChannel.trigger({
    type: GraphCanvasEvent.SelectStart,
    rawEvent: e
  });

  dragging.start(e);
};

const dragPan = (e: MouseEvent, params: IContainerMouseDownParams): void => {
  const { getPositionFromEvent, graphConfig, eventChannel } = params;

  const dragging = new DragController(
    new MouseMoveEventProvider(graphConfig.getGlobalEventTarget()),
    getPositionFromEvent
  );
  dragging.onMove = ({ dx, dy, e: rawEvent }) => {
    eventChannel.trigger({
      type: GraphCanvasEvent.Drag,
      rawEvent,
      dx,
      dy
    });
  };
  dragging.onEnd = withSimulatedClick(params, GraphCanvasEvent.DragEnd);
  dragging.start(e);
  eventChannel.trigger({
    type: GraphCanvasEvent.DragStart,
    rawEvent: e
  });
};

export const onContainerMouseDown = (e: React.MouseEvent, params: IContainerMouseDownParams): void => {
  e.preventDefault();
  e.stopPropagation();

  if (e.button !== MouseEventButton.Primary) {
    return;
  }

  const { canvasMouseMode, isPanDisabled, isMultiSelectDisabled, state, isLassoSelectEnable, graphController } = params;
  // in pan mode, hold ctrl or shift to perform select.
  // in select mode, hold space to perform pan
  const isPanMode =
    (canvasMouseMode === CanvasMouseMode.pan && !e.ctrlKey && !e.shiftKey && !e.metaKey) || state.activeKeys?.has(" ");

  if (!isPanDisabled && isPanMode) {
    dragPan(e.nativeEvent, params);
  } else if (!isMultiSelectDisabled || (isLassoSelectEnable && !e.ctrlKey && !e.metaKey)) {
    dragMultiSelect(e.nativeEvent, params);
  } else {
    graphController.canvasClickOnce = true;
  }
};
