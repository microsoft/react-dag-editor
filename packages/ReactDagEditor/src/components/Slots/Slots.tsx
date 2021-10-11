import * as React from "react";
import { INodeFrameProps, SlotsContext, ISlotsContext } from "../../contexts/SlotsContext";

const Provider: React.FC<ISlotsContext> = ({ children, renderNodeFrame }) => {
  const context = React.useMemo(() => {
    return {
      renderNodeFrame,
    };
  }, [renderNodeFrame]);

  return <SlotsContext.Provider value={context}>{children}</SlotsContext.Provider>;
};

const NodeFrame: React.FC<INodeFrameProps> = (props) => {
  const slotsContext = React.useContext(SlotsContext);

  return <>{slotsContext.renderNodeFrame?.(props) ?? props.children}</>;
};

export const Slots = { Provider, NodeFrame };
