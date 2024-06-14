import { FC } from "react";
import { Canvas, SingleGraphViewModel } from "../../src";

const viewModel = new SingleGraphViewModel();

export const CanvasStory: FC = () => {
  return <Canvas viewModel={viewModel} />;
};
