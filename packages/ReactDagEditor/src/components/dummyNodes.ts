import { IDummyNodes } from "../models/dummy-node";

export const emptyDummyNodes = (): IDummyNodes => ({
  dx: 0,
  dy: 0,
  dWidth: 0,
  dHeight: 0,
  alignedDX: undefined,
  alignedDY: undefined,
  nodes: [],
  isVisible: false
});
