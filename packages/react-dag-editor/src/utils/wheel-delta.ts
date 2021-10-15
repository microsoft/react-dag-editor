/**
 * convert WheelEvent delta to pixels by deltaMode
 * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent
 * https://stackoverflow.com/questions/20110224/what-is-the-height-of-a-line-in-a-wheel-event-deltamode-dom-delta-line
 */

/* eslint-disable compat/compat */

import { Debug } from "./debug";

/**
 * get browser scroll line height by iframe
 *
 * @returns line height in px
 */
function getScrollLineHeight(): number {
  try {
    const iframe = document.createElement("iframe");
    iframe.src = "#";
    document.body.appendChild(iframe);
    const { contentWindow } = iframe;
    if (!contentWindow) {
      throw new Error("Fail to create iframe");
    }
    const doc = contentWindow.document;
    if (!doc) {
      throw new Error("Fail to create iframe");
    }
    doc.open();
    doc.write(
      "<!DOCTYPE html><html><head></head><body><span>a</span></body></html>"
    );
    doc.close();
    const span = doc.body.firstElementChild as HTMLSpanElement;
    const height = span.offsetHeight;
    document.body.removeChild(iframe);
    return height;
  } catch (e) {
    Debug.error("failed to calculate scroll line height", e);
    return 16;
  }
}

const scrollLineHeight = getScrollLineHeight();

export const normalizeWheelDelta =
  // eslint-disable-next-line @typescript-eslint/tslint/config
  typeof WheelEvent === "function"
    ? (deltaMode: number, delta: number): number => {
        switch (deltaMode) {
          case WheelEvent.DOM_DELTA_PIXEL:
            return delta;
          case WheelEvent.DOM_DELTA_LINE:
            return delta * scrollLineHeight;
          case WheelEvent.DOM_DELTA_PAGE:
            return delta * window.innerHeight;
          default:
            return delta;
        }
      }
    : (deltaMode: number, delta: number) => delta;
