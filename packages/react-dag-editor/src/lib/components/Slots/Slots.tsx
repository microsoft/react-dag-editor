import * as React from "react";
import { INodeFrameProps, SlotsContext, INodeResizeHandlerProps } from "../../contexts/SlotsContext";

const NodeFrame: React.FC<React.PropsWithChildren<INodeFrameProps>> = props => {
  const slotsContext = React.useContext(SlotsContext);

  return <>{slotsContext.renderNodeFrame?.(props) ?? props.children}</>;
};
const NodeResizeHandler: React.FC<React.PropsWithChildren<INodeResizeHandlerProps>> = props => {
  const slotsContext = React.useContext(SlotsContext);

  return <>{slotsContext.renderNodeResizeHandler?.(props) ?? props.children}</>;
};

export const Slots = { NodeFrame, NodeResizeHandler };
