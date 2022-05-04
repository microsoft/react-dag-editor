import { ICanvasEdge, IEdgeModel } from "./edge";
import { IGap } from "./geometry";
import { ICanvasNode, INodeModel } from "./node";

export interface ICanvasGroup {
  id: string;
  name: string;
  nodeIds: string[];
  padding?: IGap;
  fill?: string;
  stroke?: string;
  shape?: string;
}

export interface ICanvasData {
  readonly nodes: ReadonlyArray<ICanvasNode | INodeModel>;
  readonly edges: ReadonlyArray<ICanvasEdge | IEdgeModel>;
  readonly groups?: ICanvasGroup[];
}
