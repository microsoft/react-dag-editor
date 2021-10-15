import { $Cons } from "../utils/tuple";

export interface IEventProvider<
  EventTypes extends Record<string, unknown[]>,
  Type extends keyof EventTypes = keyof EventTypes
> {
  on(
    type: Type,
    callback: (...args: EventTypes[Type]) => void
  ): IEventProvider<EventTypes, Type>;
  off(
    type: Type,
    callback: (...args: EventTypes[Type]) => void
  ): IEventProvider<EventTypes, Type>;
}

export type IGlobalMoveEventTypes<Args extends unknown[] = []> = Record<
  "start" | "move" | "end",
  $Cons<MouseEvent, Args>
>;
