import { GraphNodeState, ICanvasNode, SELECTED } from "../Graph.interface";

export const hasState = (mask: number) => (state: number | undefined) => Boolean(pickState(mask)(state));

export const addState = (mask: number | number[]) => (state: number | undefined): number => {
  const t = state || 0;
  if (Array.isArray(mask)) {
    return mask.reduce((c, m) => c | m, t);
  } else {
    return t | mask;
  }
};

export const toggleState = (mask: number) => (state: number | undefined) => {
  const t = state || 0;
  return t ^ mask;
};

export const pickState = (mask: number) => (state: number | undefined) => {
  const t = state || 0;
  return t & mask;
};

/**
 *
 * @param maskObj
 *  {editing: false, activated: true }
 * @param state number | undefined
 */
export const updateNodeState = (maskObj: { [key: string]: boolean }, state: number | undefined) => {
  let t = state || 0;
  Object.keys(maskObj).forEach(k => {
    if (maskObj[k]) {
      t = addState(GraphNodeState[k])(t);
    } else if (!maskObj[k]) {
      t = removeState(GraphNodeState[k])(t);
    }
  });
  return t;
};

export const removeState = (mask: number | number[]) => (state: number | undefined) => {
  const t = state || 0;
  if (Array.isArray(mask)) {
    return mask.reduce((c, m) => c & ~m, t);
  } else {
    return t & ~mask;
  }
};

export const resetState = (state: number) => () => state;

export const resetConnectState = (state: number) => (prevState: number) => {
  return (prevState & GraphNodeState.activated) | state;
};

export const updateState = (updater: (state: number | undefined) => number) => <T extends { state?: number }>(
  value: T
) => {
  const nextState = updater(value.state);
  if (nextState === value.state) {
    return value;
  }
  return {
    ...value,
    state: updater(value.state)
  };
};

export const isNodeEditing = (node: ICanvasNode) => hasState(GraphNodeState.editing)(node.state);

export const isNodeActivated = (node: ICanvasNode) => hasState(GraphNodeState.activated)(node.state);

export const isSelected = (node: { state?: number }) => hasState(SELECTED)(node.state);

export const notSelected = (node: { state?: number }) => !hasState(SELECTED)(node.state);

export const hasSelectedPort = (node: ICanvasNode) => {
  const ports = node.ports || [];
  for (const port of ports) {
    if (hasState(SELECTED)(port.state)) {
      return true;
    }
  }
  return false;
};
