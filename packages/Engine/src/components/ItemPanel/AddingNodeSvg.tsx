import * as React from "react";
import { v4 as uuid } from "uuid";
import { GraphCanvasEvent } from "../../common/GraphEvent.constant";
import { GraphConfigContext, PropsAPIContext, ViewPortContext } from "../../contexts";
import { AlignmentLinesContext } from "../../contexts/AlignmentLinesContext";
import { ICanvasNode } from "../../Graph.interface";
import { useConst } from "../../hooks/useConst";
import { NodeModel } from "../../models/NodeModel";
import { getNodeSize } from "../../utils";
import { defaultGetNodeAriaLabel } from "../../utils/a11yUtils";
import { getAutoAlignDisplacement } from "../../utils/autoAlign";
import { EventChannel } from "../../utils/eventChannel";
import { GraphNode } from "../GraphNode";
import classes from "../Graph.styles.m.scss";
import { Transform } from "../Transform";
import { useSvgRect } from "./useSvgRect";

interface IAddingNodeSvgProps<NodeData, PortData> {
  model: ICanvasNode<NodeData, PortData>;
  nextNodeRef: React.MutableRefObject<ICanvasNode<NodeData, PortData> | null>;
  svgRef: React.RefObject<SVGSVGElement>;
}

export const AddingNodeSvg: React.FunctionComponent<IAddingNodeSvgProps<unknown, unknown>> = ({
  model,
  svgRef,
  nextNodeRef
}) => {
  const rect = useSvgRect(svgRef);
  const graphConfig = React.useContext(GraphConfigContext);
  const propsAPI = React.useContext(PropsAPIContext);
  const alignmentLines = React.useContext(AlignmentLinesContext);
  const viewport = React.useContext(ViewPortContext);

  const dummyNode = React.useMemo(() => {
    if (!model || !viewport.rect) {
      return null;
    }
    const { transformMatrix } = viewport;
    const { left, top } = viewport.rect;
    const diffLeft = left / transformMatrix[0];
    const diffTop = top / transformMatrix[3];
    return {
      id: model.id,
      x: model.x - diffLeft,
      y: model.y - diffTop,
      ...getNodeSize(model, graphConfig)
    };
  }, [graphConfig, viewport, model]);

  React.useLayoutEffect((): void => {
    if (!dummyNode) {
      return;
    }
    propsAPI.getEventChannel().trigger({
      type: GraphCanvasEvent.DraggingNodeFromItemPanel,
      node: dummyNode
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummyNode?.x, dummyNode?.y]);

  const attachedNode = React.useMemo<ICanvasNode | null>(() => {
    if (!dummyNode || !model) {
      return null;
    }

    const dxAligned = getAutoAlignDisplacement(alignmentLines, [dummyNode], graphConfig, "x");
    const dyAligned = getAutoAlignDisplacement(alignmentLines, [dummyNode], graphConfig, "y");

    return {
      ...model,
      x: model.x + dxAligned,
      y: model.y + dyAligned
    };
  }, [alignmentLines, dummyNode, graphConfig, model]);

  React.useEffect(() => {
    nextNodeRef.current = attachedNode;
  }, [nextNodeRef, attachedNode]);

  const eventChannel = useConst(() => new EventChannel());

  const tempGraphId = useConst(uuid);

  const node = React.useMemo(() => NodeModel.fromJSON(attachedNode ?? model, undefined, undefined), [
    attachedNode,
    model
  ]);

  return (
    <svg id={tempGraphId} ref={svgRef} className={classes.addingNodeSvg} preserveAspectRatio="xMidYMid meet">
      <Transform matrix={viewport.transformMatrix}>
        {rect && (
          <GraphNode
            graphId={tempGraphId}
            node={node}
            viewport={{
              rect,
              visibleRect: rect,
              transformMatrix: viewport.transformMatrix
            }}
            eventChannel={eventChannel}
            getNodeAriaLabel={defaultGetNodeAriaLabel}
          />
        )}
      </Transform>
    </svg>
  );
};
