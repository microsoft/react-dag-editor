import * as React from "react";
import { IGraphConfig } from "../contexts";
import { GraphModel } from "../models/GraphModel";
import { NodeModel } from "../models/NodeModel";
import { IContainerRect, ITransformMatrix, IViewport } from "../models/viewport";
import { IPoint } from "./geometric";
import { identical } from "./identical";
import { getNodeSize } from "./layout";
import { getVisibleNodes } from "./viewPort";

export type TTransformMatrix = ITransformMatrix;

export enum ZoomDirection {
  X,
  Y,
  /**
   * zoom to fit in the X and Y directions, maybe the scaleX and the scaleY will different
   */
  XY
}

export interface IZoomFixPublicOption {
  /**
   * container rectangle
   */
  rect?: IContainerRect | null;
  /**
   * zoom vertical
   */
  direction?: ZoomDirection;
  /**
   * margin of the graph in the canvas, default is 60px
   */
  marginGraph?: number;
  /**
   * is disable pan when zoom
   */
  disablePan?: boolean;
  nodeMinVisibleWidth?: number;
  nodeMinVisibleHeight?: number;
  nodeMaxVisibleWidth?: number;
  nodeMaxVisibleHeight?: number;
}

export interface IZoomFixMatrix extends IZoomFixPublicOption {
  data: GraphModel;
  graphConfig: IGraphConfig;
}

export interface IZoomToFit extends IZoomFixMatrix {}

export type IZoomPanSettings = Pick<IViewport, "transformMatrix">;

type Action = (zoomPanSettings: IViewport) => IViewport;

/**
 * zoom to [scale]
 *
 * @param scale the scale to zoom to
 * @param anchor this client point is not moved after zoom
 * @param direction X: zoom horizontal, Y: zoom vertical
 *
 * @returns GraphAction the GraphAction for zooming
 */
export const zoomTo = (scale: number, anchor: IPoint | undefined, direction?: ZoomDirection): Action => {
  // istanbul ignore next
  if (!anchor) {
    return identical;
  }

  return prevState => {
    const scaleX = scale / prevState.transformMatrix[0];
    const scaleY = scale / prevState.transformMatrix[3];
    const { x, y } = anchor;
    const dx = x * (1 - scaleX);
    const dy = y * (1 - scaleY);

    const transformMatrix: TTransformMatrix =
      direction === ZoomDirection.X
        ? [
            scale,
            0,
            0,
            prevState.transformMatrix[3],
            prevState.transformMatrix[4] * scaleX + dx,
            prevState.transformMatrix[5]
          ]
        : direction === ZoomDirection.Y
        ? [
            prevState.transformMatrix[0],
            0,
            0,
            scale,
            prevState.transformMatrix[4],
            prevState.transformMatrix[5] * scaleY + dy
          ]
        : [scale, 0, 0, scale, prevState.transformMatrix[4] * scaleX + dx, prevState.transformMatrix[5] * scaleY + dy];

    return {
      ...prevState,
      transformMatrix
    };
  };
};

export type TZoomSideEffect = (options: { scale: number }) => void;

export const zoom = (
  scale: number,
  anchor: IPoint | undefined,
  sideEffect?: TZoomSideEffect,
  direction?: ZoomDirection
): Action => {
  if (scale === 1 || !anchor) {
    return identical;
  }

  const { x, y } = anchor;
  const dx = x * (1 - scale);
  const dy = y * (1 - scale);

  return prevState => {
    const transformMatrix: TTransformMatrix =
      direction === ZoomDirection.X
        ? [
            prevState.transformMatrix[0] * scale,
            prevState.transformMatrix[1],
            prevState.transformMatrix[2],
            prevState.transformMatrix[3],
            prevState.transformMatrix[4] * scale + dx,
            prevState.transformMatrix[5]
          ]
        : direction === ZoomDirection.Y
        ? [
            prevState.transformMatrix[0],
            prevState.transformMatrix[1],
            prevState.transformMatrix[2],
            prevState.transformMatrix[3] * scale,
            prevState.transformMatrix[4],
            prevState.transformMatrix[5] * scale + dy
          ]
        : [
            prevState.transformMatrix[0] * scale,
            prevState.transformMatrix[1] * scale,
            prevState.transformMatrix[2] * scale,
            prevState.transformMatrix[3] * scale,
            prevState.transformMatrix[4] * scale + dx,
            prevState.transformMatrix[5] * scale + dy
          ];
    sideEffect?.({ scale });
    return {
      ...prevState,
      transformMatrix
    };
  };
};

