import {
  Bitset,
  GraphEdgeStatus,
  GraphModel,
  GraphNodeStatus,
  GraphPortStatus,
  ICanvasNode,
  ICanvasPort,
  IGraphConfig,
  pan,
  updateStatus,
} from "../../index";
import { ISelectBoxPosition } from "../../lib/components/Graph/SelectBox";
import { selectNodeBySelectBox } from "../../lib/utils/updateNodeBySelectBox";
import {
  getGraphConfig,
  makeEdges,
  makeNodesWithPosition,
  makePorts,
} from "../utils";

describe("test updateNodeBySelectBox", () => {
  let graphConfig: IGraphConfig;
  let initNodes: ICanvasNode[];
  let ports: ICanvasPort[];
  const transformMatrix = [1, 0, 0, 1, 0, 0] as const;
  beforeEach(() => {
    graphConfig = getGraphConfig();
    ports = makePorts([
      GraphPortStatus.Default,
      GraphPortStatus.Default,
      GraphPortStatus.Default,
    ]);
    initNodes = makeNodesWithPosition(
      [
        {
          status: GraphNodeStatus.Default,
          x: 100,
          y: 100,
        },
        {
          status: GraphNodeStatus.Default,
          x: 160,
          y: 160,
        },
        {
          status: GraphNodeStatus.Default,
          x: 300,
          y: 300,
        },
      ],
      ports
    );
  });

  it("test empty selection box no interaction", () => {
    const selectBoxPosition: ISelectBoxPosition = {
      startX: 100,
      startY: 100,
      width: 100,
      height: 0,
    };

    const data = GraphModel.fromJSON({
      nodes: initNodes,
      edges: makeEdges([
        [GraphEdgeStatus.Default, ["0", "0"], ["1", "1"]],
        [GraphEdgeStatus.Default, ["0", "1"], ["2", "0"]],
      ]),
    });
    expect(
      selectNodeBySelectBox(
        graphConfig,
        transformMatrix,
        selectBoxPosition,
        data
      ).toJSON()
    ).toEqual(data.toJSON());
  });

  it("test select position (100,100) node", () => {
    const selectBoxPosition: ISelectBoxPosition = {
      startX: 100,
      startY: 100,
      width: 30,
      height: 10,
    };

    const data = GraphModel.fromJSON({
      nodes: initNodes,
      edges: makeEdges([
        [GraphEdgeStatus.Default, ["0", "0"], ["1", "1"]],
        [GraphEdgeStatus.Default, ["0", "1"], ["2", "0"]],
      ]),
    });

    const [firstNode, ...restNodes] = [...initNodes];
    const nodes = [
      updateStatus(Bitset.replace(GraphNodeStatus.Selected))(firstNode),
      ...restNodes.map(
        updateStatus(Bitset.replace(GraphNodeStatus.ConnectedToSelected))
      ),
    ];
    const nextData = {
      nodes,
      edges: data
        .toJSON()
        .edges.map(
          updateStatus(Bitset.replace(GraphEdgeStatus.ConnectedToSelected))
        ),
    };

    expect(
      selectNodeBySelectBox(
        graphConfig,
        transformMatrix,
        selectBoxPosition,
        data
      ).toJSON()
    ).toEqual(nextData);
  });

  it("test select position (100,100) node with pan", () => {
    const selectBoxPosition: ISelectBoxPosition = {
      startX: 50,
      startY: 50,
      width: 30,
      height: 10,
    };

    const data = GraphModel.fromJSON({
      nodes: initNodes,
      edges: makeEdges([
        [GraphEdgeStatus.Default, ["0", "0"], ["1", "1"]],
        [GraphEdgeStatus.Default, ["0", "1"], ["2", "0"]],
      ]),
    });

    const [firstNode, ...restNodes] = [...initNodes];
    const nodes = [
      updateStatus(Bitset.replace(GraphNodeStatus.Selected))(firstNode),
      ...restNodes.map(
        updateStatus(Bitset.replace(GraphNodeStatus.ConnectedToSelected))
      ),
    ];
    const nextData = {
      nodes,
      edges: data
        .toJSON()
        .edges.map(
          updateStatus(Bitset.replace(GraphEdgeStatus.ConnectedToSelected))
        ),
    };

    expect(
      selectNodeBySelectBox(
        graphConfig,
        pan(-22, -42)({ transformMatrix }).transformMatrix,
        selectBoxPosition,
        data
      ).toJSON()
    ).toEqual(nextData);
  });

  it("test select position (100,100) and (160, 160) nodes", () => {
    const selectBoxPosition: ISelectBoxPosition = {
      startX: 100,
      startY: 100,
      width: 70,
      height: 70,
    };

    const data = GraphModel.fromJSON({
      nodes: initNodes,
      edges: makeEdges([
        [GraphEdgeStatus.Default, ["0", "0"], ["1", "1"]],
        [GraphEdgeStatus.Default, ["0", "1"], ["2", "0"]],
      ]),
    });

    const [firstNode, secondNode, ...restNodes] = [...initNodes];
    const nodes = [
      updateStatus(Bitset.replace(GraphNodeStatus.Selected))(firstNode),
      updateStatus(Bitset.replace(GraphNodeStatus.Selected))(secondNode),
      ...restNodes.map(
        updateStatus(Bitset.replace(GraphNodeStatus.ConnectedToSelected))
      ),
    ];
    const nextData = {
      nodes,
      edges: data
        .toJSON()
        .edges.map(
          updateStatus(Bitset.replace(GraphEdgeStatus.ConnectedToSelected))
        ),
    };

    expect(
      selectNodeBySelectBox(
        graphConfig,
        transformMatrix,
        selectBoxPosition,
        data
      ).toJSON()
    ).toEqual(nextData);
  });

  it("test select position all nodes", () => {
    const selectBoxPosition: ISelectBoxPosition = {
      startX: 100,
      startY: 100,
      width: 300,
      height: 300,
    };

    const data = GraphModel.fromJSON({
      nodes: initNodes,
      edges: makeEdges([
        [GraphEdgeStatus.Default, ["0", "0"], ["1", "1"]],
        [GraphEdgeStatus.Default, ["0", "1"], ["2", "0"]],
      ]),
    });

    const nodes = initNodes.map(
      updateStatus(Bitset.replace(GraphNodeStatus.Selected))
    );
    const nextData = {
      nodes,
      edges: data
        .toJSON()
        .edges.map(
          updateStatus(Bitset.replace(GraphEdgeStatus.ConnectedToSelected))
        ),
    };

    expect(
      selectNodeBySelectBox(
        graphConfig,
        transformMatrix,
        selectBoxPosition,
        data
      ).toJSON()
    ).toEqual(nextData);
  });
});
