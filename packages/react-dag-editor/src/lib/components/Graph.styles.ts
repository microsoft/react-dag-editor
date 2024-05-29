// use static css file here
// if we use css-in-js, classNames are generated in Graph component
// while node dragged out from module list can't get then className

import { mergeStyleSets } from "@fluentui/merge-styles";

const styles = mergeStyleSets({
  svg: [
    {
      position: "absolute",
      overflow: "hidden",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    {
      "&:focus": {
        outline: "none",
      },
    },
  ],

  node: {
    cursor: "move",
  },

  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    touchAction: "none",
  },

  buttonA11Y: {
    opacity: 0,
    width: 0,
    height: 0,
    overflow: "hidden",
  },

  addingNodeSvg: {
    zIndex: 1000000,
    position: "fixed",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
  },

  moduleItem: {
    userSelect: "none",
    cursor: "pointer",
  },

  minimap: {
    height: 320,
    width: 320,
    userSelect: "none",
    touchAction: "none",
  },

  minimapSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});

// eslint-disable-next-line import/no-default-export
export default styles;
