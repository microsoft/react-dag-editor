import * as React from "react";
import { applyDefaultPortsPosition, ICanvasEdge, ICanvasNode, ICanvasPort, IGetConnectableParams } from "../src";
import { GraphConfig, IGraphConfig, IItemConfigArgs, IPortDrawArgs } from "../src/contexts";

function makePort(id: string, state: number): ICanvasPort {
  return {
    id,
    position: [0, 0],
    name: id,
    state
  };
}

export function makePorts(list: number[]): ICanvasPort[] {
  return applyDefaultPortsPosition(list.map((state, index) => makePort(index.toString(), state)));
}

export function makeEdge(
  id: string,
  state: number,
  [source, sourcePortId]: [string, string],
  [target, targetPortId]: [string, string]
): ICanvasEdge {
  return {
    id,
    state,
    source,
    sourcePortId,
    target,
    targetPortId
  };
}

export function makeEdges(list: Array<[number, [string, string], [string, string]]>): ICanvasEdge[] {
  return list.map(([state, source, target], index) => makeEdge(index.toString(), state, source, target));
}

export function makeNode(id: string, state?: number, ports?: ICanvasPort[], x = 0, y = 0): ICanvasNode {
  return {
    x,
    y,
    id,
    state,
    ports
  };
}

export function makeNodes(stateList: number[], ports?: ICanvasPort[]): ICanvasNode[] {
  return stateList.map((state, index) => makeNode(index.toString(), state, ports));
}

export function makeNodesWithPosition(
  list: Array<{ state: number; x?: number; y?: number }>,
  ports?: ICanvasPort[]
): ICanvasNode[] {
  return list.map(({ state, x, y }, index) => makeNode(index.toString(), state, ports, x, y));
}

export function getGraphConfig(): IGraphConfig {
  const config = new GraphConfig(window);
  config.registerNode("default", {
    render(args: IItemConfigArgs<ICanvasNode>): React.ReactNode {
      return null;
    },
    getMinWidth(rect: ICanvasNode): number {
      return 280;
    },
    getMinHeight(rect: ICanvasNode): number {
      return 50;
    }
  });
  config.registerPort("default", {
    render(args: IPortDrawArgs): React.ReactNode {
      return null;
    },
    renderTooltips(args: Omit<IPortDrawArgs, "setData">): React.ReactNode {
      return null;
    },
    getIsConnectable({ model }: IGetConnectableParams): boolean | undefined {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (model.data as any)?.isConnectable;
    }
  });
  return config;
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

export const mockBoundingBox = () => {
  const old = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function(): DOMRect {
    return {
      ...old.call(this),
      x: 100,
      y: 100,
      width: 800,
      height: 600,
      top: 100,
      right: 900,
      bottom: 700,
      left: 100
    };
  };
  Element.prototype.releasePointerCapture = () => {
    // noop
  };
};
