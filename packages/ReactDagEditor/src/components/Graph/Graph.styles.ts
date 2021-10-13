import { mergeStyleSets } from "@fluentui/merge-styles";
import { defaultColors } from "../../common/constants";
import { CanvasMouseMode, GraphBehavior, IGraphState } from "../../models/state";
import classes from "../Graph.styles.m.scss";
import { IGraphProps } from "./IGraphProps";

interface IGetCursorStyleArgs {
  state: IGraphState;
  canvasMouseMode?: CanvasMouseMode;
  isPanDisabled?: boolean;
  isMultiSelecting: boolean;
}

const getCursorStyle = ({ canvasMouseMode, state, isPanDisabled, isMultiSelecting }: IGetCursorStyleArgs): string => {
  if (state.behavior === GraphBehavior.Connecting) {
    return "initial";
  }

  const isClickMultipleSelect = ["meta", "control"].some((key) => state.activeKeys.has(key));

  if (isClickMultipleSelect) {
    return "initial";
  }

  const isAreaSelection = state.activeKeys.has("shift");

  if (isAreaSelection) {
    return "crosshair";
  }

  // selection mode
  if (canvasMouseMode !== CanvasMouseMode.Pan) {
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

interface IGraphStyles {
  svg: string;
  container: string;
  buttonA11y: string;
  node: string;
}

export const getGraphStyles = (
  props: IGraphProps,
  state: IGraphState,
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
      {
        "& *:focus": {
          outline: defaultColors.outlineStyle,
        },
        [`& .${classes.node}`]: {
          cursor: getNodeCursor(isNodeDraggable),
        },
      },
    ],
    container: [
      "react-dag-editor-container",
      classes.container,
      {
        cursor: getCursorStyle({
          canvasMouseMode: props.canvasMouseMode,
          state,
          isPanDisabled,
          isMultiSelecting,
        }),
        [`&.${classes.container}`]: {
          background: defaultColors.canvasBackground,
          ...props.style,
          ...props.styles?.root,
        },
      },
      focusedWithoutMouse && {
        outline: `${defaultColors.focusOutlineColor} solid 1px`,
      },
    ],
    buttonA11y: ["react-dag-editor-a11y-help-button", classes.buttonA11Y],
    node: [classes.node],
  });
};
