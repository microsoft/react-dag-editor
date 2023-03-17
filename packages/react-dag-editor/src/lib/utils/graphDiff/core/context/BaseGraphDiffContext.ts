import {
  GraphSource,
  IGraph,
  IGraphDiffContext,
  IGraphEdge,
  IGraphNode,
  IGraphNodeDiffResult,
  IGraphNodeWithStructure,
  IMapping,
} from "../types";
import { defaultBuildCandidateMapping } from "./defaultBuildCandidateMapping";
import { defaultCalcStructureDiffCost } from "./defaultCalcStructureDiffCost";

export interface IBaseGraphDiffContextProps<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> {
  lNodesMap: ReadonlyMap<string, IGraphNodeWithStructure<Node, Edge>>;
  rNodesMap: ReadonlyMap<string, IGraphNodeWithStructure<Node, Edge>>;
}

export abstract class BaseGraphDiffContext<
  Node extends IGraphNode,
  Edge extends IGraphEdge
> implements IGraphDiffContext<Node, Edge>
{
  public readonly ABOnlyCostThreshold: number = 100000;
  public readonly PropertyDiffCostRate: number = 0.2;
  public readonly StructureDiffCostRate: number = 1;

  protected readonly lNodesMap: ReadonlyMap<
    string,
    IGraphNodeWithStructure<Node, Edge>
  >;
  protected readonly rNodesMap: ReadonlyMap<
    string,
    IGraphNodeWithStructure<Node, Edge>
  >;

  public constructor(props: IBaseGraphDiffContextProps<Node, Edge>) {
    this.lNodesMap = props.lNodesMap;
    this.rNodesMap = props.rNodesMap;
  }

  public abstract areSameNodes(lNode: Node, rNode: Node): IGraphNodeDiffResult;

  public buildCandidateMapping(
    lGraph: IGraph<Node, Edge>,
    rGraph: IGraph<Node, Edge>
  ): IMapping<Node>[] {
    return defaultBuildCandidateMapping<Node, Edge>(lGraph, rGraph, this);
  }

  public calcStructureDiffCost(lNode: Node, rNode: Node): number {
    return defaultCalcStructureDiffCost<Node, Edge>(lNode, rNode, this);
  }

  public abstract calcPropertyDiffCost(lNode: Node, rNode: Node): number;

  public getGraphNodeWithStructure(
    nodeId: string,
    fromGraph: GraphSource
  ): IGraphNodeWithStructure<Node, Edge> | undefined {
    return fromGraph === GraphSource.A
      ? this.lNodesMap.get(nodeId)
      : this.rNodesMap.get(nodeId);
  }
}
