/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion,compat/compat */
import { cleanup, render, RenderResult } from "@testing-library/react";
import * as React from "react";
import { act } from "react-dom/test-utils";
import {
  applyDefaultPortsPosition,
  Bitset,
  GraphCanvasEvent,
  GraphEdgeEvent,
  GraphModel,
  GraphNodeEvent,
  GraphNodeStatus,
  GraphPortEvent,
  GraphPortStatus,
  ICanvasData,
  ICanvasNode,
  ICanvasPort,
  IConnectingState,
  IGraphProps,
  IGraphState,
  NodeModel,
} from "../../src";
import { GraphController } from "../../src/controllers/GraphController";
import { getNearestConnectablePort } from "../../src/utils";
import { EventChannel } from "../../src/utils/eventChannel";
import { identical } from "../../src/utils/identical";
import { GraphControllerRef, TestComponent } from "../TestComponent";
import { getGraphConfig, mockClientRect, patchPointerEvent } from "../utils";

describe("test getNearestConnectablePort", () => {
  it("should return nothing with no ports", () => {
    const graphConfig = getGraphConfig();
    const node: ICanvasNode = {
      id: "0",
      width: 200,
      height: 100,
      x: 100,
      y: 100,
    };
    const data = GraphModel.fromJSON({
      nodes: [node],
      edges: [],
    });
    const port = getNearestConnectablePort({
      parentNode: NodeModel.fromJSON(node, undefined, undefined),
      clientX: 150,
      clientY: 150,
      graphConfig,
      data,
      viewport: {
        rect: mockClientRect,
        transformMatrix: [1, 0, 0, 1, 0, 0],
      },
      anotherNode: NodeModel.fromJSON(node, undefined, undefined),
      anotherPort: {
        id: "0",
        name: "",
        position: [0, 0],
        isInputDisabled: false,
        data: {
          isConnectable: false,
        },
      },
    });
    expect(port).toBeUndefined();
  });

  it("should return connectable port", () => {
    const graphConfig = getGraphConfig();
    const ports: ICanvasPort[] = applyDefaultPortsPosition([
      {
        id: "0",
        name: "",
        isInputDisabled: false,
        data: {
          isConnectable: false,
        },
      },
      {
        id: "1",
        name: "",
        isInputDisabled: false,
        data: {
          isConnectable: true,
        },
      },
      {
        id: "2",
        name: "",
        isInputDisabled: false,
        data: {
          isConnectable: true,
        },
      },
    ]);
    const node: ICanvasNode = {
      id: "0",
      width: 200,
      height: 100,
      x: 100,
      y: 100,
      ports,
    };
    const data = GraphModel.fromJSON({
      nodes: [node],
      edges: [],
    });
    const port = getNearestConnectablePort({
      parentNode: NodeModel.fromJSON(node, undefined, undefined),
      clientX: 250,
      clientY: 150,
      graphConfig,
      data,
      viewport: {
        rect: mockClientRect,
        transformMatrix: [1, 0, 0, 1, 0, 0],
      },
      anotherNode: NodeModel.fromJSON(node, undefined, undefined),
      anotherPort: {
        id: "0",
        name: "",
        position: [0, 0],
        isInputDisabled: false,
        data: {
          isConnectable: true,
        },
      },
    });
    expect(port?.id).toBe("1");
  });
});

