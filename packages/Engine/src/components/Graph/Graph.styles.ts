import { mergeStyleSets } from "@fluentui/merge-styles";
import * as React from "react";
import { ITheme } from "../../contexts";
import { GraphBehavior, IGraphState } from "../../contexts/GraphStateContext";
import { CanvasMouseMode, IGap } from "../../Graph.interface";
import classes from "../Graph.styles.m.scss";
import { IGraphProps } from "./IGraphProps";

interface IGetCursorStyleArgs {
  state: IGraphState;
  canvasMouseMode?: CanvasMouseMode;
  isPanDisabled?: boolean;
  isMultiSelecting: boolean;
}

const getCursorStyle = ({ canvasMouseMode, state, isPanDisabled, isMultiSelecting }: IGetCursorStyleArgs): string => {
  if (state.behavior === GraphBehavior.connecting) {
    return "initial";
  }

  const isClickMultipleSelect = ["meta", "control"].some(key => state.activeKeys.has(key));

  if (isClickMultipleSelect) {
    return "initial";
  }

  const isAreaSelection = state.activeKeys.has("shift");

  if (isAreaSelection) {
    return "crosshair";
  }

  // selection mode
  if (canvasMouseMode !== CanvasMouseMode.pan) {
    if (state.activeKeys.has(" ") && !isPanDisabled) {
      return "grab";
    }

    if (isMultiSelecting) {
      return "crosshair";
    }

    return "inherit";
  }

  return isPanDisabled ? "inherit" : "grab";
};

/**
 * @param state
 * @param isNodeDraggable
 */
function getNodeCursor(isNodeDraggable: boolean): string {
  return isNodeDraggable ? "move" : "initial";
}

function getSvgPaddingStyle({ top = 0, right = 0, left = 0, bottom = 0 }: IGap): React.CSSProperties {
  return {
    top,
    left,
    width: `calc(100% - ${left}px - ${right}px)`,
    height: `calc(100% - ${top}px - ${bottom}px)`
  };
}

interface IGraphStyles {
  svg: string;
  container: string;
  buttonA11y: string;
  node: string;
}

export const getGraphStyles = (
  props: IGraphProps,
  state: IGraphState,
  theme: ITheme,
  isPanDisabled: boolean,
  isNodeDraggable: boolean,
  focusedWithoutMouse: boolean,
  isMultiSelecting: boolean
): IGraphStyles => {
  return mergeStyleSets({
    svg: [
      "react-dag-editor-svg-container",
      classes.svg,
      props.styles?.svg,
      getSvgPaddingStyle(props.padding ?? {}),
      {
        "& *:focus": {
          outline: theme.outlineStyle
        },
        [`& .${classes.node}`]: {
          cursor: getNodeCursor(isNodeDraggable)
        }
      }
    ],
    container: [
      "react-dag-editor-container",
      classes.container,
      {
        cursor: getCursorStyle({
          canvasMouseMode: props.canvasMouseMode,
          state,
          isPanDisabled,
          isMultiSelecting
        }),
        [`&.${classes.container}`]: {
          background: theme.canvasBackground,
          ...props.style,
          ...props.styles?.root
        }
      },
      focusedWithoutMouse && {
        outline: `${theme.focusOutlineColor} solid 1px`
      }
    ],
    buttonA11y: ["react-dag-editor-a11y-help-button", classes.buttonA11Y],
    node: [classes.node]
  });
};
