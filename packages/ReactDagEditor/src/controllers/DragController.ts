/* eslint-disable no-invalid-this */
import { IEventProvider, IGlobalMoveEventTypes } from "../event-provider/types";
import { IPoint } from "../utils";
import { noop } from "../utils/noop";
import { animationFramed, IScheduledCallback } from "../utils/scheduling";

export type TGetPositionFromEvent = (e: MouseEvent) => IPoint;

export interface IOnDragMove<T = MouseEvent> {
  /**
   * clientX after getPositionFromEvent
   */
  clientX: number;
  /**
   * clientY after getPositionFromEvent
   */
  clientY: number;
  dx: number;
  dy: number;
  totalDX: number;
  totalDY: number;
  e: T;
}

export interface IOnDragEnd<T = MouseEvent> {
  totalDX: number;
  totalDY: number;
  e: T;
}

export class DragController<T extends MouseEvent = MouseEvent> {
  public onMove: (move: IOnDragMove) => void = noop;
  public onEnd: (end: IOnDragEnd) => void = noop;
  protected mouseMove: IScheduledCallback<[T]>;
  protected lastEvent: T | null = null;
  private readonly getPositionFromEvent: TGetPositionFromEvent;
  private startX = 0;
  private startY = 0;
  private prevClientX = 0;
  private prevClientY = 0;
  private readonly eventProvider: IEventProvider<IGlobalMoveEventTypes>;

  public constructor(
    eventProvider: IEventProvider<IGlobalMoveEventTypes>,
    getPositionFromEvent: TGetPositionFromEvent
  ) {
    this.eventProvider = eventProvider;
    this.getPositionFromEvent = getPositionFromEvent;
    this.mouseMove = animationFramed((e: T) => {
      this.doOnMouseMove(e);
    });
  }

  public start(e: T): void {
    this.lastEvent = e;
    const { x, y } = this.getPositionFromEvent(e);
    this.startX = x;
    this.startY = y;
    this.prevClientX = x;
    this.prevClientY = y;

    this.eventProvider.on("move", this.onMouseMove);
    this.eventProvider.on("end", this.onMouseUp);
  }

  public stop(): void {
    this.mouseMove.cancel();
    this.eventProvider.off("move", this.onMouseMove);
    this.eventProvider.off("end", this.onMouseUp);
  }

  protected getDelta(x: number, y: number): IPoint {
    const clientDX = x - this.prevClientX;
    const clientDY = y - this.prevClientY;
    this.prevClientX = x;
    this.prevClientY = y;
    return {
      x: clientDX,
      y: clientDY
    };
  }

  protected getTotalDelta(e: MouseEvent): IPoint {
    const x = e.clientX - this.startX;
    const y = e.clientY - this.startY;
    return {
      x,
      y
    };
  }

  protected doOnMouseMove(e: MouseEvent): void {
    const { x, y } = this.getPositionFromEvent(e);
    const { x: dx, y: dy } = this.getDelta(x, y);
    const { x: totalDX, y: totalDY } = this.getTotalDelta(e);
    this.onMove({
      clientX: x,
      clientY: y,
      dx,
      dy,
      totalDX,
      totalDY,
      e
    });
  }

  protected doOnMouseUp(e: T): void {
    e.preventDefault();
    const { x: totalDX, y: totalDY } = this.getTotalDelta(e);
    this.onEnd({ totalDX, totalDY, e });

    this.stop();
  }

  private readonly onMouseUp = (e: T) => {
    this.lastEvent = e;
    this.doOnMouseUp(e);
    this.lastEvent = null;
  };

  private readonly onMouseMove = (e: T) => {
    this.lastEvent = e;
    e.preventDefault();
    this.mouseMove(e);
  };
}

export function defaultGetPositionFromEvent<T extends MouseEvent>(e: T): IPoint {
  return {
    x: e.clientX,
    y: e.clientY
  };
}
