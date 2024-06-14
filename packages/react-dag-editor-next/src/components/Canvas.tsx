import { FC } from "react";
import { ReactDagEditor, Graph, createGraphState, IDispatch, GraphConfigBuilder } from "react-dag-editor";
import { IGraphState } from "../types/core";
import { SingleGraphViewModel } from "../viewmodels/SingleGraphViewModel";

export interface ICanvasProps {
  viewModel: SingleGraphViewModel;
}

export const Canvas: FC<ICanvasProps> = ({ viewModel }) => {
  const graphConfig = GraphConfigBuilder.default<never, never, never>().build();
  const state: IGraphState = createGraphState<never, never, never>({
    data: viewModel.getData(),
    settings: {
      graphConfig,
    },
  });

  return (
    <ReactDagEditor state={state} dispatch={viewModel.dispatch.bind(viewModel) as IDispatch}>
      <Graph />
    </ReactDagEditor>
  );
};
