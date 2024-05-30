import * as React from "react";
import { Handler } from "../components/NodeAnchors";
import { defaultGetPositionFromEvent, DragController } from "../controllers";
import { MouseMoveEventProvider } from "../event-provider/MouseMoveEventProvider";
import { useGraphController } from "../hooks/context";
import { GraphNodeEvent } from "../models/event";
import { NodeModel } from "../models/NodeModel";
import { EventChannel } from "../utils/eventChannel";

export const useGetMouseDownOnAnchor = (node: NodeModel, eventChannel: EventChannel) => {
  const graphController = useGraphController();

  return React.useCallback(
    (f: Handler) => (evt: React.MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();

      eventChannel.trigger({
        type: GraphNodeEvent.ResizingStart,
        rawEvent: evt,
        node,
      });

      const drag = new DragController(
        new MouseMoveEventProvider(graphController.getGlobalEventTarget()),
        defaultGetPositionFromEvent,
      );
      drag.onMove = ({ totalDX, totalDY, e: rawEvent }) => {
        eventChannel.trigger({
          type: GraphNodeEvent.Resizing,
          rawEvent,
          node,
          dx: 0,
          dy: 0,
          dWidth: 0,
          dHeight: 0,
          ...f(totalDX, totalDY),
        });
      };
      drag.onEnd = ({ e: rawEvent }) => {
        eventChannel.trigger({
          type: GraphNodeEvent.ResizingEnd,
          rawEvent,
          node,
        });
      };
      eventChannel.trigger({
        type: GraphNodeEvent.ResizingStart,
        rawEvent: evt,
        node,
      });
      drag.start(evt.nativeEvent);
    },
    [eventChannel, graphController, node],
  );
};
