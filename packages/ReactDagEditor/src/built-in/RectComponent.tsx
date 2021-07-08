import * as React from "react";
import { usePropsAPI } from "../hooks/usePropsAPI";
import { ICanvasNode } from "../models/node";
import { IPropsAPI } from "../props-api/IPropsAPI";
import { isNodeEditing } from "../utils/state";

const getChangeHandler = (node: ICanvasNode, propsAPI: IPropsAPI) => (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value; // to prevent "value" undefined error, refer: https://reactjs.org/docs/events.html#event-pooling

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propsAPI.updateNodeData(node.id, (data: any) => ({
    ...data,
    comment: value
  }));
};

export interface IRectComponentProps {
  style: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: ICanvasNode<any>;
  width: number;
  height: number;
  textY: number;
}

export const RectComponent: React.FC<IRectComponentProps> = props => {
  const { style, node, width, height, textY } = props;

  const comment = node.data && node.data.comment ? node.data.comment : "";
  const isEditing = isNodeEditing(node);

  const propsAPI = usePropsAPI();

  return (
    <g key={node.id}>
      <rect width={width} height={height} x={node.x} y={node.y} style={style} rx={style.borderRadius} />
      <text x={node.x} y={textY} fontSize={12}>
        {node.name}
      </text>
      {node.data && node.data.comment && !isEditing && (
        <text x={node.x} y={textY + 20} fontSize={12} className={`comment-${node.id}`}>
          {node.data.comment}
        </text>
      )}
      {isEditing && (
        <foreignObject x={node.x} y={textY} height={height / 2.5} width={width - 5}>
          <input value={comment} placeholder="Input your comment here" onChange={getChangeHandler(node, propsAPI)} />
        </foreignObject>
      )}
    </g>
  );
};
