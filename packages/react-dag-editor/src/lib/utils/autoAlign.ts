import { v4 as uuid } from "uuid";
import type { ILine } from "../components/Line";
import type { IGraphConfig } from "../models/config/types";
import type { IDummyNode } from "../models/dummy-node";
import type { ICanvasNode } from "../models/node";
import { getNodeSize } from "./layout";

interface IClosestNodes {
  /**
   * the x or y coordinate to align
   */
  alignCoordinateValue?: number;
  /**
   * the nodes closest to the dragging node
   */
  closestNodes?: ICanvasNode[];
}

/**
 * get alignment lines
 * @param draggingNodes the dragging node(s)
 * @param nodes all nodes to find the alignment lines
 * @param graphConfig graphConfig of type IGraphConfig
 * @param threshold threshold to align, default is 2
 */
export const getAlignmentLines = (
  draggingNodes: IDummyNode[],
  nodes: readonly ICanvasNode[],
  graphConfig: IGraphConfig,
  threshold = 2
): ILine[] => {
  const dummyDraggingNodeHW = getDummyDraggingNode(draggingNodes);

  const closestNodes = getClosestNodes(
    dummyDraggingNodeHW,
    draggingNodes,
    nodes,
    graphConfig,
    threshold
  );

  return getLines(dummyDraggingNodeHW, closestNodes, draggingNodes.length);
};

/**
 * get the dx or dy to auto align/attach
 * @param alignmentLines all alignment lines
 * @param nodes the dragging dummy node(s)
 * @param graphConfig graphConfig of type IGraphConfig
 */
export const getAutoAlignDisplacement = (
  alignmentLines: readonly ILine[],
  nodes: readonly IDummyNode[],
  graphConfig: IGraphConfig,
  alignDirection: "x" | "y"
): number => {
  let min = Infinity;
  let res = 0;

  const nodeHW = getDummyDraggingNode(nodes);

  const widthOrHeight =
    alignDirection === "x" ? nodeHW.width || 0 : nodeHW.height || 0;

  alignmentLines.forEach((item) => {
    let alignLine: number;
    if (alignDirection === "x" && item.x1 === item.x2) {
      alignLine = item.x1;
    } else if (alignDirection === "y" && item.y1 === item.y2) {
      alignLine = item.y1;
    } else {
      return;
    }

    const distance1 = nodeHW[alignDirection] - alignLine;
    const distanceMiddle =
      nodeHW[alignDirection] + (widthOrHeight || 0) / 2 - alignLine;
    const distance2 = nodeHW[alignDirection] + (widthOrHeight || 0) - alignLine;

    if (Math.abs(distance1) < min) {
      min = Math.abs(distance1);
      res = distance1 > 0 ? -min : min;
    }
    if (Math.abs(distanceMiddle) < min) {
      min = Math.abs(distanceMiddle);
      res = distanceMiddle > 0 ? -min : min;
    }
    if (Math.abs(distance2) < min) {
      min = Math.abs(distance2);
      res = distance2 > 0 ? -min : min;
    }
  });

  return res;
};

/**
 * get min coordinate of nodes
 * @param nodes among these nodes to get the min coordinate
 * @param field "x"|"y"
 */
const getMinCoordinate = (
  nodes: ICanvasNode[],
  field: "x" | "y"
): number | undefined => {
  if (!nodes.length) {
    return undefined;
  }
  return Math.min(...nodes.map((n) => n[field]));
};

/**
 * get max coordinate of nodes
 * @param nodes among these nodes to get the max coordinate
 * @param field "x"|"y"
 */
const getMaxCoordinate = (
  nodes: ICanvasNode[],
  field: "x" | "y"
): number | undefined => {
  if (!nodes.length) {
    return undefined;
  }
  return Math.max(
    ...nodes.map(
      (n) => n[field] + (field === "y" ? n.height || 0 : n.width || 0)
    )
  );
};

/**
 * set height and width for a node, and return the new node
 * @param node the node to set height and width
 * @param graphConfig graphConfig of type IGraphConfig
 */
const setSizeForNode = (
  node: ICanvasNode,
  graphConfig: IGraphConfig
): ICanvasNode => {
  return {
    ...node,
    ...getNodeSize(node, graphConfig),
  };
};

/**
 * get the bounding box of the nodes
 * @param nodes the nodes to calculate the bounding box
 */
const getBoundingBoxOfNodes = (
  nodes: readonly IDummyNode[]
): {
  x: number;
  y: number;
  width: number;
  height: number;
} => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    const tempMinX = n.x;
    const tempMinY = n.y;
    const tempMaxX = n.x + (n.width || 0);
    const tempMaxY = n.y + (n.height || 0);
    if (tempMinX < minX) {
      minX = tempMinX;
    }
    if (tempMinY < minY) {
      minY = tempMinY;
    }
    if (tempMaxX > maxX) {
      maxX = tempMaxX;
    }
    if (tempMaxY > maxY) {
      maxY = tempMaxY;
    }
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

/**
 * get dummy dragging node constructed by all dragging nodes
 * @param draggingNodes all dragging nodes
 * @param graphConfig graphConfig of type IGraphConfig
 */
const getDummyDraggingNode = (draggingNodes: readonly IDummyNode[]) => {
  const { x, y, width, height } = getBoundingBoxOfNodes(draggingNodes);
  const dummyDraggingNode: IDummyNode = {
    id: uuid(),
    x,
    y,
    width,
    height,
  };
  return dummyDraggingNode;
};

/**
 * get the nodes closest to(within the threshold) the different sides of the dragging node(s)
 * @param dummyDraggingNode the dummy dragging node constructed by the dragging nodes
 * @param draggingNodes the dragging node(s)
 * @param nodes among these nodes to get the closest nodes
 * @param graphConfig graphConfig of type IGraphConfig
 * @param threshold threshold to align
 */
