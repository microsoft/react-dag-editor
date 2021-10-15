import { identical } from "./identical";

export interface IHistoryNode<T> {
  next: IHistoryNode<T> | null;
  value: T;
}

export interface IHistory<T> {
  present: T;
  past: IHistoryNode<T> | null;
  future: IHistoryNode<T> | null;
}

export const pushHistory = <T>(history: IHistory<T>, data: T, mapPresent: (value: T) => T = identical): IHistory<T> => {
  return {
    present: data,
    past: {
      next: history.past,
      value: mapPresent(history.present)
    },
    future: null
  };
};

export const undo = <T>(history: IHistory<T>): IHistory<T> => {
  if (!history.past) {
    return history;
  }
  return {
    present: history.past.value,
    past: history.past.next,
    future: {
      next: history.future,
      value: history.present
    }
  };
};

export const redo = <T>(history: IHistory<T>): IHistory<T> => {
  if (!history.future) {
    return history;
  }
  return {
    present: history.future.value,
    past: {
      next: history.past,
      value: history.present
    },
    future: history.future.next
  };
};

export const resetUndoStack = <T>(data: T): IHistory<T> => {
  return {
    present: data,
    future: null,
    past: null
  };
};

export const canUndo = <T>(history: IHistory<T>) => history.past !== null;

export const canRedo = <T>(history: IHistory<T>) => history.future !== null;
