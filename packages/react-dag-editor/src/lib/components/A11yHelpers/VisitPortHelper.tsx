import * as React from "react";
import { GraphModel } from "../../models/GraphModel";

interface INeighborItem {
  nodeId: string;
  portId: string;
}

interface IConnectionHelperProps {
  data: GraphModel;
  neighborPorts: INeighborItem[];
  onComplete(item: INeighborItem): void;
}

export const VisitPortHelper: React.FunctionComponent<
  IConnectionHelperProps
> = (props) => {
  const { neighborPorts, data } = props;
  const selectRef = React.useRef<HTMLSelectElement>(null);

  const [selectedItem, setSelectedItem] = React.useState<INeighborItem>();

  const onContainerKeyDown: React.KeyboardEventHandler = React.useCallback(
    (evt) => {
      if (evt.key === "Escape") {
        evt.stopPropagation();
        evt.preventDefault();

        if (selectedItem) {
          props.onComplete(selectedItem);
        }
      }
    },
    [selectedItem, props]
  );

  const onContainerBlur: React.FocusEventHandler = React.useCallback(() => {
    //
  }, []);

  const onContainerChange: React.ChangeEventHandler<HTMLSelectElement> =
    React.useCallback(
      (evt) => {
        const value = JSON.parse(evt.target.value);

        if (value.nodeId && value.portId) {
          setSelectedItem({ nodeId: value.nodeId, portId: value.portId });
        }
      },
      [setSelectedItem]
    );

  React.useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus({ preventScroll: true });
    }
  }, []);

  return (
    <select
      onKeyDown={onContainerKeyDown}
      onBlur={onContainerBlur}
      ref={selectRef}
      onChange={onContainerChange}
    >
      {neighborPorts.map((s) => {
        const isSelected =
          selectedItem &&
          selectedItem.portId === s.portId &&
          selectedItem.nodeId === s.nodeId;

        const value = JSON.stringify(s);
        const node = data.nodes.get(s.nodeId);

        if (!node) {
          return null;
        }

        const port = node.ports
          ? node.ports.filter((p) => p.id === s.portId)[0]
          : null;

        if (!port) {
          return null;
        }

        const label = `${node.ariaLabel || node.name || node.id}: ${
          port.ariaLabel || port.name || port.id
        }`;

        return (
          <option
            key={`${s.nodeId}-${s.portId}`}
            value={value}
            aria-selected={isSelected}
            aria-label={label}
          >
            {label}
          </option>
        );
      })}
    </select>
  );
};
