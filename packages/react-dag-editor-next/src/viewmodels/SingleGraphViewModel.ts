import { GraphModel, ICanvasData, ICanvasEdge, ICanvasNode } from "react-dag-editor";

export class SingleGraphViewModel {
  private graphModel = GraphModel.empty();

  public setData(data: ICanvasData): SingleGraphViewModel {
    this.graphModel = GraphModel.fromJSON(data);

    return this;
  }
}
