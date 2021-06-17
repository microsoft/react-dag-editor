import { ICanvasData } from "../../src";

export const sampleGraphData: ICanvasData = {
  nodes: [
    {
      id: "source",
      name: "source",
      ports: [],
      data: {},
      x: 100,
      y: 100,
      shape: "source"
    },
    {
      id: "step-1",
      name: "the first step",
      ports: [],
      data: {},
      x: 100,
      y: 400,
      shape: "step"
    },
    {
      id: "step-2",
      name: "the second step",
      ports: [],
      data: {},
      x: 600,
      y: 400,
      shape: "step"
    }
  ],
  edges: []
};
