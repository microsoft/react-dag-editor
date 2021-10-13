import * as React from "react";
import {
  Graph,
  GraphCanvasEvent,
  GraphModel,
  ReactDagEditor,
  useGraphReducer,
  useClipboard,
  IDispatch,
} from "../../src";
import { sampleGraphData } from "../data/sample-graph-1";
import { graphConfig } from "./FeaturesDemo";

const Toolbar: React.FC<{ dispatch: IDispatch }> = ({ dispatch }) => {
  const clipboard = useClipboard();

  const deleteHandler = React.useCallback(() => {
    dispatch({
      type: GraphCanvasEvent.Delete,
    });
  }, [dispatch]);

  const copyHandler = React.useCallback(() => {
    dispatch({
      type: GraphCanvasEvent.Copy,
    });
  }, [dispatch]);

  const pasteHandler = React.useCallback(() => {
    dispatch({
      type: GraphCanvasEvent.Paste,
      data: clipboard.read(),
      position: { x: 200 * Math.random(), y: 200 * Math.random() },
    });
  }, [clipboard, dispatch]);

  return (
    <div style={{ display: "flex" }}>
      <button onClick={deleteHandler}>delete</button>
      <button onClick={copyHandler}>copy</button>
      <button onClick={pasteHandler}>paste</button>
    </div>
  );
};

export const CommonToolbar: React.FC = () => {
  const [state, dispatch] = useGraphReducer(
    {
      settings: {
        graphConfig,
      },
      data: GraphModel.fromJSON(sampleGraphData),
    },
    undefined
  );

  return (
    <ReactDagEditor style={{ width: "900px", height: "600px" }} state={state} dispatch={dispatch}>
      <Toolbar dispatch={dispatch} />
      <Graph />
    </ReactDagEditor>
  );
};
