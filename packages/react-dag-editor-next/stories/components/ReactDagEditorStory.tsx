import { FC } from "react";
import { ICanvasData } from "react-dag-editor";
import { ReactDagEditor, SingleGraphViewModel } from "../../src";

const initData: ICanvasData = {
  nodes: [],
  edges: [],
};

const viewModel = new SingleGraphViewModel();

export const ReactDagEditorStory: FC = () => {
  return (
    <div>
      <button onClick={() => viewModel.setData(initData)}>Load init data</button>
      <ReactDagEditor viewModel={viewModel} />
    </div>
  );
};
