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

export const defaultColors = {
  controlPointColor: "#333333",
  primaryColor: "#0078D4",
  defaultColor: "#CCCCCC",
  borderColor: "#B3B0AD",
  defaultBorderColor: "#FFFFFF",
  unConnectableBgColor: "#E1DFDD",
  defaultBackgroundColor: "#FFFFFF",
  portStroke: "#ccc",
  portFill: "#fff",
  connectedPortColor: "gray",
  nodeActivateFill: "#ffffff",
  nodeActivateStroke: "#0078D4",
  nodeFill: "#ffffff",
  nodeStroke: "#cccccc",
  contextMenuBackground: "#FFFFFF",
  contextMenuBorder: "#E1DFDD",
  contextMenuHoverBackground: "rgba(0, 120, 212, 0.05)",
  fontColor: "#000000",
  canvasBackground: "#EDEDED",
  minimapBackground: "#EDEDED",
  edgeColor: "#ccc",
  edgeColorSelected: "#015cda",
  minimapShadow: "#000000",
  outlineStyle: "none",
  focusOutlineColor: "#000000",
  dummyNodeStroke: "#015cda",
  inputFocusBorderAlt: "#0078d4",
  buttonBorder: "#797775",
  scrollbarColor: "#c8c8c8"
};
