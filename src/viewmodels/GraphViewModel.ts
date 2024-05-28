import { GraphModel } from "../models/GraphModel";
import { ICanvasNode } from "../models/node";

export class GraphViewModel {
  private graphModel: GraphModel = GraphModel.empty();

  public get Nodes(): ICanvasNode[] {
    return this.graphModel.nodes;
  }
}
