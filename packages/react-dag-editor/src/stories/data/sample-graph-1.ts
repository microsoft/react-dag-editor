import { ICanvasData } from "../..";

export const sampleGraphData: ICanvasData = {
  nodes: [
    {
      id: "source-1",
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
      data: {
        nodeType: "source",
      },
      x: 100,
      y: 100,
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
          data: {
            nodeType: "myPort",
          },
        },
        {
          id: "input-left",
          position: [0, 0.5],
          name: "input left",
          isOutputDisabled: true,
          data: {
            nodeType: "myPort",
          },
        },
        {
          id: "output-bottom",
          position: [0.5, 1],
          name: "output bottom",
          isInputDisabled: true,
          data: {
            nodeType: "myPort",
          },
        },
        {
          id: "output-right",
          position: [1, 0.5],
          name: "output right",
          isInputDisabled: true,
          data: {
            nodeType: "myPort",
          },
        },
      ],
      data: {
        nodeType: "step",
      },
      x: 100,
      y: 400,
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
          data: {
            nodeType: "myPort",
          },
        },
        {
          id: "input-left",
          position: [0, 0.5],
          name: "input left",
          isOutputDisabled: true,
          data: {
            nodeType: "myPort",
          },
        },
        {
          id: "output-bottom",
          position: [0.5, 1],
          name: "output bottom",
          isInputDisabled: true,
          data: {
            nodeType: "myPort",
          },
        },
        {
          id: "output-right",
          position: [1, 0.5],
          name: "output right",
          isInputDisabled: true,
          data: {
            nodeType: "myPort",
          },
        },
      ],
      data: {
        nodeType: "step",
      },
      x: 600,
      y: 400,
    },
    {
      id: "step-3",
      name: "Step at upper layer will cover others",
      x: 300,
      y: 200,
      width: 450,
      layer: 10,
      data: {
        nodeType: "step",
      },
    },
    {
      id: "source-2",
      name: "source 2",
      ports: [],
      data: {
        nodeType: "source",
      },
      x: 620,
      y: 180,
    },
    {
      id: "note-1",
      name: "Double click to see custom anchors",
      x: 100,
      y: 200,
      layer: 11,
      data: {
        nodeType: "note",
      },
    },
  ],
  edges: [],
};
