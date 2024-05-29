import * as React from "react";
import { TouchController, TwoFingerHandler } from "../controllers";
import { IContainerRect } from "../models/geometry";
import { EventChannel } from "../utils/eventChannel";

export const useGraphTouchHandler = (
  rectRef: React.RefObject<IContainerRect | undefined>,
  eventChannel: EventChannel,
) => {
  return React.useMemo(() => {
    const touchEvents = new TouchController(new Map().set(2, new TwoFingerHandler(rectRef, eventChannel)));
    return touchEvents.eventHandlers;
  }, [rectRef, eventChannel]);
};
