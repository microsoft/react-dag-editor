import * as React from "react";
import { useTheme } from "../../hooks";
import { stopPropagation } from "../../utils/stopPropagation";

interface IProps {
  containerRect: ClientRect | DOMRect | undefined | null;
  viewport: IRect;
  shadowPadding: number;
  onClick: React.MouseEventHandler<SVGRectElement>;
}

export interface IRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const MiniMapShadow: React.FunctionComponent<IProps> = ({
  containerRect: rect,
  viewport,
  shadowPadding = 0,
  onClick
}) => {
  const { theme } = useTheme();

  if (!rect) {
    return null;
  }

  const shadowStyle = {
    fill: theme.minimapShadow,
    opacity: 0.1
  };

  const lineStyle = {
    stroke: theme.inputFocusBorderAlt,
    strokeWidth: 1
  };

  const viewportStartX = Math.max(viewport.startX, shadowPadding);
  const viewportStartY = Math.max(viewport.startY, shadowPadding);
  const viewportEndX = Math.min(viewport.endX, rect.width - shadowPadding);

  const viewportEndY = Math.min(viewport.endY, rect.height - shadowPadding);
  const sideShadowHeight = viewportEndY - viewportStartY;
  const rightShadowWidth = rect.width - viewportEndX;
  const bottomShadowHeight = rect.height - viewportEndY;

  return (
    <>
      {viewportStartY > 0 && (
        <g>
          <rect
            onClick={onClick}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
            x={0}
            y={0}
            height={viewportStartY}
            width={rect.width}
            style={shadowStyle}
          />
          <line x1={viewportStartX} y1={viewportStartY} x2={viewportEndX} y2={viewportStartY} style={lineStyle} />
        </g>
      )}
      {viewportStartX && sideShadowHeight > 0 && (
        <g>
          <rect
            onClick={onClick}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
            x={0}
            y={viewportStartY}
            height={sideShadowHeight}
            width={viewportStartX}
            style={shadowStyle}
          />
          <line x1={viewportStartX} y1={viewportStartY} x2={viewportStartX} y2={viewportEndY} style={lineStyle} />
        </g>
      )}
      {rightShadowWidth && sideShadowHeight > 0 && (
        <g>
          <rect
            onClick={onClick}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
            x={viewportEndX}
            y={viewportStartY}
            height={sideShadowHeight}
            width={rightShadowWidth}
            style={shadowStyle}
          />
          <line x1={viewportEndX} y1={viewportStartY} x2={viewportEndX} y2={viewportEndY} style={lineStyle} />
        </g>
      )}
      {bottomShadowHeight > 0 && (
        <g>
          <rect
            onClick={onClick}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
            x={0}
            y={viewportEndY}
            height={bottomShadowHeight}
            width={rect.width}
            style={shadowStyle}
          />
          <line x1={viewportStartX} y1={viewportEndY} x2={viewportEndX} y2={viewportEndY} style={lineStyle} />
        </g>
      )}
    </>
  );
};
