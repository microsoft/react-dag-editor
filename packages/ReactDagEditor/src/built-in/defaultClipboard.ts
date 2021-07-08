import * as uuid from "uuid";
import { COPIED_NODE_SPACING } from "../common/constants";
import { ICanvasData } from "../models/canvas";

export interface IGraphClipBoard<NodeData = unknown, EdgeData = unknown, PortData = unknown> {
  write(data: ICanvasData<NodeData, EdgeData, PortData>): void;
  read(): ICanvasData<NodeData, EdgeData, PortData> | null;
}

export class DefaultClipboard<NodeData = unknown, EdgeData = unknown, PortData = unknown>
  implements IGraphClipBoard<NodeData, EdgeData, PortData> {
  private readonly storage: Storage;

  public constructor(storage: Storage) {
    this.storage = storage;
  }

  public write(data: ICanvasData): void {
    this.storage.setItem(
      "graph-clipboard",
      JSON.stringify({
        nodes: data.nodes.map(n => ({ ...n, data: {} })),
        edges: data.edges.map(e => ({ ...e, data: {} }))
      })
    );
  }

  public read(): ICanvasData<NodeData, EdgeData, PortData> | null {
    const str = this.storage.getItem("graph-clipboard");

    if (!str) {
      return null;
    }

    try {
      const data = JSON.parse(str) as ICanvasData<NodeData, EdgeData, PortData>;
      const nodeIdHash = new Map<string, string>();

      return {
        nodes: data.nodes.map(n => {
          const newId = uuid.v4();

          nodeIdHash.set(n.id, newId);

          return {
            ...n,
            x: n.x + COPIED_NODE_SPACING,
            y: n.y + COPIED_NODE_SPACING,
            id: newId
          };
        }),
        edges: data.edges.map(e => ({
          ...e,
          id: uuid.v4(),
          source: nodeIdHash.get(e.source) || "",
          target: nodeIdHash.get(e.target) || ""
        }))
      };
    } catch (error) {
      return null;
    }
  }
}
