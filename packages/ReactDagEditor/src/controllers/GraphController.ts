import { IDispatch } from "../contexts";
import { GraphFeatures } from "../Features";
import { IPoint } from "../models/geometry";
import { GraphModel } from "../models/GraphModel";
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
  public dispatchDelegate: IDispatch;
  public getGlobalEventTargetImpl?: () => Window | Element | null | undefined;
  private mouseClientPoint?: IPoint;
  private behavior = GraphBehavior.default;

  public constructor(state: IGraphState, dispatch: IDispatch) {
    this.state = state;
    this.UNSAFE_latestState = state;
    this.dispatch = dispatch;
  }

  public readonly dispatch: IDispatch = (action, callback) => {
    this.dispatchDelegate(action, callback);
  };

  public setMouseClientPosition(pos: IPoint): void {
    this.mouseClientPoint = pos;
  }

  public unsetMouseClientPosition(): void {
    this.mouseClientPoint = undefined;
  }

  public getMouseClientPosition(): IPoint | undefined {
    return this.mouseClientPoint;
  }

  public getEnabledFeatures(): ReadonlySet<GraphFeatures> {
    return this.state.settings.features;
  }

  public getBehavior(): GraphBehavior {
    return this.behavior;
  }

  public setBehavior(value: GraphBehavior): void {
    this.behavior = value;
  }

  public getData(): GraphModel {
    return this.state.data.present;
  }

  public getGlobalEventTarget(): Element | Window {
    return this.getGlobalEventTargetImpl?.() ?? window;
  }
}
