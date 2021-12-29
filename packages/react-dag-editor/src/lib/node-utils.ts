import { INodeUpdate, IPortUpdate } from "react-dag-editor";
import { lift } from "record-class";

export const liftPorts =
  (f: IPortUpdate): INodeUpdate =>
  (node) => {
    return {
      ports: node.ports?.map(lift(f)),
    };
  };
