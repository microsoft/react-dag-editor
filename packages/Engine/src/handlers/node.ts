import * as React from "react";
import { MouseEventButton } from "../common/constants";
import { GraphNodeEvent } from "../common/GraphEvent.constant";
import { IGraphConfig } from "../contexts";
import { DragNodeController, TGetPositionFromEvent } from "../controllers";
import { PointerEventProvider } from "../event-provider/PointerEventProvider";
import { IEvent } from "../Graph.interface";
import { NodeModel } from "../models/NodeModel";
import { IContainerRect } from "../models/viewport";
import { isWithinThreshold } from "../utils";
import { EventChannel } from "../utils/eventChannel";
import { graphController } from "../utils/graphController";
import { checkIsMultiSelect } from "../utils/keyboard";

export interface INodePointerDownParams {
  svgRef: React.RefObject<SVGSVGElement>;
  visibleRectRef: React.RefObject<IContainerRect | undefined>;
  isNodesDraggable: boolean;
  isAutoAlignEnable: boolean;
  dragThreshold: number;
  getPositionFromEvent: TGetPositionFromEvent;
  isClickNodeToSelectDisabled: boolean;
  graphConfig: IGraphConfig;
  autoAlignThreshold: number;
  eventChannel: EventChannel;
}

export const onNodePointerDown = (evt: React.PointerEvent, target: NodeModel, params: INodePointerDownParams) => {
  evt.preventDefault();

  const {
    graphConfig,
    svgRef,
    isNodesDraggable,
    getPositionFromEvent,
    isClickNodeToSelectDisabled,
    eventChannel,
    dragThreshold,
    visibleRectRef,
    isAutoAlignEnable,
    autoAlignThreshold
  } = params;

  if (isNodesDraggable) {
    evt.stopPropagation();
  }

  const isMouseRight = evt.pointerType === "mouse" && evt.button !== MouseEventButton.Primary;

  if (isClickNodeToSelectDisabled || isMouseRight) {
    return;
  }

  if (svgRef.current) {
    svgRef.current.focus({ preventScroll: true });
  }

  const isMultiSelect = checkIsMultiSelect(evt);

  /**
   * evt.currentTarget is set to null in `onEnd` although `event.persis()` is called in GraphNode.tsx
   */
  const element = evt.currentTarget as SVGGElement;

  const dragging = new DragNodeController(
    new PointerEventProvider(graphConfig.getGlobalEventTarget(), evt.pointerId),
    getPositionFromEvent,
    visibleRectRef
  );

  dragging.onMove = ({ dx, dy, totalDX, totalDY, e }) => {
    if (isNodesDraggable) {
      eventChannel.trigger({
        type: GraphNodeEvent.Drag,
        node: target,
        dx,
        dy,
        rawEvent: e,
        isVisible: !isWithinThreshold(totalDX, totalDY, dragThreshold),
        isAutoAlignEnable,
        autoAlignThreshold
      });
    }
  };

  dragging.onEnd = ({ totalDX, totalDY, e }) => {
    graphController.pointerId = null;
    const events: IEvent[] = [];
    const isDragCanceled = isWithinThreshold(totalDX, totalDY, dragThreshold);
    events.push({
      type: GraphNodeEvent.DragEnd,
      node: target,
      rawEvent: e,
      isDragCanceled
    });
    if (isDragCanceled || !isNodesDraggable) {
      events.push({
        type: GraphNodeEvent.Click,
        node: target,
        rawEvent: e,
        isMultiSelect
      });
      element.focus();
    }
    eventChannel.batch(events);
  };
  graphController.pointerId = evt.pointerId;
  if (evt.target instanceof Element && evt.pointerType !== "mouse") {
    evt.target.releasePointerCapture(evt.pointerId);
  }
  eventChannel.trigger({
    type: GraphNodeEvent.DragStart,
    node: target,
    rawEvent: evt,
    isMultiSelect
  });
  dragging.start(evt.nativeEvent);
};
