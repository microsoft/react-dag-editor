import * as React from "react";
import { useGraphConfig, useVirtualization } from "../hooks/context";
import { ContentState } from "../models/ContentState";
import { EdgeModel } from "../models/edge";
import { GraphEdgeEvent, IEdgeCommonEvent } from "../models/event";
import { IPoint, IRectShape } from "../models/geometry";
import { GraphEdgeStatus } from "../models/status";
import { getEdgeUid, getLinearFunction, isPointInRect } from "../utils";
import * as Bitset from "../utils/bitset";
import { Debug } from "../utils/debug";
import { EventChannel } from "../utils/eventChannel";

export interface IGraphEdgeCommonProps {
  data: ContentState;
  eventChannel: EventChannel;
  graphId: string;
}

interface IGraphEdgeProps extends IGraphEdgeCommonProps {
  edge: EdgeModel;
  source: IPoint;
  target: IPoint;
}

function getHintPoints(
  source: IPoint,
  target: IPoint,
  { minX, minY, maxX, maxY }: IRectShape,
  yOnRightAxis: number,
  xOnBottomAxis: number,
  xOnTopAxis: number,
  yOnLeftAxis: number
): IPoint {
  if (source.x === target.x) {
    return {
      x: source.x,
      y: source.y < target.y ? maxY : minY,
    };
  }
  if (source.x < target.x) {
    if (source.y < target.y) {
      return yOnRightAxis <= maxY
        ? { x: maxX, y: yOnRightAxis }
        : { x: xOnBottomAxis, y: maxY };
    } else {
      return yOnRightAxis >= minY
        ? { x: maxX, y: yOnRightAxis }
        : { x: xOnTopAxis, y: minY };
    }
  }
  if (source.y < target.y) {
    return xOnBottomAxis > minX
      ? { x: xOnBottomAxis, y: maxY }
      : { x: minX, y: yOnLeftAxis };
  }
  return yOnLeftAxis > minY
    ? { x: minX, y: yOnLeftAxis }
    : { x: xOnTopAxis, y: minY };
}

export const GraphEdge: React.FunctionComponent<IGraphEdgeProps> = React.memo(
  // eslint-disable-next-line complexity
  (props) => {
    const {
      edge,
      data: content,
      eventChannel,
      source,
      target,
      graphId,
    } = props;
    const graphConfig = useGraphConfig();

    const virtualization = useVirtualization();
    const { viewport, renderedArea, visibleArea } = virtualization;

    const edgeEvent =
      (type: IEdgeCommonEvent["type"]) => (e: React.SyntheticEvent) => {
        e.persist();
        eventChannel.trigger({
          type,
          edge,
          rawEvent: e,
        });
      };

    const isSourceRendered = isPointInRect(renderedArea, source);
    const isTargetRendered = isPointInRect(renderedArea, target);
    const isVisible = isSourceRendered && isTargetRendered;

    React.useLayoutEffect(() => {
      if (isVisible) {
        virtualization.renderedEdges.add(edge.id);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [virtualization]);

    if (!isVisible) {
      return null;
    }

    const shape = edge.shape ? edge.shape : graphConfig.defaultEdgeShape;
    const edgeConfig = graphConfig.getEdgeConfigByName(shape);

    if (!edgeConfig) {
      Debug.warn(`invalid shape in edge ${JSON.stringify(edge)}`);
      return null;
    }

    if (!edgeConfig.render) {
      Debug.warn(
        `Missing "render" method in edge config ${JSON.stringify(edge)}`
      );
      return null;
    }

    const isSourceVisible = isPointInRect(visibleArea, source);

    const isTargetVisible = isPointInRect(visibleArea, target);

    let edgeNode: React.ReactNode = edgeConfig.render({
      model: edge,
      data: content,
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
      viewport,
    });

    if (
      Bitset.has(GraphEdgeStatus.ConnectedToSelected)(edge.status) &&
      (!isSourceVisible || !isTargetVisible)
    ) {
      const linearFunction = getLinearFunction(
        source.x,
        source.y,
        target.x,
        target.y
      );
      const inverseLinearFunction = getLinearFunction(
        source.y,
        source.x,
        target.y,
        target.x
      );
      const hintSource = isSourceVisible ? source : target;
      const hintTarget = isSourceVisible ? target : source;
      const yOnRightAxis = linearFunction(visibleArea.maxX);
      const xOnBottomAxis = inverseLinearFunction(visibleArea.maxY);
      const xOnTopAxis = inverseLinearFunction(visibleArea.minY);
      const yOnLeftAxis = linearFunction(visibleArea.minX);
      const hintPoint = getHintPoints(
        hintSource,
        hintTarget,
        visibleArea,
        yOnRightAxis,
        xOnBottomAxis,
        xOnTopAxis,
        yOnLeftAxis
      );
      if (isSourceVisible && edgeConfig.renderWithTargetHint) {
        edgeNode = edgeConfig.renderWithTargetHint({
          model: edge,
          data: content,
          x1: source.x,
          y1: source.y,
          x2: hintPoint.x,
          y2: hintPoint.y,
          viewport,
        });
      } else if (isTargetVisible && edgeConfig.renderWithSourceHint) {
        edgeNode = edgeConfig.renderWithSourceHint({
          model: edge,
          data: content,
          x1: hintPoint.x,
          y1: hintPoint.y,
          x2: target.x,
          y2: target.y,
          viewport,
        });
      }
    }

    const id = getEdgeUid(graphId, edge);
    const className = `edge-container-${edge.id}`;
    const automationId = edge.automationId ?? className;

    return (
      <g
        id={id}
        onClick={edgeEvent(GraphEdgeEvent.Click)}
        onDoubleClick={edgeEvent(GraphEdgeEvent.DoubleClick)}
        onMouseDown={edgeEvent(GraphEdgeEvent.MouseDown)}
        onMouseUp={edgeEvent(GraphEdgeEvent.MouseUp)}
        onMouseEnter={edgeEvent(GraphEdgeEvent.MouseEnter)}
        onMouseLeave={edgeEvent(GraphEdgeEvent.MouseLeave)}
        onContextMenu={edgeEvent(GraphEdgeEvent.ContextMenu)}
        onMouseMove={edgeEvent(GraphEdgeEvent.MouseMove)}
        onMouseOver={edgeEvent(GraphEdgeEvent.MouseOver)}
        onMouseOut={edgeEvent(GraphEdgeEvent.MouseOut)}
        onFocus={undefined}
        onBlur={undefined}
        className={className}
        data-automation-id={automationId}
      >
        {edgeNode}
      </g>
    );
  }
);
