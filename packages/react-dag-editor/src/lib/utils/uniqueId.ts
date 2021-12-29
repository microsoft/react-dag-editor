import { v4 as uuidv4 } from "uuid";

export interface IExistNodeIds {
  has(id: string): boolean;
}

export const uniqueId = (
  existIds: IExistNodeIds | undefined,
  prefix = "",
  length = 8
): string => {
  let nodeId = uuidv4().substring(0, length - prefix.length);
  let retriedTime = 0;

  if (!existIds) {
    return nodeId;
  }

  while (existIds.has(nodeId)) {
    nodeId = uuidv4().substring(0, 8);

    retriedTime++;

    if (retriedTime >= 10) {
      throw new Error("Failed to generate a node id");
    }
  }

  return `${prefix}${nodeId}`;
};
