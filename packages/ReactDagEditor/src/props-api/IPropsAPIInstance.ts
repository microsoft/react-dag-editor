import * as React from "react";
import { IContainerRect } from "../models/geometry";
import { IGraphState } from "../models/state";
import { EventChannel } from "../utils/eventChannel";
import { IGraphConfig, IPanelContext } from "../contexts";
import { EMPTY_GRAPH_STATE, IDispatch } from "../contexts/GraphStateContext";
import { GraphFeatures } from "../Features";
import { GraphModel } from "../models/GraphModel";
import { noop } from "../utils/noop";

export interface IPropsAPIInstance<NodeData, EdgeData, PortData> {
  state: IGraphState;
  enabledFeatures: Set<GraphFeatures>;
  dispatch: IDispatch;
  svgRef: React.RefObject<SVGSVGElement>;
  graphConfig?: IGraphConfig;
  panelContext?: IPanelContext;
  containerRectRef: React.RefObject<IContainerRect | undefined>;
  graphId: string;
  eventChannel: EventChannel;
  getData(): GraphModel<NodeData, EdgeData, PortData>;
}

export const noopInstance: IPropsAPIInstance<unknown, unknown, unknown> = new Proxy(
  {
    state: EMPTY_GRAPH_STATE,
    enabledFeatures: new Set(),
    dispatch: noop,
    svgRef: React.createRef(),
    graphConfig: undefined,
    panelContext: undefined,
    containerRectRef: React.createRef<IContainerRect>(),
    graphId: "",
    eventChannel: new EventChannel(),
    getData(): GraphModel {
      return GraphModel.empty();
    }
  },
  {
    get: (target, prop) => {
      // eslint-disable-next-line no-console
      console.warn(
        "You are using propsAPI without Graph component rendered. It could result in some unexpected behavior"
      );

      return target[prop];
    }
  }
);
