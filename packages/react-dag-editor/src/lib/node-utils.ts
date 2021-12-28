import { INodeUpdate, IPortUpdate } from "react-dag-editor";

export const updatePorts =
  (f: IPortUpdate): INodeUpdate =>
  (node) => {
    return {
      ports: node.ports?.map((port) => port.pipe(f)),
    };
  };