const getClosestNodes = (
  dummyDraggingNode: IDummyNode,
  draggingNodes: IDummyNode[],
  nodes: readonly ICanvasNode[],
  graphConfig: IGraphConfig,
  threshold = 2
): {
  closestX: IClosestNodes[];
  closestY: IClosestNodes[];
} => {
  const resX: IClosestNodes[] = []; // will has 3 items: the nodes closest to the "left side", "middle", "right side" (the order must follow this) of the dragging node
  const resY: IClosestNodes[] = []; // will has 3 items: the nodes closest to the "top", "middle", "bottom" (the order must follow this) of the dragging node

  const {
    x: draggingNodeX,
    y: draggingNodeY,
    width: draggingNodeWidth = 0,
    height: draggingNodeHeight = 0,
  } = dummyDraggingNode;

  let minDistanceX = threshold;
  let minDistanceY = threshold;

  nodes.forEach((node) => {
    if (draggingNodes.find((dn) => dn.id === node.id)) {
      return;
    }

    const nodeHW = setSizeForNode(node, graphConfig);
    const { width: nodeWidth = 0, height: nodeHeight = 0 } = nodeHW;

    // compare X coordinate of dragging node
    [
      draggingNodeX,
      draggingNodeX + draggingNodeWidth / 2,
      draggingNodeX + draggingNodeWidth,
    ].forEach((draggingNodeValue, alignPos) => {
      if (!resX[alignPos]) {
        resX[alignPos] = {};
      }
      if (!resX[alignPos].closestNodes) {
        resX[alignPos].closestNodes = [];
      }

      [nodeHW.x, nodeHW.x + nodeWidth / 2, nodeHW.x + nodeWidth].forEach(
        (comparedValue) => {
          const distance = Math.abs(draggingNodeValue - comparedValue);
          if (distance <= minDistanceX) {
            resX[alignPos].closestNodes?.push(nodeHW);
            resX[alignPos].alignCoordinateValue = comparedValue;

            minDistanceX = distance;
          }
        }
      );
    });

    // compare Y coordinate of dragging node
    [
      draggingNodeY,
      draggingNodeY + draggingNodeHeight / 2,
      draggingNodeY + draggingNodeHeight,
    ].forEach((draggingNodeValue, alignPos) => {
      if (!resY[alignPos]) {
        resY[alignPos] = {};
      }
      if (!resY[alignPos].closestNodes) {
        resY[alignPos].closestNodes = [];
      }

      [nodeHW.y, nodeHW.y + nodeHeight / 2, nodeHW.y + nodeHeight].forEach(
        (comparedValue) => {
          const distance = Math.abs(draggingNodeValue - comparedValue);
          if (distance <= minDistanceY) {
            resY[alignPos].closestNodes?.push(nodeHW);
            resY[alignPos].alignCoordinateValue = comparedValue;

            minDistanceY = distance;
          }
        }
      );
    });
  });
  return { closestX: resX, closestY: resY };
};

/**
 * get alignment lines
 * @param draggingNode the dragging node
 * @param closestNodes all closest nodes within the threshold
 */
const getLines = (
  draggingNode: ICanvasNode,
  closestNodes: {
    closestX: IClosestNodes[];
    closestY: IClosestNodes[];
  },
  numberOfDraggingNodes = 1
): ILine[] => {
  const xLines: ILine[] = [];
  const yLines: ILine[] = [];
  const closestXNodes = closestNodes.closestX;
  const closestYNodes = closestNodes.closestY;

  // vertical lines
  closestXNodes.forEach((item, alignPos) => {
    if (
      item.alignCoordinateValue === undefined ||
      // if it has the left alignment line for the dragging node OR has multi dragging nodes, will don't need middle alignment line
      (alignPos === 1 && (xLines.length || numberOfDraggingNodes > 1))
    ) {
      return;
    }

    const sameXNodes: ICanvasNode[] = [];
    const x = item.alignCoordinateValue;
    item.closestNodes?.forEach((node) => {
      if (
        node.x === x ||
        node.x + (node.width || 0) / 2 === x ||
        node.x + (node.width || 0) === x
      ) {
        sameXNodes.push(node);
      }
    });
    const y1 = getMinCoordinate([draggingNode, ...sameXNodes], "y");
    const y2 = getMaxCoordinate([draggingNode, ...sameXNodes], "y");
    if (y1 !== undefined && y2 !== undefined) {
      xLines.push({ x1: x, y1, x2: x, y2, visible: true });
    }
  });

  // horizontal lines
  closestYNodes.forEach((item, alignPos) => {
    if (
      item.alignCoordinateValue === undefined ||
      // if it has the top alignment line for the dragging node OR has multi dragging nodes, will don't need middle alignment line
      (alignPos === 1 && (yLines.length || numberOfDraggingNodes > 1))
    ) {
      return;
    }
    const sameYNodes: ICanvasNode[] = [];
    const y = item.alignCoordinateValue;

    item.closestNodes?.forEach((node) => {
      if (
        node.y === y ||
        node.y + (node.height || 0) / 2 === y ||
        node.y + (node.height || 0) === y
      ) {
        sameYNodes.push(node);
      }
    });
    const x1 = getMinCoordinate([draggingNode, ...sameYNodes], "x");
    const x2 = getMaxCoordinate([draggingNode, ...sameYNodes], "x");
    if (x1 !== undefined && x2 !== undefined) {
      yLines.push({ x1, y1: y, x2, y2: y, visible: true });
    }
  });
  return [...xLines, ...yLines];
};
