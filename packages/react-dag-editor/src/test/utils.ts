import * as React from "react";
import {
  applyDefaultPortsPosition,
  GraphConfigBuilder,
  ICanvasEdge,
  ICanvasNode,
  ICanvasPort,
  IGetConnectableParams,
  IGraphConfig,
  INodeDrawArgs,
  IPortDrawArgs,
} from "../index";

function makePort(id: string, state: number): ICanvasPort {
  return {
    id,
    position: [0, 0],
    name: id,
    status: state,
  };
}

export function makePorts(list: number[]): ICanvasPort[] {
  return applyDefaultPortsPosition(list.map((state, index) => makePort(index.toString(), state)));
}

export function makeEdge(
  id: string,
  status: number,
  [source, sourcePortId]: [string, string],
  [target, targetPortId]: [string, string]
): ICanvasEdge {
  return {
    id,
    status,
    source,
    sourcePortId,
    target,
    targetPortId,
  };
}

export function makeEdges(list: Array<[number, [string, string], [string, string]]>): ICanvasEdge[] {
  return list.map(([state, source, target], index) => makeEdge(index.toString(), state, source, target));
}

export function makeNode(id: string, status?: number, ports?: ICanvasPort[], x = 0, y = 0): ICanvasNode {
  return {
    x,
    y,
    id,
    status,
    ports,
  };
}

export function makeNodes(stateList: number[], ports?: ICanvasPort[]): ICanvasNode[] {
  return stateList.map((state, index) => makeNode(index.toString(), state, ports));
}

export function makeNodesWithPosition(
  list: Array<{ status: number; x?: number; y?: number }>,
  ports?: ICanvasPort[]
): ICanvasNode[] {
  return list.map(({ status, x, y }, index) => makeNode(index.toString(), status, ports, x, y));
}

export function getGraphConfig(): IGraphConfig {
  return GraphConfigBuilder.default()
    .registerNode("default", {
      render(args: INodeDrawArgs): React.ReactNode {
        return null;
      },
      getMinWidth(rect: ICanvasNode): number {
        return 280;
      },
      getMinHeight(rect: ICanvasNode): number {
        return 50;
      },
    })
    .registerPort("default", {
      render(args: IPortDrawArgs): React.ReactNode {
        return null;
      },
      renderTooltips(args: Omit<IPortDrawArgs, "setData">): React.ReactNode {
        return null;
      },
      getIsConnectable({ model }: IGetConnectableParams): boolean | undefined {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (model.data as any)?.isConnectable;
      },
    })
    .build();
}

export const patchPointerEvent = () => {
  /**
   * cleanup this hack after jsdom supports pointer events
   */
  class PointerEvent extends MouseEvent {
    public readonly pointerId: number | undefined;
    public readonly pointerType: string | undefined;

    public constructor(type: string, init?: MouseEventInit & { pointerId: number; pointerType: string }) {
      super(type, init);
      this.pointerId = init?.pointerId;
      this.pointerType = init?.pointerType;
    }
  }
  // @ts-ignore
  // eslint-disable-next-line compat/compat
  window.PointerEvent = PointerEvent;
};

export const mockClientRect = {
  x: 100,
  y: 100,
  width: 800,
  height: 600,
  top: 100,
  right: 900,
  bottom: 700,
  left: 100,
};

export const mockBoundingBox = (rect = mockClientRect) => {
  const old = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function (): DOMRect {
    return {
      ...old.call(this),
      ...rect,
    };
  };
  Element.prototype.releasePointerCapture = () => {
    // noop
  };
};
