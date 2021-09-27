/**
 * https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
 */
export enum MouseEventButton {
  /**
   * usually the left button or the un-initialized state
   */
  Primary = 0,
  /**
   * usually the wheel button or the middle button (if present)
   */
  Auxiliary = 1,
  /**
   * usually the right button
   */
  Secondary = 2,
  /**
   * typically the Browser Back button
   */
  Fourth = 4,
  /**
   * typically the Browser Forward button
   */
  Fifth = 5,
}

export enum MouseEventButtons {
  None = 0,
  Left = 1,
  Right = 2,
  Middle = 4,
}

export const DEFAULT_AUTO_ALIGN_THRESHOLD = 50;
export const COPIED_NODE_SPACING = 50;
export const NODE_MIN_VISIBLE_LENGTH = 5;
export const NODE_MAX_VISIBLE_LENGTH = 500;
