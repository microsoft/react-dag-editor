import { IDispatch } from "../contexts";
import { GraphFeatures } from "../Features";
import { IPoint } from "../models/geometry";
import { NodeModel } from "../models/NodeModel";
import { GraphBehavior, IGraphState } from "../models/state";
import { EventChannel } from "../utils/eventChannel";

/**
 * event handlers must get/set GraphBehavior immediately
 * to determine how to treat event objects (eg. preventDefault)
 * but dispatch/setState can be asynchronous
 * thus GraphBehavior is mirrored here
 */
export class GraphController {
  /**
   * since we don't have a detailed specification for touch handling
   * temporarily store the pointerId here for most single point events
   */
  public pointerId: number | null = null;
  /**
   * simulate canvas click event once
   */
  public canvasClickOnce = false;
  public nodeClickOnce: NodeModel | null = null;
  public readonly eventChannel = new EventChannel();
  public state: IGraphState;
  public UNSAFE_latestState: IGraphState;
  public readonly dispatch: IDispatch;
  private mouseClientPoint?: IPoint;
  private enabledFeatures: Set<GraphFeatures>;
  private behavior = GraphBehavior.default;

  public constructor(state: IGraphState, dispatch: IDispatch) {
    this.state = state;
    this.UNSAFE_latestState = state;
    this.dispatch = dispatch;
  }

  public setMouseClientPosition(pos: IPoint): void {
    this.mouseClientPoint = pos;
  }

  public unsetMouseClientPosition(): void {
    this.mouseClientPoint = undefined;
  }

  public getMouseClientPosition(): IPoint | undefined {
    return this.mouseClientPoint;
  }

  public setEnabledFeatures(features: Set<GraphFeatures>): void {
    this.enabledFeatures = new Set(features);
  }

  public getEnabledFeatures(): Set<GraphFeatures> {
    return this.enabledFeatures;
  }

  public getBehavior(): GraphBehavior {
    return this.behavior;
  }

  public setBehavior(value: GraphBehavior): void {
    this.behavior = value;
  }
}
