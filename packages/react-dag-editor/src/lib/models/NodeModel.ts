import { mapCow } from "../utils/array";
import type { $Complete } from "../utils/complete";
import { getPortPositionByPortId } from "../utils/getPortPosition";
import { preventSpread } from "../utils/preventSpread";
import type { IGraphConfig } from "./config/types";
import type { IPoint } from "./geometry";
import type { ICanvasNode } from "./node";
import type { ICanvasPort } from "./port";
import { GraphNodeStatus, updateStatus } from "./status";

export class NodeModel<NodeData = unknown, PortData = unknown>
  implements $Complete<ICanvasNode<NodeData, PortData>>
{
  public readonly inner: ICanvasNode<NodeData, PortData>;
  public readonly portPositionCache: Map<string, IPoint | undefined>;
  public readonly prev: string | undefined;
  public readonly next: string | undefined;

  public get id(): string {
    return this.inner.id;
  }

  public get status(): GraphNodeStatus | undefined {
    return this.inner.status;
  }

  public get shape(): string | undefined {
    return this.inner.shape;
  }

  public get ports(): ReadonlyArray<ICanvasPort<PortData>> | undefined {
    return this.inner.ports;
  }

  public get ariaLabel(): string | undefined {
    return this.inner.ariaLabel;
  }

  public get name(): string | undefined {
    return this.inner.name;
  }

  public get x(): number {
    return this.inner.x;
  }

  public get y(): number {
    return this.inner.y;
  }

  public get automationId(): string | undefined {
    return this.inner.automationId;
  }

  public get data(): Readonly<NodeData> | undefined {
    return this.inner.data;
  }

  public get height(): number | undefined {
    return this.inner.height;
  }

  public get width(): number | undefined {
    return this.inner.width;
  }

  private constructor(
    node: ICanvasNode<NodeData, PortData>,
    portPositionCache: Map<string, IPoint | undefined>,
    prev: string | undefined,
    next: string | undefined
  ) {
    this.inner = node;
    this.portPositionCache = portPositionCache;
    this.prev = prev;
    this.next = next;
    preventSpread(this);
  }

  public static fromJSON<N, P>(
    node: ICanvasNode<N, P>,
    prev: string | undefined,
    next: string | undefined
  ): NodeModel<N, P> {
    return new NodeModel(node, new Map(), prev, next);
  }

  public getPort(id: string): ICanvasPort<PortData> | undefined {
    return this.ports?.find((port) => port.id === id);
  }

  public link({
    prev,
    next,
  }: {
    prev?: string | undefined;
    next?: string | undefined;
  }): NodeModel<NodeData, PortData> {
    if (prev === this.prev && next === this.next) {
      return this;
    }
    return new NodeModel(
      this.inner,
      this.portPositionCache,
      prev ?? this.prev,
      next ?? this.next
    );
  }

  public updateStatus(
    f: (state: number | undefined) => number
  ): NodeModel<NodeData, PortData> {
    return this.update(updateStatus(f));
  }

  public update(
    f: (
      curNode: ICanvasNode<NodeData, PortData>
    ) => ICanvasNode<NodeData, PortData>
  ): NodeModel<NodeData, PortData> {
    const node = f(this.inner);
    return node === this.inner
      ? this
      : new NodeModel(node, new Map(), this.prev, this.next);
  }

  public updateData(
    f: (data: Readonly<NodeData>) => Readonly<NodeData>
  ): NodeModel<NodeData, PortData> {
    if (!this.data) {
      return this;
    }
    return this.update((inner) => {
      const data = f(inner.data as Readonly<NodeData>);
      if (data === inner.data) {
        return inner;
      }
      return {
        ...inner,
        data,
      };
    });
  }

  public getPortPosition(
    portId: string,
    graphConfig: IGraphConfig
  ): IPoint | undefined {
    let point = this.portPositionCache.get(portId);
    if (!point) {
      point = getPortPositionByPortId(this.inner, portId, graphConfig);
      this.portPositionCache.set(portId, point);
    }
    return point;
  }

  public hasPort(id: string): boolean {
    return Boolean(this.inner.ports?.find((port) => port.id === id));
  }

  /**
   * @internal
   */
  public updatePositionAndSize(
    dummy: ICanvasNode
  ): NodeModel<NodeData, PortData> {
    const { x, y, width, height } = dummy;
    const node = {
      ...this.inner,
      x,
      y,
      width: width ?? this.inner.width,
      height: height ?? this.inner.height,
    };
    return new NodeModel(node, new Map(), this.prev, this.next);
  }

  public updatePorts(
    f: (port: ICanvasPort<PortData>, index: number) => ICanvasPort<PortData>
  ): NodeModel<NodeData, PortData> {
    if (!this.inner.ports) {
      return this;
    }
    const ports = mapCow(this.inner.ports, f);
    const node =
      this.inner.ports === ports
        ? this.inner
        : {
            ...this.inner,
            ports,
          };
    return node === this.inner
      ? this
      : new NodeModel(node, new Map(), this.prev, this.next);
  }

  public invalidCache(): NodeModel<NodeData, PortData> {
    return new NodeModel(this.inner, new Map(), this.prev, this.next);
  }

  public toJSON(): ICanvasNode<NodeData, PortData> {
    return this.inner;
  }
}
