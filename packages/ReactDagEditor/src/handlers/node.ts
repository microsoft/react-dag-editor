import * as React from "react";
import { MouseEventButton } from "../common/constants";
import { IGraphConfig } from "../contexts";
import { DragNodeController, TGetPositionFromEvent } from "../controllers";
import { PointerEventProvider } from "../event-provider/PointerEventProvider";
import { GraphNodeEvent, IEvent } from "../models/event";
import { IContainerRect } from "../models/geometry";
import { NodeModel } from "../models/NodeModel";
import { isWithinThreshold } from "../utils";
import { EventChannel } from "../utils/eventChannel";
import { graphController } from "../utils/graphController";
import { checkIsMultiSelect } from "../utils/keyboard";

export interface INodePointerDownParams {
  svgRef: React.RefObject<SVGSVGElement>;
  rectRef: React.RefObject<IContainerRect | undefined>;
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
    rectRef,
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

  const dragging = new DragNodeController(
    new PointerEventProvider(graphConfig.getGlobalEventTarget(), evt.pointerId),
    getPositionFromEvent,
    rectRef
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
      graphController.nodeClickOnce = target;
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
