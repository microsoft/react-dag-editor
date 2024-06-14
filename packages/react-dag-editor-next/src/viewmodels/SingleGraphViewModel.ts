import { GraphModel, IEvent, createGraphState, getGraphReducer } from "react-dag-editor";
import { ICanvasData, IGraphState } from "../types/core";

export class SingleGraphViewModel {
  private graphModel = GraphModel.empty<never, never, never>();

  public getData(): GraphModel<never, never, never> {
    return this.graphModel;
  }

  public setData(data: ICanvasData): SingleGraphViewModel {
    this.graphModel = GraphModel.fromJSON<never, never, never>(data);

    return this;
  }

  public dispatch(action: IEvent<never, never, never>): void {
    const prevState: IGraphState = createGraphState({
      data: this.graphModel,
    });

    const nextState = getGraphReducer<never, never, never>()(prevState, action);

    this.graphModel = nextState.data.present;
  }
}
