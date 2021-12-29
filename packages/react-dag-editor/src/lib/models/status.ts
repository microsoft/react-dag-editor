import * as Bitset from "../utils/bitset";
export interface IWithStatus<S extends number> {
  status?: S;
}

export const EMPTY_STATUS = 0;

export const SELECTED_STATUS = 0b0001;

export const ACTIVATED_STATUS = 0b00000010;

export enum GraphEdgeStatus {
  Default = EMPTY_STATUS,
  Selected = SELECTED_STATUS,
  Activated = ACTIVATED_STATUS,
  ConnectedToSelected = 0b00000100,
  UnconnectedToSelected = 0b00001000,
  Editing = 0b00010000,
}

export enum GraphNodeStatus {
  Default = EMPTY_STATUS,
  Selected = SELECTED_STATUS,
  Activated = ACTIVATED_STATUS,
  Editing = 0b00000100,
  ConnectedToSelected = 0b00001000,
  UnconnectedToSelected = 0b00010000,
}

export enum GraphPortStatus {
  Default = EMPTY_STATUS,
  Selected = SELECTED_STATUS,
  Activated = ACTIVATED_STATUS,
  Connecting = 0b0100,
  ConnectingAsTarget = 0b1000,
}

export const liftStatus =
  <S extends number>(updater: (status: S | undefined) => S) =>
  <T extends IWithStatus<S>>(value: T): Partial<T> => {
    const next = updater(((value.status as number) | 0) as S);
    if (next === value.status) {
      return value;
    }
    return {
      status: next as S,
    } as Partial<T>;
  };

export function isActivated<S extends number, T extends IWithStatus<S>>(
  value: T
): boolean {
  return Bitset.has(ACTIVATED_STATUS)(value.status);
}

export function isNodeEditing<T extends number>(node: IWithStatus<T>): boolean {
  return Bitset.has(GraphNodeStatus.Editing)(node.status);
}

export function isSelected<S extends number, T extends IWithStatus<S>>(
  value: T
): boolean {
  return Bitset.has(SELECTED_STATUS)(value.status);
}

export function notSelected<S extends number, T extends IWithStatus<S>>(
  value: T
): boolean {
  return !isSelected(value);
}

export const resetConnectStatus =
  (mask: number) => (prevStatus: number | undefined) => {
    return ((prevStatus || 0) & GraphNodeStatus.Activated) | mask;
  };
