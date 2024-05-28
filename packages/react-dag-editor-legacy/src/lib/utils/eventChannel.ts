import { createRef } from "react";
import { IEvent } from "../models/event";
import { batchedUpdates } from "./batchedUpdates";

export type IGraphEventHandler<T = unknown, P = unknown, U = unknown> = (
  event: IEvent<T, P, U>
) => void;

export class EventChannel {
  public readonly listenersRef = createRef<IGraphEventHandler>();
  public readonly externalHandlerRef = createRef<
    IGraphEventHandler | undefined
  >();
  private queue: IEvent[] = [];
  private working = false;

  public trigger(event: IEvent): void {
    if (this.working) {
      this.queue.push(event);
    } else {
      this.working = true;
      batchedUpdates(() => {
        this.callHandlers(event);
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.queue.length; i += 1) {
          const e = this.queue[i];
          this.callHandlers(e);
        }
        this.queue = [];
      });
      this.working = false;
    }
  }

  public batch(events: IEvent[]): void {
    if (this.working) {
      this.queue.push(...events);
    } else {
      const first = events[0];
      if (!first) {
        return;
      }
      this.queue.push(...events.slice(1));
      this.trigger(first);
    }
  }

  private callHandlers(e: IEvent): void {
    this.listenersRef.current?.(e);
    if (!e.intercepted) {
      this.externalHandlerRef.current?.(e);
    }
  }
}
