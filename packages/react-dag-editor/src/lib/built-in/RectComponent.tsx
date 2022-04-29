import * as React from "react";
import { NodeModel } from "../models/NodeModel";

import { isNodeEditing } from "../models/status";
import { Property } from "../properties";

export interface IRectComponentProps {
  style: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: NodeModel;
  width: number;
  height: number;
  textY: number;
}

export const CommentProperty = new Property<string>("comment");

export const RectComponent: React.FC<IRectComponentProps> = (props) => {
  const { style, node, width, height, textY } = props;

  const comment = node.getProperty(CommentProperty) ?? "";
  const isEditing = isNodeEditing(node);
  return (
    <g key={node.id}>
      <rect
        width={width}
        height={height}
        x={node.x}
        y={node.y}
        style={style}
        rx={style.borderRadius}
      />
      <text x={node.x} y={textY} fontSize={12}>
        {node.name}
      </text>
      {!isEditing && (
        <text
          x={node.x}
          y={textY + 20}
          fontSize={12}
          className={`comment-${node.id}`}
        >
          {comment}
        </text>
      )}
      {isEditing && (
        <foreignObject
          x={node.x}
          y={textY}
          height={height / 2.5}
          width={width - 5}
        >
          <input value={comment} placeholder="Input your comment here" />
        </foreignObject>
      )}
    </g>
  );
};
