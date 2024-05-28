import * as React from "react";
import { IEventProvider, IGlobalMoveEventTypes } from "../event-provider/types";
import { IContainerRect } from "../models/geometry";
import { DragController, TGetPositionFromEvent } from "./DragController";

export class DragNodeController extends DragController {
  private readonly rectRef: React.RefObject<IContainerRect | undefined>;

  public constructor(
    globalMoveEventProvider: IEventProvider<IGlobalMoveEventTypes>,
    getPositionFromEvent: TGetPositionFromEvent,
    rectRef: React.RefObject<IContainerRect | undefined>
  ) {
    super(globalMoveEventProvider, getPositionFromEvent);
    this.rectRef = rectRef;
  }

  protected doOnMouseMove(e: MouseEvent): void {
    super.doOnMouseMove(e);
    const rect = this.rectRef.current;
    if (!rect || !this.lastEvent) {
      return;
    }
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      this.mouseMove(this.lastEvent);
    }
  }
}
