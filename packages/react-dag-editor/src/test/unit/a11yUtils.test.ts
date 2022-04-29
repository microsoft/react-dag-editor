import {
  applyDefaultPortsPosition,
  GraphModel,
  GraphNodeStatus,
  ICanvasPort,
  NodeModel,
} from "../../index";
import {
  getNextItem,
  getPrevItem,
  nextConnectablePort,
} from "../../lib/utils/a11yUtils";
import { getGraphConfig, makeNodes } from "../utils";

function ports(list: boolean[]): ICanvasPort[] {
  return applyDefaultPortsPosition(
    list.map((isConnectable, index) => ({
      id: String(index),
      name: String(index),
      properties: {
        isConnectable,
      },
    }))
  );
}

function mockData(): GraphModel {
  return GraphModel.fromJSON({
    edges: [],
    nodes: makeNodes(
      [
        GraphNodeStatus.Selected,
        GraphNodeStatus.Selected,
        GraphNodeStatus.Selected,
      ],
      ports([false, true, true])
    ),
  });
}

const emptyItem = () => ({
  nodeId: undefined,
  portId: undefined,
});

describe("test getNextItem", () => {
  it("should return nothing", () => {
    const data = mockData();
    expect(
      getNextItem(data, data.nodes.get("2")!, data.nodes.get("2")!.getPort("2"))
    ).toEqual(emptyItem());
    expect(
      getNextItem(
        GraphModel.fromJSON({
          edges: [],
          nodes: makeNodes([
            GraphNodeStatus.Selected,
            GraphNodeStatus.Selected,
            GraphNodeStatus.Selected,
          ]),
        }),
        NodeModel.fromJSON(
          {
            id: "2",
            x: 0,
            y: 0,
          },
          "1",
          undefined
        )
      )
    ).toEqual(emptyItem());
  });

  it("should return next node", () => {
    const data = mockData();
    const next = getNextItem(
      data,
      data.nodes.get("1")!,
      data.nodes.get("1")!.getPort("2")
    );
    expect(next.node?.id).toBe("2");
    expect(next.port?.id).toBeUndefined();
    const data2 = GraphModel.fromJSON({
      edges: [],
      nodes: makeNodes([
        GraphNodeStatus.Selected,
        GraphNodeStatus.Selected,
        GraphNodeStatus.Selected,
      ]),
    });
    expect(getNextItem(data2, data2.nodes.get("1")!).node?.id).toBe("2");
  });

  it("should return node's first port", () => {
    const data = mockData();
    const next = getNextItem(data, data.nodes.get("1")!);
    expect(next.node?.id).toBe("1");
    expect(next.port?.id).toBe("0");
  });

  it("should return next port", () => {
    const data = mockData();
    const next = getNextItem(
      data,
      data.nodes.get("1")!,
      data.nodes.get("1")!.getPort("1")
    );
    expect(next.node?.id).toBe("1");
    expect(next.port?.id).toBe("2");
  });
});

describe("test getPrevItem", () => {
  it("should return nothing", () => {
    const data = mockData();
    expect(getPrevItem(data, data.nodes.get("0")!)).toEqual(emptyItem());
    const data2 = GraphModel.fromJSON({
      edges: [],
      nodes: makeNodes([
        GraphNodeStatus.Selected,
        GraphNodeStatus.Selected,
        GraphNodeStatus.Selected,
      ]),
    });
    expect(getPrevItem(data2, data2.nodes.get("0")!)).toEqual(emptyItem());
  });

  it("should return prev node", () => {
    const data = GraphModel.fromJSON({
      edges: [],
      nodes: makeNodes([
        GraphNodeStatus.Selected,
        GraphNodeStatus.Selected,
        GraphNodeStatus.Selected,
      ]),
    });
    expect(getPrevItem(data, data.nodes.get("1")!).node?.id).toBe("0");
  });

  it("should return node's last port", () => {
    const data = mockData();
    const next = getPrevItem(data, data.nodes.get("1")!);
    expect(next.node?.id).toBe("0");
    expect(next.port?.id).toBe("2");
  });

  it("should return prev port", () => {
    const data = mockData();
    const next = getPrevItem(
      data,
      data.nodes.get("1")!,
      data.nodes.get("1")!.getPort("1")
    );
    expect(next.node?.id).toBe("1");
    expect(next.port?.id).toBe("0");
  });
});

describe("test nextConnectablePort", () => {
  const graphConfig = getGraphConfig();
  const next = nextConnectablePort(graphConfig, {
    anotherPort: undefined,
    anotherNode: undefined,
  });

  it("should return first connectable port", () => {
    const data = mockData();
    const item = next(data, data.nodes.get("0")!);
    expect(item.node?.id).toBe("0");
    expect(item.port?.id).toBe("1");
  });

  it("should return next connectable port", () => {
    const data = mockData();
    const item = next(
      data,
      data.nodes.get("0")!,
      data.nodes.get("0")!.getPort("1")
    );
    expect(item.node?.id).toBe("0");
    expect(item.port?.id).toBe("2");
  });

  it("should return next node's first connectable port", () => {
    const data = mockData();
    const item = next(
      data,
      data.nodes.get("0")!,
      data.nodes.get("0")!.getPort("2")
    );
    expect(item.node?.id).toBe("1");
    expect(item.port?.id).toBe("1");
  });

  it("should return first node if no more connectable ports available", () => {
    const data = mockData();
    const item = next(
      data,
      data.nodes.get("2")!,
      data.nodes.get("0")!.getPort("2")
    );
    expect(item.node?.id).toBe("0");
    expect(item.port?.id).toBe("1");
  });
});
