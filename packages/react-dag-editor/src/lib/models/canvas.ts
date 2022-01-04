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
  shape?: string;
}

export interface ICanvasData {
  readonly nodes: ReadonlyArray<ICanvasNode>;
  readonly edges: ReadonlyArray<ICanvasEdge>;
  readonly groups?: ICanvasGroup[];
}
