import { EdgeModel, NodeModel } from "react-dag-editor";
import { Record } from "record-class";
import record from "record-class/macro";
import { HashMap, OrderedMap } from "../collections";

export type IContentStateUpdate = (
  content: IContentState
) => Partial<IContentState>;

export type IContentStateComputed<T> = (content: ContentState) => T;

export interface IContentState {
  readonly nodes: OrderedMap<string, NodeModel>;
  readonly edges: HashMap<string, EdgeModel>;
  readonly firstNode: string | undefined;
  readonly lastNode: string | undefined;
  readonly selectedNodes: ReadonlySet<string>;
  readonly edgesBySource: EdgesByPort;
  readonly edgesByTarget: EdgesByPort;
}

export type EdgesByPort = HashMap<
  string,
  ReadonlyMap<string, ReadonlySet<string>>
>;

@record
export class ContentState
  extends Record<IContentState, ContentState>
  implements IContentState
{
  public readonly nodes: OrderedMap<string, NodeModel> = OrderedMap.empty();
  public readonly edges: HashMap<string, EdgeModel> = HashMap.empty();
  public readonly firstNode: string | undefined = undefined;
  public readonly lastNode: string | undefined = undefined;
  public readonly edgesBySource: EdgesByPort = HashMap.empty();
  public readonly edgesByTarget: EdgesByPort = HashMap.empty();
  public readonly selectedNodes: ReadonlySet<string> = new Set();

  protected $$create(partial: Partial<IContentState>): ContentState {
    return new ContentState(partial);
  }

  public computed<T>(f: IContentStateComputed<T>) {
    return f(this);
  }
}
