import { GraphBehavior } from "../contexts/GraphStateContext";
import { GraphFeatures } from "../Features";
import { IPoint } from "./geometric";

/**
 * event handlers must get/set GraphBehavior immediately
 * to determine how to treat event objects (eg. preventDefault)
 * but dispatch/setState can be asynchronous
 * thus GraphBehavior is mirros here
 * @see graphController, FakeBehaviorController
 */
class GraphController {
  /**
   * since we don't have a detailed specification for touch handling
   * temporarily store the pointerId here for most single point events
   */
  public pointerId: number | null = null;
  /**
   * simulate canvas click event once
   */
  public canvasClickOnce = false;
  private mouseClientPoint?: IPoint;
  private enabledFeatures: Set<GraphFeatures>;
  private behavior = GraphBehavior.default;

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

export const graphController = new GraphController();
