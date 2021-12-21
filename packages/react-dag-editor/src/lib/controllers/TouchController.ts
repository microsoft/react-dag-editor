/* eslint-disable no-invalid-this */
import * as React from "react";
import { animationFramed } from "../utils/scheduling";

export interface ITouchHandler<ExtraArgs extends unknown[] = []> {
  onStart(
    events: Map<number, PointerEvent>,
    e: PointerEvent,
    ...args: ExtraArgs
  ): void;
  onMove(
    events: Map<number, PointerEvent>,
    e: PointerEvent,
    ...args: ExtraArgs
  ): void;
  onEnd(e: PointerEvent, ...args: ExtraArgs): void;
}

export class TouchController<ExtraArgs extends unknown[] = []> {
  public readonly eventHandlers = {
    onPointerDown: (e: React.PointerEvent, ...args: ExtraArgs): void => {
      if (e.pointerType !== "touch") {
        return;
      }
      e.preventDefault();
      this.pointers = new Map(this.pointers);
      this.pointers.set(e.pointerId, e.nativeEvent);
      this.updateHandler(e.nativeEvent, ...args);
    },

    onPointerMove: (e: React.PointerEvent, ...args: ExtraArgs): void => {
      if (e.pointerType !== "touch") {
        return;
      }
      e.preventDefault();
      this.pointers.set(e.pointerId, e.nativeEvent);
      this.onMove(e.nativeEvent, ...args);
    },

    onPointerUp: (e: React.PointerEvent, ...args: ExtraArgs): void => {
      if (e.pointerType !== "touch") {
        return;
      }
      e.preventDefault();
      this.pointers = new Map(this.pointers);
      this.pointers.delete(e.pointerId);
      this.updateHandler(e.nativeEvent, ...args);
    },
  };

  private pointers = new Map<number, PointerEvent>();
  private currentHandler: ITouchHandler<ExtraArgs> | undefined;
  private readonly handlers: Map<number, ITouchHandler<ExtraArgs>>;

  private readonly onMove = animationFramed(
    (e: PointerEvent, ...args: ExtraArgs) => {
      this.currentHandler?.onMove(this.pointers, e, ...args);
    }
  );

  public constructor(handlers: Map<number, ITouchHandler<ExtraArgs>>) {
    this.handlers = handlers;
  }

  private updateHandler(e: PointerEvent, ...args: ExtraArgs): void {
    const handler = this.handlers.get(this.pointers.size);
    if (handler !== this.currentHandler) {
      this.currentHandler?.onEnd(e, ...args);
      this.currentHandler = handler;
      this.currentHandler?.onStart(this.pointers, e, ...args);
    }
  }
}
