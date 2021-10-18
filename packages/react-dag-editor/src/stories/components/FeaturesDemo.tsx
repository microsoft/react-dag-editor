/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/display-name */
import * as React from "react";
import {
  getRectHeight,
  getRectWidth,
  Graph,
  GraphConfigBuilder,
  GraphModel,
  GraphNodeStatus,
  GraphPortStatus,
  Bitset,
  ICanvasNode,
  ICanvasPort,
  IGetConnectableParams,
  INodeConfig,
  IPortConfig,
  IPortDrawArgs,
  ReactDagEditor,
  useGraphReducer,
} from "../../lib";
import { sampleGraphData } from "../data/sample-graph-1";

/** How to customize a node by "shape" by data.nodes[].shape */

const stepNodeContainerStyles: React.CSSProperties = {
  flexGrow: 1,
  height: "100%",
  backgroundColor: "yellow",
  opacity: 0.5,
};

const StepNode: React.FC<{ name: string }> = (props) => {
  return (
    <div style={stepNodeContainerStyles}>
      {props.name}
      <button
        onClick={() => {
          console.log(`this is node ${props.name}`);
        }}
      >
        Click me
      </button>
    </div>
  );
};

const sourceNodeConfig: INodeConfig = {
  // min height constraint for node resizing.
  getMinHeight: () => 60,
  // min width constraint for node resizing.
  getMinWidth: () => 100,
  // render decides the element to represent a node
  render(args): React.ReactNode {
    const height = getRectHeight(sourceNodeConfig, args.model);
    const width = getRectWidth(sourceNodeConfig, args.model);

    const fill = Bitset.has(GraphNodeStatus.Activated)(args.model.status)
      ? "red"
      : "blue";
    const stroke = Bitset.has(GraphNodeStatus.Selected)(args.model.status)
      ? "green"
      : "none";

    return (
      <ellipse
        rx={width / 2}
        ry={height / 2}
        cx={args.model.x + width / 2}
        cy={args.model.y + height / 2}
        stroke={stroke}
        strokeWidth={4}
        fill={fill}
        fillOpacity={0.8}
      />
    );
  },
};

/** Another node config. Use nodes[].shape to specify which one to use */

const stepNodeConfig: INodeConfig = {
  getMinHeight: () => 64,
  getMinWidth: (model) => 120 + (model.name?.length ?? 0) * 12,
  render: (args) => {
    const height = getRectHeight(stepNodeConfig, args.model);
    const width = getRectWidth(stepNodeConfig, args.model);

    // Here we are using HTML wrapped by foreignObject.
    return (
      <foreignObject
        transform={`translate(${args.model.x}, ${args.model.y})`}
        height={height}
        width={width}
        style={{ display: "flex" }}
      >
        <StepNode name={args.model.name ?? ""} />
      </foreignObject>
    );
  },
};

/** How to customize your port on a node. */

interface IPortProps {
  data: GraphModel;
  port: ICanvasPort;
  parentNode: ICanvasNode;
  x: number;
  y: number;
  style: React.CSSProperties;
  isConnectable: boolean | undefined;
}

/**
 * keep the radius of the placeholder element and connecting high light circle the same
 * or when `mouseleave`, the size of the element will change,
 * and a `mouseenter` is fired,
 * resulting in a strange behavior
 */
const RADIUS = 18;

export const Port: React.FunctionComponent<IPortProps> = (props) => {
  const { port, x, y, parentNode, style, isConnectable } = props;

  const renderCircle = (
    r: number,
    circleStyle: Partial<React.CSSProperties>
  ): React.ReactNode => {
    return <circle r={r} cx={x} cy={y} style={circleStyle} />;
  };

  const opacity = Bitset.has(GraphNodeStatus.UnconnectedToSelected)(
    parentNode.status
  )
    ? "60%"
    : "100%";

  return (
    <g opacity={opacity}>
      {isConnectable === undefined ? ( // isConnectable === undefined is when the graph is not in connecting state
        <>
          {Bitset.has(GraphPortStatus.Activated)(port.status)
            ? renderCircle(7, style)
            : renderCircle(5, style)}
        </>
      ) : Bitset.has(GraphPortStatus.ConnectingAsTarget)(port.status) ? (
        renderCircle(7, style)
      ) : (
        <>
          {isConnectable &&
            renderCircle(RADIUS, { fill: "#0078ba", opacity: 0.2 })}
          {renderCircle(5, style)}
        </>
      )}
      <circle r={RADIUS} fill="transparent" cx={x} cy={y} />
    </g>
  );
};

