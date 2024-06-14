import { FC } from "react";
import { SingleGraphViewModel } from "../viewmodels/SingleGraphViewModel";
import { Canvas } from "./Canvas";

export interface IReactDagEditorProps {
  viewModel: SingleGraphViewModel;
}

export const ReactDagEditor: FC<IReactDagEditorProps> = ({ viewModel }) => {
  return (
    <div>
      <Canvas viewModel={viewModel} />
    </div>
  );
};
