import { FC } from "react";
import { ReactDagEditor, Graph, createGraphState, IDispatch } from "react-dag-editor";
import { IGraphState } from "../types/core";
import { SingleGraphViewModel } from "../viewmodels/SingleGraphViewModel";

export interface ICanvasProps {
  viewModel: SingleGraphViewModel;
}

export const Canvas: FC<ICanvasProps> = ({ viewModel }) => {
  const state: IGraphState = createGraphState({
    data: viewModel.getData(),
  });

  return (
    <ReactDagEditor state={state} dispatch={viewModel.dispatch.bind(viewModel) as IDispatch}>
      <Graph />
    </ReactDagEditor>
  );
};
