export const SELECTED = 0b0001;

// prettier-ignore
export enum GraphEdgeState {
  default = 0b00000000,
  selected = SELECTED,
  activated = 0b00000010,
  connectedToSelected = 0b00000100,
  unconnectedToSelected = 0b00001000,
  editing = 0b00010000
}

// prettier-ignore
export enum GraphNodeState {
  default = 0b00000000,
  selected = SELECTED,
  activated = 0b00000010,
  editing = 0b00000100,
  connectedToSelected = 0b00001000,
  unconnectedToSelected = 0b00010000,
}

export enum GraphNodeStateConst {
  default = "default",
  selected = "selected",
  activated = "activated",
  editing = "editing",
  connectedToSelected = "connectedToSelected",
  unconnectedToSelected = "unconnectedToSelected"
}

// prettier-ignore
export enum GraphPortState {
  default = 0b0000,
  selected = SELECTED,
  activated = 0b0010,
  connecting = 0b0100,
  connectingAsTarget = 0b1000
}
