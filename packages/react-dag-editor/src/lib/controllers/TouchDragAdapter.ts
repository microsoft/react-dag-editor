import { IEventProvider, IGlobalMoveEventTypes } from "../event-provider/types";
import { $Cons } from "../utils/tuple";
import { ITouchHandler } from "./TouchController";

export class TouchDragAdapter<ExtraArgs extends unknown[] = []>
  implements
    IEventProvider<IGlobalMoveEventTypes<ExtraArgs>>,
    ITouchHandler<ExtraArgs>
{
  private readonly startListeners = new Set<
    (...args: $Cons<MouseEvent, ExtraArgs>) => void
  >();
  private readonly moveListeners = new Set<
    (...args: $Cons<MouseEvent, ExtraArgs>) => void
  >();
  private readonly endListeners = new Set<
    (...args: $Cons<MouseEvent, ExtraArgs>) => void
  >();

  public off(
    type: "start" | "move" | "end",
    callback: (...args: $Cons<MouseEvent, ExtraArgs>) => void
  ): TouchDragAdapter<ExtraArgs> {
    switch (type) {
      case "start":
        this.startListeners.delete(callback);
        break;
      case "move":
        this.moveListeners.delete(callback);
        break;
      case "end":
        this.endListeners.delete(callback);
        break;
      default:
    }
    return this;
  }

  public on(
    type: "start" | "move" | "end",
    callback: (...args: $Cons<MouseEvent, ExtraArgs>) => void
  ): TouchDragAdapter<ExtraArgs> {
    switch (type) {
      case "start":
        this.startListeners.add(callback);
        break;
      case "move":
        this.moveListeners.add(callback);
        break;
      case "end":
        this.endListeners.add(callback);
        break;
      default:
    }
    return this;
  }

  public onStart(
    events: Map<number, PointerEvent>,
    e: PointerEvent,
    ...args: ExtraArgs
  ): void {
    this.startListeners.forEach((cb) => {
      cb.call(undefined, e, ...args);
    });
  }

  public onMove(
    events: Map<number, PointerEvent>,
    e: PointerEvent,
    ...args: ExtraArgs
  ): void {
    this.moveListeners.forEach((cb) => {
      cb.call(undefined, e, ...args);
    });
  }

  public onEnd(e: PointerEvent, ...args: ExtraArgs): void {
    this.endListeners.forEach((cb) => {
      cb.call(undefined, e, ...args);
    });
  }
}
