import { IEventProvider, IGlobalMoveEventTypes } from "./types";

export class MouseMoveEventProvider
  implements IEventProvider<IGlobalMoveEventTypes> {
  private readonly target: Window | Element;

  public constructor(target: Window | Element) {
    this.target = target;
  }

  public off<Type extends keyof IGlobalMoveEventTypes>(
    type: Type,
    callback: (...args: IGlobalMoveEventTypes[Type]) => void
  ): MouseMoveEventProvider {
    switch (type) {
      case "move":
        this.target.removeEventListener("mousemove", callback);
        break;
      case "end":
        this.target.removeEventListener("mouseup", callback);
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
        this.target.addEventListener("mousemove", callback);
        break;
      case "end":
        this.target.addEventListener("mouseup", callback);
        break;
      default:
    }
    return this;
  }
}
