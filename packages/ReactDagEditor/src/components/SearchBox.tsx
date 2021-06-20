import { mergeStyleSets } from "@fluentui/merge-styles";
import * as React from "react";
import { ICanvasNode } from "../Graph.interface";
import { usePropsAPI } from "../hooks";

export interface ICustomerSearch {
  onSearchTextChange(value: string): void;
}
export interface ISearchBoxProps {
  ariaLabel?: string;
  ariaLabeledby?: string;
  style?: React.CSSProperties;
  className?: string;
  inputContainerStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  resultContainerStyle?: React.CSSProperties;
  placeholderText?: string;
  customerSearchRender?(actions: ICustomerSearch): React.ReactNode;
  nodeSearchCriteria(searchKey: string, node: ICanvasNode): boolean;
  renderResult?(node: ICanvasNode, isSelected: boolean): React.ReactNode;
  onSearchTextChange?(evt: React.ChangeEvent<HTMLInputElement>): void;
}

export interface ISearchBoxState {
  searchText: string;
  results: ICanvasNode[];
  selectedIndex: number;
}

export const SearchBox: React.FunctionComponent<ISearchBoxProps> = props => {
  const propsApi = usePropsAPI();

  const highlightSelectedNode = React.useCallback(
    (nodeId: string): void => {
      propsApi.selectNodeById(nodeId);

      if (!propsApi.isNodeInViewPort(nodeId)) {
        propsApi.centralizeNode(nodeId);
      }
    },
    [propsApi]
  );

  const [state, setState] = React.useState<ISearchBoxState>({
    searchText: "",
    results: [],
    selectedIndex: 0
  });

  const classes = mergeStyleSets({
    searchTextInput: {
      border: "none",
      "&:focus": {
        outline: "none"
      }
    },
    searchResultContainer: {
      zIndex: 9999,
      position: "absolute",
      listStyle: "none",
      paddingLeft: 0,
      marginTop: 0
    }
  });

  const updateSearchResult = React.useCallback(
    (value: string): void => {
      const { nodes } = propsApi.getData();
      const results = value
        ? Array.from(nodes.values()).filter(n =>
            props.nodeSearchCriteria(value, n)
          )
        : [];

      propsApi.markSearchResults(results.map(r => r.id));

      setState(prevState => {
        return {
          ...prevState,
          searchText: value,
          results
        };
      });
    },
    [props, propsApi]
  );

  const onSearchTextChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    evt => {
      evt.stopPropagation();
      evt.preventDefault();

      const { value } = evt.target;

      if (props.onSearchTextChange) {
        props.onSearchTextChange(evt);
      }

      updateSearchResult(value);
    },
    [props, updateSearchResult]
  );

  const onCustomerSearchTextChange = (value: string) => {
    updateSearchResult(value);
  };

  const onKeyDown: React.KeyboardEventHandler = React.useCallback(
    evt => {
      if (state.results.length === 0) {
        return;
      }

      if (evt.key === "ArrowDown") {
        setState(prevState => {
          const selectedIndex = Math.min(
            prevState.results.length - 1,
            prevState.selectedIndex + 1
          );

          highlightSelectedNode(prevState.results[selectedIndex].id);

          return {
            ...prevState,
            selectedIndex
          };
        });
      } else if (evt.key === "ArrowUp") {
        setState(prevState => {
          const selectedIndex = Math.max(0, prevState.selectedIndex - 1);

          highlightSelectedNode(prevState.results[selectedIndex].id);

          return {
            ...prevState,
            selectedIndex
          };
        });
      }
    },
    [state.results.length, highlightSelectedNode]
  );

  const renderResult = props.renderResult
    ? props.renderResult.bind(null)
    : (result: ICanvasNode) => (
        <div className="search-result-item">{result.name || ""}</div>
      );

  const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = React.useCallback(
    evt => {
      if (evt.key === "ArrowUp" || evt.key === "ArrowDown") {
        evt.preventDefault();
      }
    },
    []
  );

  const searchInput = props.customerSearchRender ? (
    props.customerSearchRender({
      onSearchTextChange: onCustomerSearchTextChange
    })
  ) : (
    <input
      style={props.inputStyle}
      type="text"
      value={state.searchText}
      onChange={onSearchTextChange}
      onKeyDown={onInputKeyDown}
      className={classes.searchTextInput}
      placeholder={props.placeholderText}
      aria-label={props.ariaLabel}
      aria-labelledby={props.ariaLabeledby}
    />
  );

  return (
    <div
      onKeyDown={onKeyDown}
      role="application"
      style={props.style}
      className={props.className}
    >
      <div
        className="search-text-input-container"
        style={props.inputContainerStyle}
      >
        {searchInput}
      </div>
      <ul
        style={props.resultContainerStyle}
        className={`${classes.searchResultContainer} search-result-container`}
      >
        {state.results.map((result, index) => {
          const onLIClick: React.MouseEventHandler = evt => {
            evt.stopPropagation();

            setState(prevState => {
              highlightSelectedNode(prevState.results[index].id);

              return {
                ...prevState,
                selectedIndex: index
              };
            });
          };

          return (
            // eslint-disable-next-line react/jsx-no-bind
            <li key={index} onClick={onLIClick} role="button">
              {renderResult(result, index === state.selectedIndex)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
