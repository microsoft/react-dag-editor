import {
  filterSelectedItems,
  GraphEdgeState,
  GraphModel,
  GraphNodeState,
  GraphPortState,
  IZoomPanSettings
} from "../../src";
import { ISelectBoxPosition } from "../../src/components/Graph/SelectBox";
import { getNeighborPorts } from "../../src/utils";
import { selectNodeBySelectBox } from "../../src/utils/updateNodeBySelectBox";
import { getGraphConfig, makeEdges, makeNodes, makePorts } from "../utils";
import { IHistory, pushHistory, redo, resetUndoStack, undo } from "../../src/utils/history";

describe("test getNeighborPorts", () => {
  /**
   *
   */
  function mockData(): GraphModel {
    return GraphModel.fromJSON({
      edges: makeEdges([
        [GraphEdgeState.default, ["0", "0"], ["1", "1"]],
        [GraphEdgeState.default, ["0", "1"], ["2", "0"]]
      ]),
      nodes: makeNodes(
        [GraphNodeState.default, GraphNodeState.default, GraphNodeState.default],
        makePorts([GraphPortState.default, GraphPortState.default, GraphPortState.default])
      )
    });
  }

  it("should return target ports", () => {
    const neighbors = getNeighborPorts(mockData(), "0", "0");
    expect(neighbors).toEqual([
      {
        nodeId: "1",
        portId: "1"
      }
    ]);
  });

  it("should return source ports", () => {
    const neighbors = getNeighborPorts(mockData(), "1", "1");
    expect(neighbors).toEqual([
      {
        nodeId: "0",
        portId: "0"
      }
    ]);
  });
});

describe("test filterSelectedItems", () => {
  it("should return only empty", () => {
    const selected = filterSelectedItems(
      GraphModel.fromJSON({
        edges: makeEdges([
          [GraphEdgeState.default, ["0", "0"], ["1", "1"]],
          [GraphEdgeState.default, ["0", "1"], ["2", "0"]]
        ]),
        nodes: makeNodes(
          [GraphNodeState.default, GraphNodeState.default, GraphNodeState.default],
          makePorts([GraphPortState.default, GraphPortState.default, GraphPortState.default])
        )
      })
    );
    expect(selected).toEqual({
      nodes: [],
      edges: []
    });
  });

  it("should return selected node and edge", () => {
    const selected = filterSelectedItems(
      GraphModel.fromJSON({
        edges: makeEdges([
          [GraphEdgeState.connectedToSelected | GraphEdgeState.selected, ["0", "0"], ["1", "1"]],
          [GraphEdgeState.unconnectedToSelected, ["0", "1"], ["2", "0"]]
        ]),
        nodes: makeNodes(
          [GraphNodeState.connectedToSelected, GraphNodeState.selected, GraphNodeState.unconnectedToSelected],
          makePorts([GraphPortState.default, GraphPortState.default, GraphPortState.default])
        )
      })
    );
    expect(selected.nodes.length).toBe(1);
    expect(selected.nodes[0].id).toBe("1");
    expect(selected.edges.length).toBe(1);
    expect(selected.edges[0].id).toBe("0");
  });

  it("should return selected node and edge with both side selected", () => {
    const selected = filterSelectedItems(
      GraphModel.fromJSON({
        edges: makeEdges([
          [GraphEdgeState.connectedToSelected, ["0", "0"], ["1", "1"]],
          [GraphEdgeState.connectedToSelected, ["0", "1"], ["2", "0"]]
        ]),
        nodes: makeNodes(
          [GraphNodeState.selected, GraphNodeState.selected, GraphNodeState.connectedToSelected],
          makePorts([GraphPortState.default, GraphPortState.default, GraphPortState.default])
        )
      })
    );
    expect(selected.nodes.length).toBe(2);
    expect(selected.nodes[0].id).toBe("0");
    expect(selected.nodes[1].id).toBe("1");
    expect(selected.edges.length).toBe(1);
    expect(selected.edges[0].id).toBe("0");
  });
});

