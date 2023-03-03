import { ICanvasEdge } from "./edge";
import { IGap } from "./geometry";
import { ICanvasNode } from "./node";

export interface ICanvasGroup {
  id: string;
  name: string;
  nodeIds: string[];
  padding?: IGap;
  fill?: string;
  stroke?: string;
}

export interface ICanvasData<
  NodeData = unknown,
  EdgeData = unknown,
  PortData = unknown
> {
  readonly nodes: ReadonlyArray<ICanvasNode<NodeData, PortData>>;
  readonly edges: ReadonlyArray<ICanvasEdge<EdgeData>>;
  readonly groups?: ICanvasGroup[];
}
