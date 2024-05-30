/**
 * convert WheelEvent delta to pixels by deltaMode
 * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent
 * https://stackoverflow.com/questions/20110224/what-is-the-height-of-a-line-in-a-wheel-event-deltamode-dom-delta-line
 */

import DOMPurify from "dompurify";
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
    const { contentDocument } = iframe;
    if (!contentDocument) {
      throw new Error("Fail to create iframe");
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    contentDocument.documentElement.innerHTML = DOMPurify.sanitize("<span>a</span>", {
      RETURN_TRUSTED_TYPE: true,
    });
    const span = contentDocument.body.firstElementChild as HTMLSpanElement;
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
    : (_deltaMode: number, delta: number) => delta;
