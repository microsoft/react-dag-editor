import { IContentStateComputed } from "react-dag-editor";

export const getEdgesBySource =
  (
    nodeId: string,
    portId: string
  ): IContentStateComputed<ReadonlySet<string> | undefined> =>
  (content) => {
    return content.edgesBySource.get(nodeId)?.get(portId);
  };

export const getEdgesByTarget =
  (
    nodeId: string,
    portId: string
  ): IContentStateComputed<ReadonlySet<string> | undefined> =>
  (content) => {
    return content.edgesByTarget.get(nodeId)?.get(portId);
  };

export const isEdgeExist =
  (
    source: string,
    sourcePortId: string,
    target: string,
    targetPortId: string
  ): IContentStateComputed<boolean> =>
  (content) => {
    const sources = content.computed(getEdgesBySource(source, sourcePortId));
    const targets = content.computed(getEdgesByTarget(target, targetPortId));
    if (!sources || !targets) {
      return false;
    }
    let exist = false;
    sources.forEach((id) => {
      if (targets.has(id)) {
        exist = true;
      }
    });
    return exist;
  };
