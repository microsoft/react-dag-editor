import { GraphModel, IGraphConfig, NodeModel } from "../../src";
import { getNodeAndPortByPosition, getNodeConfig, getPortPosition } from "../../src/utils";
import { getGraphConfig } from "../utils";
import { getSample1Data } from "./__data__/getSample1Data";

describe("test getNodeAndPortByPosition", () => {
  let graphConfig: IGraphConfig;
  let data: GraphModel;
  let nodes: NodeModel[];
  beforeEach(() => {
    graphConfig = getGraphConfig();
    data = GraphModel.fromJSON(getSample1Data());
    nodes = Array.from(data.nodes.values());
  });

  it("test pointer and node, port no interaction", () => {
    const node = nodes[0];
    const pos: IPoint = {
      x: node.x - 10,
      y: node.y - 10
    };
    expect(getNodeAndPortByPosition(graphConfig, nodes, pos, 18)).toEqual({
      node: undefined,
      port: undefined
    });
  });

  it("test pointer and node interaction", () => {
    const node = nodes[0];
    const pos: IPoint = {
      x: node.x + 10,
      y: node.y + 10
    };
    expect(getNodeAndPortByPosition(graphConfig, nodes, pos, 18)).toEqual({
      node,
      port: undefined
    });
  });

  it("test pointer and port interaction", () => {
    const node = nodes[0];
    const nodeConfig = getNodeConfig(node, graphConfig);
    if (!node.ports) {
      return;
    }
    const port = node.ports[0];
    const pos = getPortPosition(node, port, nodeConfig);
    expect(getNodeAndPortByPosition(graphConfig, nodes, pos, 18)).toEqual({
      node,
      port
    });
  });

  it("test pointer and port no interaction", () => {
    const node = nodes[0];
    const nodeConfig = getNodeConfig(node, graphConfig);
    if (!node.ports) {
      return;
    }
    const port = node.ports[1];
    let pos = getPortPosition(node, port, nodeConfig);
    pos = {
      x: pos.x + 20,
      y: pos.y + 20
    };
    expect(getNodeAndPortByPosition(graphConfig, nodes, pos, 18)).toEqual({
      node: undefined,
      port: undefined
    });
  });
});
