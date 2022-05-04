import { liftMerge } from "record-class";
import { IContentState } from "../models/ContentState";

export function markEdgesDirty(nodeIds: string[], content: IContentState) {
  const edges = content.edges.mutate();
  const markEdgeDirty = (edgeId: string) => {
    edges.update(edgeId, liftMerge({}));
  };
  nodeIds.forEach((nodeId) => {
    content.edgesBySource.get(nodeId)?.forEach((edgeIds) => {
      edgeIds.forEach(markEdgeDirty);
    });
    content.edgesByTarget.get(nodeId)?.forEach((edgeIds) => {
      edgeIds.forEach(markEdgeDirty);
    });
  });
  return edges;
}
