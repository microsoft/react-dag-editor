import * as React from "react";
import { MenuType } from "../contexts/ContextMenuConfigContext";
import { IGraphState } from "../contexts/GraphStateContext";
import { useContextMenuConfigContext } from "../hooks/useContextMenuConfigContext";
import { isSelected } from "../utils/state";

const defaultStyle: React.CSSProperties = {
  position: "fixed",
  userSelect: "none"
};

interface IProps {
  state: IGraphState;
  onClick(evt: React.MouseEvent<HTMLDivElement>): void;
}

export const GraphContextMenu: React.FunctionComponent<IProps> = ({
  state,
  onClick
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({
    ...defaultStyle
  });

  React.useLayoutEffect((): void => {
    const el = ref.current;
    if (!el || !state.contextMenuPosition) {
      return;
    }

    const { x, y } = state.contextMenuPosition;
    const { clientWidth, clientHeight } = document.documentElement;
    const { width, height } = el.getBoundingClientRect();
    const nextStyle: React.CSSProperties = { ...defaultStyle };
    if (x + width >= clientWidth) {
      nextStyle.right = 0;
    } else {
      nextStyle.left = x;
    }
    if (y + height > clientHeight) {
      nextStyle.bottom = 0;
    } else {
      nextStyle.top = y;
    }
    setStyle(nextStyle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.contextMenuPosition?.x, state.contextMenuPosition?.y]);

  const contextMenuConfig = useContextMenuConfigContext();
  const content = React.useMemo(() => {
    const data = state.data.present;
    let selectedNodesCount = 0;
    let selectedPortsCount = 0;
    let selectedEdgesCount = 0;
    data.nodes.forEach(node => {
      if (isSelected(node)) {
        selectedNodesCount += 1;
      }
      node.ports?.forEach(port => {
        if (isSelected(port)) {
          selectedPortsCount += 1;
        }
      });
    });
    data.edges.forEach(edge => {
      if (isSelected(edge)) {
        selectedEdgesCount += 1;
      }
    });

    // todo port menu
    if (selectedPortsCount + selectedNodesCount + selectedEdgesCount > 1) {
      return contextMenuConfig.getMenu(MenuType.Multi);
    } else if (
      selectedPortsCount + selectedNodesCount + selectedEdgesCount ===
      0
    ) {
      return contextMenuConfig.getMenu(MenuType.Canvas);
    } else if (selectedNodesCount === 1) {
      return contextMenuConfig.getMenu(MenuType.Node);
    } else if (selectedPortsCount === 1) {
      return contextMenuConfig.getMenu(MenuType.Port);
    } else {
      return contextMenuConfig.getMenu(MenuType.Edge);
    }
  }, [state.data.present, contextMenuConfig]);

  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = React.useCallback(
    evt => {
      evt.stopPropagation();
      evt.preventDefault();
    },
    []
  );

  return (
    <>
      {state.contextMenuPosition && (
        <div
          ref={ref}
          onClick={onClick}
          onContextMenu={handleContextMenu}
          role="button"
          style={style}
        >
          {content}
        </div>
      )}
    </>
  );
};
