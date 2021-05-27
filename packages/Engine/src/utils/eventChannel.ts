import { createRef } from "react";
import { IEvent } from "../Graph.interface";
import { batchedUpdates } from "./batchedUpdates";

export type IGraphEventHandler<T = unknown, P = unknown, U = unknown> = (event: IEvent<T, P, U>) => void;

export class EventChannel {
  public readonly listenersRef = createRef<IGraphEventHandler[]>();
  private queue: IEvent[] = [];
  private working = false;

  public trigger(event: IEvent): void {
    if (this.working) {
      this.queue.push(event);
    } else {
      this.working = true;
      batchedUpdates(() => {
        this.listenersRef.current?.forEach(fn => fn(event));
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.queue.length; i += 1) {
          const e = this.queue[i];
          this.listenersRef.current?.forEach(fn => fn(e));
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
}
