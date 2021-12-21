import * as React from "react";
import { MenuType } from "../contexts/ContextMenuConfigContext";
import { useContextMenuConfigContext } from "../hooks/useContextMenuConfigContext";
import { IGraphState } from "../models/state";
import { isSelected } from "../models/status";

const defaultStyle: React.CSSProperties = {
  position: "fixed",
  userSelect: "none",
};

interface IProps {
  state: IGraphState;
  onClick(evt: React.MouseEvent<HTMLDivElement>): void;
}

export const GraphContextMenu: React.FunctionComponent<IProps> = ({
  state,
  onClick,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({
    ...defaultStyle,
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

  const [content, setContent] = React.useState<React.ReactNode>(<></>);

  React.useEffect(() => {
    const data = state.data.present;
    let selectedNodesCount = 0;
    let selectedPortsCount = 0;
    let selectedEdgesCount = 0;
    data.nodes.forEach((node) => {
      if (isSelected(node)) {
        selectedNodesCount += 1;
      }
      node.ports?.forEach((port) => {
        if (isSelected(port)) {
          selectedPortsCount += 1;
        }
      });
    });
    data.edges.forEach((edge) => {
      if (isSelected(edge)) {
        selectedEdgesCount += 1;
      }
    });

    let menu: React.ReactNode;
    // todo port menu
    if (selectedPortsCount + selectedNodesCount + selectedEdgesCount > 1) {
      menu = contextMenuConfig.getMenu(MenuType.Multi);
    } else if (
      selectedPortsCount + selectedNodesCount + selectedEdgesCount ===
      0
    ) {
      menu = contextMenuConfig.getMenu(MenuType.Canvas);
    } else if (selectedNodesCount === 1) {
      menu = contextMenuConfig.getMenu(MenuType.Node);
    } else if (selectedPortsCount === 1) {
      menu = contextMenuConfig.getMenu(MenuType.Port);
    } else {
      menu = contextMenuConfig.getMenu(MenuType.Edge);
    }

    setContent(menu);
  }, [state.data.present, contextMenuConfig]);

  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> =
    React.useCallback((evt) => {
      evt.stopPropagation();
      evt.preventDefault();
    }, []);

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
