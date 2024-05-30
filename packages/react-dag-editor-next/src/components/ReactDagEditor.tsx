import { FC } from "react";
import { SingleGraphViewModel } from "../viewmodels/SingleGraphViewModel";

export interface IReactDagEditorProps {
  viewModel: SingleGraphViewModel;
}

export const ReactDagEditor: FC<IReactDagEditorProps> = () => {
  return <div>ReactDagEditor</div>;
};