class MyPortConfig implements IPortConfig {
  public getStyle(
    port: ICanvasPort,
    parentNode: ICanvasNode,
    data: GraphModel,
    isConnectable: boolean | undefined,
    connectedAsSource: boolean,
    connectedAsTarget: boolean
  ): Partial<React.CSSProperties> {
    const strokeWidth = 1;
    let stroke = "#B3B0AD";
    let strokeDasharray = "";
    let fill = "#ffffff";

    if (connectedAsSource || connectedAsTarget) {
      fill = "#B3B0AD";
    }

    if (
      Bitset.has(
        GraphPortStatus.Activated |
          GraphPortStatus.Selected |
          GraphPortStatus.Connecting
      )(port.status)
    ) {
      fill = "#0078D4";
      stroke = "#0078D4";
    }

    if (Bitset.has(GraphPortStatus.Connecting)(port.status)) {
      switch (isConnectable) {
        case true:
          fill = "#ffffff";
          stroke = "#0078D4";
          strokeDasharray = "3,2";
          break;
        case false:
          fill = "#E1DFDD";
          if (Bitset.has(GraphPortStatus.Activated)(port.status)) {
            stroke = "#B3B0AD";
          }
          break;
        default:
      }
    }

    return {
      stroke,
      strokeWidth,
      strokeDasharray,
      fill,
    };
  }

  // Where you can figure out your own validators for node connections.

  public getIsConnectable({
    anotherPort,
    model,
  }: IGetConnectableParams): boolean | undefined {
    if (!anotherPort) {
      return undefined;
    }
    return (
      (!anotherPort.isOutputDisabled && !model.isInputDisabled) ||
      (!anotherPort.isInputDisabled && !model.isOutputDisabled)
    );
  }

  public render(args: IPortDrawArgs): React.ReactNode {
    const { model: port, data, x, y, parentNode } = args;
    const isConnectable = this.getIsConnectable(args);
    const connectedAsSource = data.isPortConnectedAsSource(
      parentNode.id,
      port.id
    );
    const connectedAsTarget = data.isPortConnectedAsTarget(
      parentNode.id,
      port.id
    );

    return (
      <Port
        data={data}
        port={port}
        parentNode={parentNode}
        x={x}
        y={y}
        style={this.getStyle(
          port,
          parentNode,
          data,
          isConnectable,
          connectedAsSource,
          connectedAsTarget
        )}
        isConnectable={isConnectable}
      />
    );
  }

  // hover view for ports
  public renderTooltips(args: Omit<IPortDrawArgs, "setData">): React.ReactNode {
    const styles: React.CSSProperties = {
      position: "absolute",
      left: args.x + 8,
      top: args.y + 8,
      background: "#fff",
      height: 30,
      border: "1px solid #ccc",
      minWidth: 50,
      zIndex: 1000,
    };

    return (
      <div style={styles}>
        {args.parentNode.name} {args.model.name}
      </div>
    );
  }
}

export const graphConfig = GraphConfigBuilder.default()
  .registerNode("source", sourceNodeConfig)
  .registerNode("step", stepNodeConfig)
  .registerPort("myPort", new MyPortConfig())
  .build();

export const FeaturesDemo: React.FC = () => {
  const [state, dispatch] = useGraphReducer(
    {
      settings: {
        graphConfig,
      },
      data: GraphModel.fromJSON(sampleGraphData),
    },
    undefined
  );

  return (
    <ReactDagEditor
      style={{ width: "900px", height: "600px" }}
      state={state}
      dispatch={dispatch}
    >
      <Graph />
    </ReactDagEditor>
  );
};
