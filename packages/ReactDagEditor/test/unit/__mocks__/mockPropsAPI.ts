import { GraphFeatures, ICanvasData, IPropsAPI } from "../../../src";

export const mockPropsAPI: IPropsAPI = ({
  addNode: () => true,
  getZoomPanSettings: () => ({ transformMatrix: [1, 0, 0, 1, 0, 0] }),
  getGraphSvgRef: () => ({
    current: {
      closest: () => ({
        getBoundingClientRect: () => ({
          left: 100,
          top: 100,
          width: 800,
          height: 800
        })
      }),
      focus: () => ({})
    }
  }),
  getData(): ICanvasData {
    return ({} as unknown) as ICanvasData;
  },
  getEnabledFeatures(): Set<GraphFeatures> {
    return new Set<GraphFeatures>();
  }
} as unknown) as IPropsAPI;
