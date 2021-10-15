import { IEventProvider, IGlobalMoveEventTypes } from "./types";

export class MouseMoveEventProvider
  implements IEventProvider<IGlobalMoveEventTypes>
{
  private readonly target: Window | HTMLElement;

  public constructor(target: Window | HTMLElement) {
    this.target = target;
  }

  public off<Type extends keyof IGlobalMoveEventTypes>(
    type: Type,
    callback: (...args: IGlobalMoveEventTypes[Type]) => void
  ): MouseMoveEventProvider {
    switch (type) {
      case "move":
        this.target.removeEventListener(
          "mousemove",
          callback as (e: Event) => void
        );
        break;
      case "end":
        this.target.removeEventListener(
          "mouseup",
          callback as (e: Event) => void
        );
        break;
      default:
    }
    return this;
  }

  public on<Type extends keyof IGlobalMoveEventTypes>(
    type: Type,
    callback: (...args: IGlobalMoveEventTypes[Type]) => void
  ): MouseMoveEventProvider {
    switch (type) {
      case "move":
        this.target.addEventListener(
          "mousemove",
          callback as (e: Event) => void
        );
        break;
      case "end":
        this.target.addEventListener("mouseup", callback as (e: Event) => void);
        break;
      default:
    }
    return this;
  }
}
