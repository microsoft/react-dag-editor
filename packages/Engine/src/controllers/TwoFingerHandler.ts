import * as React from "react";
import { GraphCanvasEvent } from "../common/GraphEvent.constant";
import { IContainerRect } from "../models/viewport";
import { distance, getContainerCenter } from "../utils";
import { EventChannel } from "../utils/eventChannel";
import { ITouchHandler } from "./TouchController";

/**
 * debug helpers, just leave them here
 */
// const canvas = document.createElement("canvas");
// canvas.height = window.innerHeight;
// canvas.width = window.innerWidth;
// Object.assign(canvas.style, {
//   pointerEvents: "none",
//   position: "fixed",
//   top: "0",
//   left: "0"
// });
// document.body.append(canvas);
//
// const ctx = canvas.getContext("2d")!;
//
// function draw({ x, y }: ITouch, style: string): void {
//   ctx.fillStyle = style;
//   ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
// }

export class TwoFingerHandler implements ITouchHandler {
  private readonly rectRef: React.RefObject<IContainerRect | undefined>;
  private readonly eventChannel: EventChannel;
  private prevEvents: [PointerEvent, PointerEvent] | undefined;
  private prevDistance = 0;

  public constructor(
    rectRef: React.RefObject<IContainerRect | undefined>,
    eventChannel: EventChannel
  ) {
    this.rectRef = rectRef;
    this.eventChannel = eventChannel;
  }

  public onEnd(): void {
    // noop
  }

  public onMove(pointers: Map<number, PointerEvent>, e: PointerEvent): void {
    const events = Array.from(pointers.values()) as [PointerEvent, PointerEvent];
    const currentDistance = distance(events[0].clientX, events[0].clientY, events[1].clientX, events[1].clientY);

    const { prevEvents, prevDistance } = this;
    this.prevDistance = currentDistance;
    this.prevEvents = events;
    if (!prevEvents) {
      return;
    }
    const dx1 = events[0].clientX - prevEvents[0].clientX;
    const dx2 = events[1].clientX - prevEvents[1].clientX;
    const dy1 = events[0].clientY - prevEvents[0].clientY;
    const dy2 = events[1].clientY - prevEvents[1].clientY;
    const dx = (dx1 + dx2) / 2;
    const dy = (dy1 + dy2) / 2;
    const scale = (currentDistance - prevDistance) / prevDistance + 1;
    const anchor = getContainerCenter(this.rectRef);
    if (!anchor) {
      return;
    }
    this.eventChannel.trigger({
      type: GraphCanvasEvent.Pinch,
      rawEvent: e,
      dx,
      dy,
      scale,
      anchor
    });
  }

  public onStart(pointers: Map<number, PointerEvent>): void {
    if (pointers.size !== 2) {
      throw new Error(`Unexpected touch event with ${pointers.size} touches`);
    }
    this.prevEvents = Array.from(pointers.values()) as [PointerEvent, PointerEvent];
    this.prevDistance = distance(
      this.prevEvents[0].clientX,
      this.prevEvents[0].clientY,
      this.prevEvents[1].clientX,
      this.prevEvents[1].clientY
    );
  }
}
