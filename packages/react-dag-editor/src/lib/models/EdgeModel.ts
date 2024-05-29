import { $Complete } from "../utils/complete";
import { preventSpread } from "../utils/preventSpread";
import { ICanvasEdge } from "./edge";
import { GraphEdgeStatus, updateStatus } from "./status";

export class EdgeModel<T = unknown> implements $Complete<ICanvasEdge> {
  public readonly inner: ICanvasEdge<T>;

  public get id(): string {
    return this.inner.id;
  }

  public get automationId(): string | undefined {
    return this.inner.automationId;
  }

  public get source(): string {
    return this.inner.source;
  }

  public get target(): string {
    return this.inner.target;
  }

  public get sourcePortId(): string {
    return this.inner.sourcePortId;
  }

  public get targetPortId(): string {
    return this.inner.targetPortId;
  }

  public get status(): GraphEdgeStatus | undefined {
    return this.inner.status;
  }

  public get data(): Readonly<T> | undefined {
    return this.inner.data;
  }

  private constructor(edge: ICanvasEdge<T>) {
    this.inner = edge;
    preventSpread(this);
  }

  public static fromJSON<D>(inner: ICanvasEdge<D>): EdgeModel<D> {
    return new EdgeModel(inner);
  }

  public updateStatus(f: (state: number | undefined) => number): EdgeModel<T> {
    return this.update(updateStatus(f));
  }

  public update(f: (curEdge: ICanvasEdge<T>) => ICanvasEdge<T>): EdgeModel<T> {
    const edge = f(this.inner);
    return edge === this.inner ? this : new EdgeModel(edge);
  }

  /**
   * shallow copy the model
   * example usage: mark the edge is dirty and need a re-render
   *
   * @returns shallowed edge model
   */
  public shallow(): EdgeModel<T> {
    return new EdgeModel(this.inner);
  }

  public toJSON(): ICanvasEdge<T> {
    return this.inner;
  }
}