export const pan = (dx: number, dy: number): Action => {
  if (dx === 0 && dy === 0) {
    return identical;
  }
  return prevState => {
    return {
      ...prevState,
      transformMatrix: [
        prevState.transformMatrix[0],
        prevState.transformMatrix[1],
        prevState.transformMatrix[2],
        prevState.transformMatrix[3],
        prevState.transformMatrix[4] + dx,
        prevState.transformMatrix[5] + dy
      ]
    };
  };
};

export const minimapPan = (dx: number, dy: number): Action => {
  if (dx === 0 && dy === 0) {
    return identical;
  }
  return prevState => {
    const [a, b, c, d] = prevState.transformMatrix;
    return {
      ...prevState,
      transformMatrix: [
        a,
        b,
        c,
        d,
        prevState.transformMatrix[4] + a * dx + b * dy,
        prevState.transformMatrix[5] + c * dx + d * dy
      ]
    };
  };
};

export const getContentArea = (data: GraphModel, graphConfig: IGraphConfig, nodeIds?: Set<string>) => {
  let minNodeWidth = Infinity;
  let minNodeHeight = Infinity;
  let minNodeX = Infinity;
  let minNodeY = Infinity;
  let maxNodeX = -Infinity;
  let maxNodeY = -Infinity;

  type Fn = (node: NodeModel) => void;

  const forEachNode = (fn: Fn) => data.nodes.forEach(fn);
  const forEachByIds = (fn: Fn) =>
    nodeIds?.forEach(id => {
      const node = data.nodes.get(id);
      if (node) {
        fn(node);
      }
    });

  const forEach = nodeIds === undefined ? forEachNode : forEachByIds;

  forEach(node => {
    const { width: nodeWidth, height: nodeHeight } = getNodeSize(node, graphConfig);

    if (node.x < minNodeX) {
      minNodeX = node.x;
    }
    if (node.y < minNodeY) {
      minNodeY = node.y;
    }
    if (node.x + nodeWidth > maxNodeX) {
      maxNodeX = node.x + nodeWidth;
    }
    if (node.y + nodeHeight > maxNodeY) {
      maxNodeY = node.y + nodeHeight;
    }
    if (nodeWidth < minNodeWidth) {
      minNodeWidth = nodeWidth;
    }
    if (nodeHeight < minNodeHeight) {
      minNodeHeight = nodeHeight;
    }
  });

  return {
    minNodeWidth,
    minNodeHeight,
    minNodeX,
    minNodeY,
    maxNodeX,
    maxNodeY
  };
};

const normalizeNodeVisibleMinMax = (args: IZoomFixMatrix) => {
  let {
    nodeMinVisibleWidth = 0,
    nodeMinVisibleHeight = 0,
    nodeMaxVisibleWidth = 500,
    nodeMaxVisibleHeight = 500
  } = args;
  if (nodeMinVisibleWidth > nodeMaxVisibleWidth) {
    const temp = nodeMinVisibleWidth;
    nodeMinVisibleWidth = nodeMaxVisibleWidth;
    nodeMaxVisibleWidth = temp;
  }
  if (nodeMinVisibleHeight > nodeMaxVisibleHeight) {
    const temp = nodeMinVisibleHeight;
    nodeMinVisibleHeight = nodeMaxVisibleHeight;
    nodeMaxVisibleHeight = temp;
  }
  return {
    nodeMinVisibleWidth,
    nodeMinVisibleHeight,
    nodeMaxVisibleWidth,
    nodeMaxVisibleHeight
  };
};

