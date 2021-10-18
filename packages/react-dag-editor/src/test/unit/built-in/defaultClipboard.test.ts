import { applyDefaultPortsPosition, ICanvasData } from "../../../index";
import { DefaultClipboard, DefaultStorage } from "../../../lib/built-in";
import dataRaw from "../__data__/sampleICanvasData.json";

describe("defaultClipboard", () => {
  let clipboardStorage: DefaultStorage;
  let clipboard: DefaultClipboard;
  let data: ICanvasData;

  beforeAll(() => {
    clipboardStorage = new DefaultStorage();
    clipboard = new DefaultClipboard(clipboardStorage);
    data = {
      ...dataRaw,
      nodes: dataRaw.nodes.map((node) => ({
        ...node,
        ports: applyDefaultPortsPosition(node.ports || []),
      })),
    };
  });
  it("write", () => {
    clipboard.write(data);

    const expectedData = JSON.stringify({
      nodes: [
        {
          id: "1",
          name: "node-1",
          x: 100,
          y: 100,
          ports: applyDefaultPortsPosition([{ id: "port", name: "port" }]),
          data: {},
        },
        {
          id: "2",
          name: "node-2",
          x: 200,
          y: 200,
          ports: applyDefaultPortsPosition([{ id: "port", name: "port" }]),
          data: {},
        },
      ],
      edges: [
        {
          id: "0",
          source: "1",
          target: "2",
          sourcePortId: "port",
          targetPortId: "port",
          data: {},
        },
      ],
    });
    expect(clipboardStorage.getItem("graph-clipboard")).toBe(expectedData);
  });

  it("read not empty", () => {
    clipboard.write(data);
    const res = clipboard.read();
    const expectedData: ICanvasData = {
      nodes: [
        {
          id: "mock-uuid",
          name: "node-1",
          x: 150,
          y: 150,
          ports: applyDefaultPortsPosition([{ id: "port", name: "port" }]),
          data: {},
        },
        {
          id: "mock-uuid",
          name: "node-2",
          x: 250,
          y: 250,
          ports: applyDefaultPortsPosition([{ id: "port", name: "port" }]),
          data: {},
        },
      ],
      edges: [
        {
          id: "mock-uuid",
          source: "mock-uuid",
          target: "mock-uuid",
          sourcePortId: "port",
          targetPortId: "port",
          data: {},
        },
      ],
    };
    expect(res).toEqual(expectedData);
  });

  it("read empty", () => {
    clipboardStorage.setItem("graph-clipboard", "");
    expect(clipboard.read()).toEqual(null);
  });
});
