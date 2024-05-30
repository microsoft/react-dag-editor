import * as React from "react";
import { useFeatureControl } from "../hooks/useFeatureControl";
import type { IGraphConfig } from "../models/config/types";
import { GraphCanvasEvent, GraphNodeEvent } from "../models/event";
import type { EventChannel } from "../utils/eventChannel";
import { metaControl } from "../utils/keyboard";

export interface IGetCanvasKeyboardEventHandlers {
  featureControl: ReturnType<typeof useFeatureControl>;
  eventChannel: EventChannel;
  graphConfig: IGraphConfig;
  setCurHoverNode(nodeId: string | undefined): void;
  setCurHoverPort(value: [string, string] | undefined): void;
}

export const useCanvasKeyboardEventHandlers = (args: IGetCanvasKeyboardEventHandlers) => {
  const { featureControl, graphConfig, setCurHoverNode, setCurHoverPort, eventChannel } = args;

  const { isDeleteDisabled, isPasteDisabled, isUndoEnabled } = featureControl;

  return React.useMemo(() => {
    const keyDownHandlerMap = new Map<string, React.KeyboardEventHandler<SVGGElement>>();

    const deleteKeyDownHandler = () => (evt: React.KeyboardEvent<SVGSVGElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (isDeleteDisabled) {
        return;
      }

      eventChannel.trigger({
        type: GraphCanvasEvent.Delete,
      });

      setCurHoverNode(undefined);
      setCurHoverPort(undefined);
    };

    keyDownHandlerMap.set("delete", deleteKeyDownHandler());
    keyDownHandlerMap.set("backspace", deleteKeyDownHandler());

    const cKeyDownHandler = (evt: React.KeyboardEvent<SVGSVGElement>) => {
      if (metaControl(evt)) {
        evt.preventDefault();
        evt.stopPropagation();

        eventChannel.trigger({
          type: GraphCanvasEvent.Copy,
        });
      }
    };
    keyDownHandlerMap.set("c", cKeyDownHandler);

    const vKeyDownHandler = (evt: React.KeyboardEvent<SVGSVGElement>) => {
      if (metaControl(evt)) {
        evt.preventDefault();
        evt.stopPropagation();

        if (isPasteDisabled) {
          return;
        }

        const data = graphConfig.getClipboard().read();

        if (data) {
          eventChannel.trigger({
            type: GraphCanvasEvent.Paste,
            data,
          });
        }
      }
    };

    keyDownHandlerMap.set("v", vKeyDownHandler);

    const zKeyDownHandler = (evt: React.KeyboardEvent<SVGSVGElement>) => {
      if (!isUndoEnabled) {
        return;
      }

      if (metaControl(evt)) {
        evt.preventDefault();
        evt.stopPropagation();
        eventChannel.trigger({
          type: GraphCanvasEvent.Undo,
        });
      }
    };

    if (isUndoEnabled) {
      keyDownHandlerMap.set("z", zKeyDownHandler);
    }

    const yKeyDownHandler = (evt: React.KeyboardEvent<SVGSVGElement>) => {
      if (!isUndoEnabled) {
        return;
      }

      if (metaControl(evt)) {
        evt.preventDefault();
        evt.stopPropagation();

        eventChannel.trigger({
          type: GraphCanvasEvent.Redo,
        });
      }
    };

    if (isUndoEnabled) {
      keyDownHandlerMap.set("y", yKeyDownHandler);
    }

    const aKeyDownHandler = (evt: React.KeyboardEvent<SVGSVGElement>) => {
      if (metaControl(evt)) {
        evt.preventDefault();
        evt.stopPropagation();

        eventChannel.trigger({
          type: GraphNodeEvent.SelectAll,
        });
      }
    };

    keyDownHandlerMap.set("a", aKeyDownHandler);

    const spaceKeyDownHandler = (evt: React.KeyboardEvent<SVGSVGElement>) => {
      evt.preventDefault();
      evt.stopPropagation();
    };

    const ctrlKeyDownHandler = (evt: React.KeyboardEvent<SVGSVGElement>) => {
      evt.preventDefault();
      evt.stopPropagation();
    };

    const metaKeyDownHandler = (evt: React.KeyboardEvent<SVGSVGElement>) => {
      evt.preventDefault();
      evt.stopPropagation();
    };

    const shiftKeyDownHandler = (evt: React.KeyboardEvent<SVGSVGElement>) => {
      evt.preventDefault();
      evt.stopPropagation();
    };

    keyDownHandlerMap.set(" ", spaceKeyDownHandler);
    keyDownHandlerMap.set("control", ctrlKeyDownHandler);
    keyDownHandlerMap.set("meta", metaKeyDownHandler);
    keyDownHandlerMap.set("shift", shiftKeyDownHandler);

    return (evt: React.KeyboardEvent<SVGSVGElement>) => {
      if (evt.repeat) {
        return;
      }

      const key = evt.key.toLowerCase();
      const handler = keyDownHandlerMap.get(key);

      if (handler) {
        handler.call(null, evt);
      }
    };
  }, [eventChannel, graphConfig, isDeleteDisabled, isPasteDisabled, isUndoEnabled, setCurHoverNode, setCurHoverPort]);
};