describe("test updateNodeBySelectBox", () => {
  const mockData = GraphModel.fromJSON({
    edges: [],
    nodes: [
      {
        id: "0",
        x: 50,
        y: 50,
        width: 50,
        height: 50,
        state: GraphNodeState.default
      },
      {
        id: "1",
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        state: GraphNodeState.default
      },
      {
        id: "2",
        x: 350,
        y: 350,
        width: 150,
        height: 150,
        state: GraphNodeState.default
      }
    ]
  });
  const zoomPanSettings: IZoomPanSettings = {
    transformMatrix: [1, 0, 0, 1, 0, 0]
  };
  const select = (selectBox: ISelectBoxPosition) => {
    return selectNodeBySelectBox(getGraphConfig(), zoomPanSettings.transformMatrix, selectBox, mockData).toJSON();
  };
  it("should select nothing", () => {
    expect(
      select({
        startX: 10,
        startY: 10,
        width: 10,
        height: 10
      })
    ).toEqual(mockData.toJSON());
    expect(
      select({
        startX: 160,
        startY: 160,
        width: 0,
        height: 10
      })
    ).toEqual(mockData.toJSON());
    expect(
      select({
        startX: 160,
        startY: 160,
        width: 10,
        height: 0
      })
    ).toEqual(mockData.toJSON());
  });

  it("should select covered nodes", () => {
    const expected = {
      edges: [],
      nodes: [
        {
          id: "0",
          x: 50,
          y: 50,
          width: 50,
          height: 50,
          state: GraphNodeState.unconnectedToSelected
        },
        {
          id: "1",
          x: 150,
          y: 150,
          width: 100,
          height: 100,
          state: GraphNodeState.selected
        },
        {
          id: "2",
          x: 350,
          y: 350,
          width: 150,
          height: 150,
          state: GraphNodeState.unconnectedToSelected
        }
      ]
    };
    expect(
      select({
        startX: 140,
        startY: 140,
        width: 20,
        height: 20
      })
    ).toEqual(expected);
    expect(
      select({
        startX: 140,
        startY: 160,
        width: 20,
        height: 20
      })
    ).toEqual(expected);
    expect(
      select({
        startX: 160,
        startY: 140,
        width: 20,
        height: 20
      })
    ).toEqual(expected);
    expect(
      select({
        startX: 160,
        startY: 160,
        width: 20,
        height: 20
      })
    ).toEqual(expected);
    expect(
      select({
        startX: 240,
        startY: 240,
        width: 20,
        height: 20
      })
    ).toEqual(expected);
  });
});

describe("test history", () => {
  it("should get empty history", () => {
    expect(resetUndoStack(0)).toEqual({
      present: 0,
      past: null,
      future: null
    });
  });

  it("should push past", () => {
    let stack = resetUndoStack(0);
    stack = pushHistory(stack, 1);
    expect(stack).toEqual({
      present: 1,
      past: {
        value: 0,
        next: null
      },
      future: null
    });
    stack = pushHistory(stack, 2);
    expect(stack).toEqual({
      present: 2,
      past: {
        value: 1,
        next: {
          value: 0,
          next: null
        }
      },
      future: null
    });
  });

  it("should push future", () => {
    let stack: IHistory<number> = {
      present: 2,
      past: {
        value: 1,
        next: {
          value: 0,
          next: null
        }
      },
      future: null
    };
    stack = undo(stack);
    expect(stack).toEqual({
      present: 1,
      past: {
        value: 0,
        next: null
      },
      future: {
        value: 2,
        next: null
      }
    });
  });

  it("should pop future", () => {
    let stack: IHistory<number> = {
      present: 1,
      past: {
        value: 0,
        next: null
      },
      future: {
        value: 2,
        next: null
      }
    };
    stack = redo(stack);
    expect(stack).toEqual({
      present: 2,
      past: {
        value: 1,
        next: {
          value: 0,
          next: null
        }
      },
      future: null
    });
  });

  it("should not pop past", () => {
    let stack: IHistory<number> = {
      present: 2,
      future: {
        value: 1,
        next: {
          value: 0,
          next: null
        }
      },
      past: null
    };
    stack = undo(stack);
    expect(stack).toEqual({
      present: 2,
      future: {
        value: 1,
        next: {
          value: 0,
          next: null
        }
      },
      past: null
    });
  });

  it("should not pop future", () => {
    let stack: IHistory<number> = {
      present: 2,
      past: {
        value: 1,
        next: {
          value: 0,
          next: null
        }
      },
      future: null
    };
    stack = redo(stack);
    expect(stack).toEqual({
      present: 2,
      past: {
        value: 1,
        next: {
          value: 0,
          next: null
        }
      },
      future: null
    });
  });
});