describe("test Connecting", () => {
  beforeAll(() => {
    patchPointerEvent();
  });

  let container: RenderResult;
  let edgeWillAdd: Required<IGraphProps>["edgeWillAdd"];
  let graphController: GraphController;
  let eventChannel: EventChannel;
  let mockData: GraphModel;
  let ports: ICanvasPort[];
  let connecting: Connecting;

  const getData = () => {
    return graphController.state.data.present;
  };

  class Connecting {
    public start(node: NodeModel, port: ICanvasPort): void {
      act(() => {
        eventChannel.trigger({
          type: GraphEdgeEvent.ConnectStart,
          nodeId: node.id,
          portId: port.id,
          rawEvent: new KeyboardEvent("keydown") as any,
          clientPoint: {
            x: 190 + mockClientRect.left,
            y: 151 + mockClientRect.top,
          },
        });
      });
    }

    public attach(node: NodeModel, port: ICanvasPort): void {
      graphController.pointerId = 0;
      act(() => {
        eventChannel.trigger({
          type: GraphPortEvent.PointerEnter,
          node,
          port,
          rawEvent: new PointerEvent("pointerenter", { pointerId: 0 }),
        });
      });
    }

    public clearAttach(node: NodeModel, port: ICanvasPort): void {
      graphController.pointerId = 0;
      act(() => {
        eventChannel.trigger({
          type: GraphPortEvent.PointerLeave,
          node,
          port,
          rawEvent: new PointerEvent("pointerenter", { pointerId: 0 }),
        });
      });
    }

    public finish(): void {
      act(() => {
        eventChannel.trigger({
          type: GraphEdgeEvent.ConnectEnd,
          edgeWillAdd,
          isCancel: false,
          rawEvent: new KeyboardEvent("keydown"),
        });
      });
    }

    public get state(): IGraphState | undefined {
      return graphController.state;
    }

    public get connectState(): IConnectingState | undefined {
      return graphController.state.connectState;
    }

    public get data(): GraphModel | undefined {
      return this.state?.data.present;
    }

    public get sourceNode(): string | undefined {
      return this.connectState?.sourceNode;
    }

    public get sourcePort(): string | undefined {
      return this.connectState?.sourcePort;
    }

    public get targetNode(): string | undefined {
      return this.connectState?.targetNode;
    }

    public get targetPort(): string | undefined {
      return this.connectState?.targetPort;
    }
  }

  beforeEach(() => {
    ports = applyDefaultPortsPosition([
      {
        id: "0",
        name: "0",
        status: GraphPortStatus.Default,
        isInputDisabled: false,
        isOutputDisabled: true,
        data: {
          isConnectable: false,
        },
      },
      {
        id: "1",
        name: "1",
        status: GraphPortStatus.Default,
        isInputDisabled: true,
        isOutputDisabled: false,
        data: {
          isConnectable: true,
        },
      },
    ]);

    mockData = GraphModel.fromJSON({
      edges: [],
      nodes: [
        {
          id: "0",
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          ports,
        },
        {
          id: "1",
          x: 150,
          y: 150,
          width: 100,
          height: 100,
          ports,
        },
        {
          id: "2",
          x: 250,
          y: 250,
          width: 150,
          height: 150,
          ports,
        },
      ],
    });

    edgeWillAdd = jest.fn(identical);
    const graphControllerRef = React.createRef<GraphController>();
    container = render(
      <TestComponent settings={{ graphConfig: getGraphConfig() }} data={mockData} graphProps={{ edgeWillAdd }}>
        <GraphControllerRef ref={graphControllerRef} />
      </TestComponent>
    );
    graphController = graphControllerRef.current!;
    expect(graphController).toBeDefined();
    eventChannel = graphController.eventChannel;
    expect(eventChannel).toBeDefined();
    connecting = new Connecting();
    act(() => {
      eventChannel.trigger({
        type: GraphCanvasEvent.ViewportResize,
        viewportRect: mockClientRect,
      });
    });
  });

  afterEach(cleanup);

  const getConnectLineElement = () => container.baseElement.querySelector("#markerArrow")?.parentElement?.parentElement;

  it("should render invisible lines", () => {
    expect(getConnectLineElement()).toMatchSnapshot();
  });

  it("should not connect", () => {
    act(() => {
      connecting.start(mockData.nodes.get(mockData.head!)!, ports[0]);
    });
    const port = getData().nodes.get(mockData.head!)?.ports?.[0];
    expect(Bitset.has(GraphPortStatus.Connecting)(port?.status)).toBe(true);
    expect(connecting.sourceNode).toBe("0");
    expect(connecting.sourcePort).toBe("0");
    act(() => {
      connecting.finish();
    });
    expect(getData().toJSON()).toEqual(mockData.toJSON());
    expect(connecting.sourceNode).toBeUndefined();
    expect(connecting.sourcePort).toBeUndefined();
    expect(edgeWillAdd).not.toBeCalled();
  });

  it("should attach to port", () => {
    act(() => {
      const node = mockData.nodes.get(mockData.head!)!;
      connecting.start(node, node.ports![1]);
    });
    expect(getConnectLineElement()).toMatchSnapshot();
    act(() => {
      connecting.attach(mockData.nodes.get("1")!, mockData.nodes.get("1")!.ports![1]);
    });
    expect(Bitset.has(GraphPortStatus.ConnectingAsTarget)(connecting.data?.nodes.get("1")!.ports![1].status)).toBe(
      true
    );
    expect(getConnectLineElement()).toMatchSnapshot();
    act(() => {
      connecting.clearAttach(mockData.nodes.get("1")!, mockData.nodes.get("1")!.ports![1]);
    });
    expect(getData().toJSON()).toMatchSnapshot();
    expect(getConnectLineElement()).toMatchSnapshot();
  });

  it("should add edge", () => {
    const firstNode = mockData.nodes.get(mockData.head!)!;
    act(() => {
      connecting.start(firstNode, firstNode.ports![1]);
    });
    act(() => {
      const node = mockData.nodes.get(firstNode.next!)!;
      connecting.attach(node, node.ports![1]);
    });
    act(() => {
      connecting.finish();
    });
    expect(connecting.data?.toJSON()).toMatchSnapshot();
    expect(connecting.sourceNode).toBeUndefined();
    expect(connecting.sourcePort).toBeUndefined();
    expect(connecting.targetNode).toBeUndefined();
    expect(connecting.targetPort).toBeUndefined();
    expect(edgeWillAdd).toBeCalledTimes(1);
    expect(getConnectLineElement()).toMatchSnapshot();
  });

  it("should attach nearest port by mouse, should not add edge after mouse leave", () => {
    const data: ICanvasData = {
      edges: [],
      nodes: [
        {
          id: "0",
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          status: GraphNodeStatus.Default,
          ports: applyDefaultPortsPosition([
            {
              id: "0",
              name: "0",
              status: GraphPortStatus.Default,
              isInputDisabled: false,
              isOutputDisabled: true,
            },
            {
              id: "1",
              name: "1",
              status: GraphPortStatus.Default,
              isInputDisabled: true,
              isOutputDisabled: false,
            },
          ]),
        },
        {
          id: "1",
          x: 150,
          y: 150,
          width: 100,
          height: 100,
          status: GraphNodeStatus.Default,
          ports: applyDefaultPortsPosition([
            {
              id: "0",
              name: "0",
              status: GraphPortStatus.Default,
              isInputDisabled: false,
              isOutputDisabled: true,
              data: {
                isConnectable: true,
              },
            },
            {
              id: "1",
              name: "1",
              status: GraphPortStatus.Default,
              isInputDisabled: false,
              isOutputDisabled: true,
              data: {
                isConnectable: true,
              },
            },
            {
              id: "2",
              name: "2",
              status: GraphPortStatus.Default,
              isInputDisabled: false,
              isOutputDisabled: true,
              data: {
                isConnectable: true,
              },
            },
            {
              id: "3",
              name: "3",
              status: GraphPortStatus.Default,
              isInputDisabled: true,
              isOutputDisabled: false,
              data: {
                isConnectable: true,
              },
            },
          ]),
        },
      ],
    };
    act(() => {
      graphController.dispatch({
        type: GraphCanvasEvent.SetData,
        data: GraphModel.fromJSON(data),
      });
    });
    act(() => {
      connecting.start(NodeModel.fromJSON(data.nodes[0], undefined, "1"), data.nodes[0].ports![1]);
    });
    expect(connecting.targetNode).toBeUndefined();
    expect(connecting.targetPort).toBeUndefined();

    act(() => {
      eventChannel.trigger({
        type: GraphNodeEvent.PointerEnter,
        node: NodeModel.fromJSON(data.nodes[1], "0", undefined),
        rawEvent: new PointerEvent("pointerenter", {
          pointerId: 0,
          clientX: 210 + mockClientRect.left,
          clientY: 160 + mockClientRect.top,
        }),
      });
    });
    expect(connecting.targetNode).toBe("1");
    expect(connecting.targetPort).toBe("0");

    act(() => {
      eventChannel.trigger({
        type: GraphNodeEvent.PointerLeave,
        node: NodeModel.fromJSON(data.nodes[1], "0", undefined),
        rawEvent: new PointerEvent("pointerenter", {
          pointerId: 0,
          clientX: 210 + mockClientRect.left,
          clientY: 160 + mockClientRect.top,
        }),
      });
    });
    expect(connecting.targetNode).toBeUndefined();
    expect(connecting.targetPort).toBeUndefined();

    act(() => {
      connecting.finish();
    });
    expect(connecting.data?.toJSON()).toEqual(data);
  });

  it("should attach to port when mouse enter a connectable port, should not add edge after mouse leave", () => {
    act(() => {
      connecting.start(mockData.nodes.get("0")!, mockData.nodes.get("0")!.ports![1]);
    });
    expect(connecting.targetNode).toBeUndefined();
    expect(connecting.targetPort).toBeUndefined();
    expect(getConnectLineElement()).toMatchSnapshot();

    act(() => {
      connecting.attach(mockData.nodes.get("1")!, mockData.nodes.get("1")!.ports![0]);
    });
    expect(connecting.targetNode).toBeUndefined();
    expect(connecting.targetPort).toBeUndefined();
    expect(getConnectLineElement()).toMatchSnapshot();

    act(() => {
      const node = mockData.nodes.get("1")!;
      const port = mockData.nodes.get("1")!.ports![0];
      eventChannel.trigger({
        type: GraphPortEvent.PointerLeave,
        rawEvent: new PointerEvent("pointerleave"),
        node,
        port,
      });
    });
    expect(getConnectLineElement()).toMatchSnapshot();

    act(() => {
      connecting.attach(mockData.nodes.get("1")!, mockData.nodes.get("1")!.ports![1]);
    });
    expect(connecting.targetNode).toBe("1");
    expect(connecting.targetPort).toBe("1");
    expect(getConnectLineElement()).toMatchSnapshot();

    act(() => {
      const node = mockData.nodes.get("1")!;
      const port = mockData.nodes.get("1")!.ports![1];
      eventChannel.trigger({
        type: GraphPortEvent.PointerLeave,
        rawEvent: new PointerEvent("pointerleave"),
        node,
        port,
      });
    });
    expect(connecting.targetNode).toBeUndefined();
    expect(connecting.targetPort).toBeUndefined();
    expect(getConnectLineElement()).toMatchSnapshot();

    act(() => {
      connecting.finish();
    });
    expect(connecting.data?.toJSON()).toEqual(mockData.toJSON());
  });
});