export const getZoomFitMatrix = (args: IZoomFixMatrix): TTransformMatrix => {
  const { data, graphConfig, disablePan, rect, direction, marginGraph = 60 } = args;

  const { nodes } = data;

  // istanbul ignore next
  if (nodes.size === 0 || !rect) {
    return [1, 0, 0, 1, 0, 0];
  }

  const { height, width } = rect;

  if (!height || !width) {
    return [1, 0, 0, 1, 0, 0];
  }

  const { minNodeWidth, minNodeHeight, minNodeX, minNodeY, maxNodeX, maxNodeY } = getContentArea(data, graphConfig);

  const {
    nodeMinVisibleWidth,
    nodeMinVisibleHeight,
    nodeMaxVisibleWidth,
    nodeMaxVisibleHeight
  } = normalizeNodeVisibleMinMax(args);

  let minScaleX = 0;
  let minScaleY = 0;
  let maxScaleX = Infinity;
  let maxScaleY = Infinity;
  if (minNodeWidth) {
    minScaleX = nodeMinVisibleWidth / minNodeWidth;
    maxScaleX = nodeMaxVisibleWidth / minNodeWidth;
  }
  if (minNodeHeight) {
    minScaleY = nodeMinVisibleHeight / minNodeHeight;
    maxScaleY = nodeMaxVisibleHeight / minNodeHeight;
  }

  const scaleX = width / (maxNodeX - minNodeX + marginGraph * 2);
  const scaleY = height / (maxNodeY - minNodeY + marginGraph * 2);

  const scaleCommon =
    direction === ZoomDirection.Y
      ? Math.min(Math.max(minScaleX, minScaleY, scaleY), maxScaleX, maxScaleY)
      : Math.min(Math.max(minScaleX, minScaleY, Math.min(scaleX, scaleY)), maxScaleY, maxScaleY);

  const newScaleX = direction === ZoomDirection.XY ? Math.min(Math.max(minScaleX, scaleX), maxScaleX) : scaleCommon;
  const newScaleY = direction === ZoomDirection.XY ? Math.min(Math.max(minScaleY, scaleY), maxScaleY) : scaleCommon;

  if (disablePan) {
    return [newScaleX, 0, 0, newScaleY, 0, 0];
  }

  const dx = -newScaleX * (minNodeX - marginGraph);
  const dy = -newScaleY * (minNodeY - marginGraph);

  const visibleNodes = getVisibleNodes(
    data.nodes,
    {
      transformMatrix: [newScaleX, 0, 0, newScaleY, dx, dy],
      rect,
      visibleRect: rect
    },
    graphConfig
  );

  if (visibleNodes.length > 0) {
    return [newScaleX, 0, 0, newScaleY, dx, dy];
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let focusNode = data.nodes.first()!;
  if (focusNode) {
    data.nodes.forEach(node => {
      if (focusNode.y > node.y) {
        focusNode = node;
      }
    });
  }

  return [
    newScaleX,
    0,
    0,
    newScaleY,
    -newScaleX * (focusNode.x - marginGraph),
    -newScaleY * (focusNode.y - marginGraph)
  ];
};

// istanbul ignore next
export const zoomToFit = (args: IZoomToFit): [{ scaleX: number; scaleY: number }, Action] => {
  const transformMatrix = getZoomFitMatrix(args);

  return [
    {
      scaleX: transformMatrix?.[0],
      scaleY: transformMatrix?.[3]
    },
    prevState => {
      return {
        ...prevState,
        transformMatrix
      };
    }
  ];
};

export const focusArea = (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  viewPort: Required<IViewport>
): IViewport => {
  const width = maxX - minX;
  const height = maxY - minY;

  const scale = Math.min(viewPort.visibleRect.width / width, viewPort.visibleRect.height / height);

  const dx = -scale * (minX + width / 2) + viewPort.rect.width / 2;
  const dy = -scale * (minY + height / 2) + viewPort.rect.height / 2;

  return {
    ...viewPort,
    transformMatrix: [scale, 0, 0, scale, dx, dy]
  };
};

export const getContainer = (svgRef: React.RefObject<SVGSVGElement>) =>
  svgRef.current?.closest<HTMLDivElement>(".react-flow-editor-container");

/**
 * @param rectRef
 */
export function getContainerCenter(rectRef: React.RefObject<IContainerRect | undefined>): IPoint | undefined {
  const rect = rectRef.current;
  if (!rect) {
    return undefined;
  }
  const x = rect.width / 2;
  const y = rect.height / 2;
  return {
    x,
    y
  };
}

/**
 * @param rect
 * @param e
 */
export function getRelativePoint(rect: IContainerRect | undefined | null, e: MouseEvent): IPoint | undefined {
  if (!rect) {
    return undefined;
  }
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return {
    x,
    y
  };
}

// scroll the (x,y) to the center of the viewport, or to the specific position if provide
export const scrollIntoView = (
  x: number,
  y: number,
  rect: IContainerRect | undefined | null,
  alwaysScroll?: boolean,
  position?: IPoint
): Action => {
  // istanbul ignore next
  if (!rect) {
    return identical;
  }
  const { width, height } = rect;
  const shouldScroll = x < 0 || x > width || y < 0 || y > height;

  if (!shouldScroll && !alwaysScroll) {
    return identical;
  }

  return prevState => {
    const dx = position ? position.x - x : width / 2 - x;
    const dy = position ? position.y - y : height / 2 - y;

    return {
      ...prevState,
      transformMatrix: [
        prevState.transformMatrix[0],
        prevState.transformMatrix[1],
        prevState.transformMatrix[2],
        prevState.transformMatrix[3],
        prevState.transformMatrix[4] + dx,
        prevState.transformMatrix[5] + dy
      ]
    };
  };
};
