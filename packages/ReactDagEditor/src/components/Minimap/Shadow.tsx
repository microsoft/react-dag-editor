import * as React from "react";
import { useTheme } from "../../hooks";
import { stopPropagation } from "../../utils/stopPropagation";

interface IProps {
  containerRect: ClientRect | DOMRect | undefined | null;
  viewPort: IRect;
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
  viewPort,
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

  const viewPortStartX = Math.max(viewPort.startX, shadowPadding);
  const viewPortStartY = Math.max(viewPort.startY, shadowPadding);
  const viewPortEndX = Math.min(viewPort.endX, rect.width - shadowPadding);

  const viewPortEndY = Math.min(viewPort.endY, rect.height - shadowPadding);
  const sideShadowHeight = viewPortEndY - viewPortStartY;
  const rightShadowWidth = rect.width - viewPortEndX;
  const bottomShadowHeight = rect.height - viewPortEndY;

  return (
    <>
      {viewPortStartY > 0 && (
        <g>
          <rect
            onClick={onClick}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
            x={0}
            y={0}
            height={viewPortStartY}
            width={rect.width}
            style={shadowStyle}
          />
          <line
            x1={viewPortStartX}
            y1={viewPortStartY}
            x2={viewPortEndX}
            y2={viewPortStartY}
            style={lineStyle}
          />
        </g>
      )}
      {viewPortStartX && sideShadowHeight > 0 && (
        <g>
          <rect
            onClick={onClick}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
            x={0}
            y={viewPortStartY}
            height={sideShadowHeight}
            width={viewPortStartX}
            style={shadowStyle}
          />
          <line
            x1={viewPortStartX}
            y1={viewPortStartY}
            x2={viewPortStartX}
            y2={viewPortEndY}
            style={lineStyle}
          />
        </g>
      )}
      {rightShadowWidth && sideShadowHeight > 0 && (
        <g>
          <rect
            onClick={onClick}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
            x={viewPortEndX}
            y={viewPortStartY}
            height={sideShadowHeight}
            width={rightShadowWidth}
            style={shadowStyle}
          />
          <line
            x1={viewPortEndX}
            y1={viewPortStartY}
            x2={viewPortEndX}
            y2={viewPortEndY}
            style={lineStyle}
          />
        </g>
      )}
      {bottomShadowHeight > 0 && (
        <g>
          <rect
            onClick={onClick}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
            x={0}
            y={viewPortEndY}
            height={bottomShadowHeight}
            width={rect.width}
            style={shadowStyle}
          />
          <line
            x1={viewPortStartX}
            y1={viewPortEndY}
            x2={viewPortEndX}
            y2={viewPortEndY}
            style={lineStyle}
          />
        </g>
      )}
    </>
  );
};
