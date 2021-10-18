import { ICanvasData } from "../../lib";

export const sampleGraphData: ICanvasData = {
  nodes: [
    {
      id: "source",
      name: "source",
      ports: [
        {
          id: "source-port",
          position: [0.5, 1],
          name: "source port",
          isInputDisabled: true,
          isOutputDisabled: false,
        },
      ],
      data: {},
      x: 100,
      y: 100,
      shape: "source",
    },
    {
      id: "step-1",
      name: "the first step",
      ports: [
        {
          id: "input-top",
          position: [0.5, 0],
          name: "input top",
          isOutputDisabled: true,
          shape: "myPort",
        },
        {
          id: "input-left",
          position: [0, 0.5],
          name: "input left",
          isOutputDisabled: true,
          shape: "myPort",
        },
        {
          id: "output-bottom",
          position: [0.5, 1],
          name: "output bottom",
          isInputDisabled: true,
          shape: "myPort",
        },
        {
          id: "output-right",
          position: [1, 0.5],
          name: "output right",
          isInputDisabled: true,
          shape: "myPort",
        },
      ],
      data: {},
      x: 100,
      y: 400,
      shape: "step",
    },
    {
      id: "step-2",
      name: "the second step",
      ports: [
        {
          id: "input-top",
          position: [0.5, 0],
          name: "input top",
          isOutputDisabled: true,
          shape: "myPort",
        },
        {
          id: "input-left",
          position: [0, 0.5],
          name: "input left",
          isOutputDisabled: true,
          shape: "myPort",
        },
        {
          id: "output-bottom",
          position: [0.5, 1],
          name: "output bottom",
          isInputDisabled: true,
          shape: "myPort",
        },
        {
          id: "output-right",
          position: [1, 0.5],
          name: "output right",
          isInputDisabled: true,
          shape: "myPort",
        },
      ],
      data: {},
      x: 600,
      y: 400,
      shape: "step",
    },
  ],
  edges: [],
};
