/* eslint-disable no-plusplus */
import ElkConstructor, { ElkExtendedEdge, ElkNode, LayoutOptions } from "elkjs/lib/elk-api";
import type { IGraphConfig } from "../models/config/types";
import type { GraphModel } from "../models/GraphModel";
import type { ICanvasNode } from "../models/node";
import type { ICanvasPort } from "../models/port";
import { getPortPositionByPortId } from "../utils/getPortPosition";
import { getNodeSize } from "../utils/layout";

export interface IAutoLayout {
  nodeLayoutOptions?: LayoutOptions;
  globalLayoutOption?: LayoutOptions;
  portRadius?: number;
  workerFactory?(): Worker;
}
interface IAutoLayoutProps<NodeData, EdgeData, PortData> extends IAutoLayout {
  graphConfig: IGraphConfig;
  data: GraphModel<NodeData, EdgeData, PortData>;
}

const defaultNodeLayoutOption: LayoutOptions = {
  "elk.portConstraints": "FIXED_ORDER"
};
const defaultGlobalLayoutOption: LayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.edgeRouting": "SPLINES",
  "elk.spacing.nodeNode": "50",
  "elk.layered.spacing.nodeNodeBetweenLayers": "50"
};

const defaultWorkerFactory = (): Worker => {
  return new Worker("elkjs/lib/elk-worker.js", {
    type: "module",
    name: "elk-worker" // add name to combine same elk-worker.js bundle
  });
};

type Direction = "DOWN" | "UP" | "RIGHT" | "LEFT";
type Side = "NORTH" | "SOUTH" | "EAST" | "WEST";

const isWithinRange = (lower: number, upper: number, target: number): boolean => {
  return target > lower && target < upper;
};

const getPortSideAndType = (
  graphConfig: IGraphConfig,
  direction: Direction,
  node: ICanvasNode,
  port: ICanvasPort
): { side?: Side; isOutput?: boolean } => {
  const threshold = 20; // threshold test port on same border
  const pos = getPortPositionByPortId(node, port.id, graphConfig);
  if (!pos) {
    return {};
  }

  let side: Side;
  let isOutput: boolean;

  if (direction === "DOWN" || direction === "UP") {
    // cook vertical
    if (isWithinRange(node.y - threshold, node.y + threshold, pos.y)) {
      side = "NORTH";
      isOutput = direction === "UP";
    } else {
      side = "SOUTH";
      isOutput = direction !== "UP";
    }
  } else {
    // cook horizontal
    if (isWithinRange(node.x - threshold, node.x + threshold, pos.x)) {
      side = "WEST";
      isOutput = direction === "LEFT";
    } else {
      side = "EAST";
      isOutput = direction !== "LEFT";
    }
  }
  return {
    side,
    isOutput
  };
};

/**
 * @param props
 */
export async function autoLayout<NodeData, EdgeData, PortData>(
  props: IAutoLayoutProps<NodeData, EdgeData, PortData>
): Promise<GraphModel<NodeData, EdgeData, PortData>> {
  const { graphConfig, data, portRadius = 18, workerFactory = defaultWorkerFactory } = props;

  let { nodeLayoutOptions = {}, globalLayoutOption = {} } = props;

  nodeLayoutOptions = {
    ...defaultNodeLayoutOption,
    ...nodeLayoutOptions
  };

  globalLayoutOption = {
    ...defaultGlobalLayoutOption,
    ...globalLayoutOption
  };

  const elk = new ElkConstructor({ workerFactory });

  const children: ElkNode[] = [];
  data.nodes.forEach(node => {
    let minPortIndex = 0;
    let maxPortIndex = node.ports && node.ports.length ? node.ports.length - 1 : 0;

    const { width, height } = getNodeSize(node, graphConfig);
    children.push({
      id: node.id,
      width,
      height,
      ports:
        node.ports &&
        node.ports.map(port => {
          const { side, isOutput } = getPortSideAndType(
            graphConfig,
            globalLayoutOption["elk.direction"] as Direction,
            node,
            port
          );

          const layoutOptions: LayoutOptions = side
            ? {
                "elk.port.side": side,
                "elk.port.index": isOutput ? (maxPortIndex--).toString() : (minPortIndex++).toString()
              }
            : {};
          return {
            id: `${node.id}:${port.id}`,
            width: portRadius * 2,
            height: portRadius * 2,
            layoutOptions
          };
        }),
      layoutOptions: nodeLayoutOptions
    });
  });

  const elkEdges: ElkExtendedEdge[] = [];
  data.edges.forEach(edge => {
    elkEdges.push({
      id: `edge_${edge.id}`,
      sources: [`${edge.source}:${edge.sourcePortId}`],
      targets: [`${edge.target}:${edge.targetPortId}`],
      sections: []
    });
  });
  const elkGraph: ElkNode = {
    id: "root",
    children,
    edges: elkEdges,
    layoutOptions: globalLayoutOption
  };

  const layout = await elk.layout(elkGraph);

  let nextData = data;
  layout.children?.forEach(it => {
    nextData = nextData.updateNode(it.id, prev => ({
      ...prev,
      x: (it.x || 0) + 200,
      y: (it.y || 0) + 100
    }));
  });

  return nextData;
}
