import * as React from "react";
import { DEFAULT_AUTO_ALIGN_THRESHOLD, MouseEventButton } from "../common/constants";
import { IGraphProps } from "../components/Graph/IGraphProps";
import { IGraphConfig } from "../contexts";
import { IDispatch } from "../contexts/GraphStateContext";
import { defaultGetPositionFromEvent, DragController } from "../controllers";
import { PointerEventProvider } from "../event-provider/PointerEventProvider";
import {
  GraphCanvasEvent,
  GraphContextMenuEvent,
  GraphEdgeEvent,
  GraphMinimapEvent,
  GraphNodeEvent,
  GraphPortEvent,
  GraphScrollBarEvent,
  IEvent,
  INodeCommonEvent,
  IPortEvent
} from "../models/event";
import { GraphNodeState } from "../models/element-state";
import { onContainerMouseDown, onNodePointerDown } from "../handlers";
import { IContainerRect } from "../models/geometry";
import { GraphBehavior } from "../models/state";
import { PropsAPI } from "../props-api/PropsAPI";
import { handleBehaviorChange } from "../reducers/behaviorReducer";
import { addState, filterSelectedItems } from "../utils";
import {
  findDOMElement,
  focusDownNode,
  focusItem,
  focusLeftNode,
  focusNextPort,
  focusPrevPort,
  focusRightNode,
  focusUpNode,
  getNextItem,
  getPrevItem,
  goToConnectedPort
} from "../utils/a11yUtils";
import { EventChannel } from "../utils/eventChannel";
import { GraphController } from "../utils/graphController";
import { animationFramed } from "../utils/scheduling";
import { useCanvasKeyboardEventHandlers } from "./useCanvasKeyboardEventHandlers";
import { useFeatureControl } from "./useFeatureControl";

let prevMouseDownPortId: string | undefined;
let prevMouseDownPortTime: number | undefined;

export interface IUseEventChannelParams {
  props: IGraphProps;
  dispatch: IDispatch;
  rectRef: React.RefObject<IContainerRect | undefined>;
  svgRef: React.RefObject<SVGSVGElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  propsAPI: PropsAPI<unknown, unknown, unknown>;
  featureControl: ReturnType<typeof useFeatureControl>;
  graphConfig: IGraphConfig;
  eventChannel: EventChannel;
  graphController: GraphController;
  setFocusedWithoutMouse(value: boolean): void;
  setCurHoverNode(nodeId: string | undefined): void;
  setCurHoverPort(value: [string, string] | undefined): void;
  updateViewport(): void;
}

export function useEventChannel({
  props,
  dispatch,
  rectRef,
  svgRef,
  propsAPI,
  containerRef,
  featureControl,
  graphConfig,
  setFocusedWithoutMouse,
  setCurHoverNode,
  setCurHoverPort,
  eventChannel,
  updateViewport,
  graphController
}: IUseEventChannelParams): void {
  const {
    dragThreshold = 10,
    autoAlignThreshold = DEFAULT_AUTO_ALIGN_THRESHOLD,
    getPositionFromEvent = defaultGetPositionFromEvent,
    canvasMouseMode,
    edgeWillAdd,
    defaultEdgeShape = "default"
  } = props;
  const {
    isNodesDraggable,
    isAutoAlignEnable,
    isClickNodeToSelectDisabled,
    isPanDisabled,
    isMultiSelectDisabled,
    isLassoSelectEnable,
    isConnectDisabled,
    isPortHoverViewEnable,
    isNodeEditDisabled,
    isA11yEnable
  } = featureControl;

  const animationFramedDispatch = React.useMemo(() => animationFramed(dispatch), [dispatch]);

  const keyDownHandler = useCanvasKeyboardEventHandlers({
    propsAPI,
    featureControl,
    eventChannel,
    graphConfig,
    setCurHoverNode,
    setCurHoverPort
  });

  const focusFirstNode = (e: React.KeyboardEvent) => {
    const data = propsAPI.getData();
    if (data.nodes.size > 0 && svgRef.current) {
      const firstNode = data.head && data.nodes.get(data.head);
      if (firstNode) {
        focusItem(svgRef, { node: firstNode, port: undefined }, e, eventChannel);
      }
    }
  };

  //#region edge

  const handleEdgeEvent = (event: IEvent) => {
    switch (event.type) {
      case GraphEdgeEvent.ConnectStart:
      case GraphEdgeEvent.ConnectMove:
      case GraphEdgeEvent.ConnectEnd:
      case GraphEdgeEvent.ConnectNavigate:
      case GraphEdgeEvent.Click:
      case GraphEdgeEvent.MouseEnter:
      case GraphEdgeEvent.MouseLeave:
      case GraphEdgeEvent.DoubleClick:
        dispatch(event);
        break;
      case GraphEdgeEvent.ContextMenu:
        event.rawEvent.stopPropagation();
        event.rawEvent.preventDefault();
        dispatch(event);
        break;
      default:
    }
  };

  //#endregion edge

  //#region canvas

  // eslint-disable-next-line complexity
  const handleCanvasEvent = (event: IEvent) => {
    switch (event.type) {
      case GraphCanvasEvent.ViewportResize:
      case GraphCanvasEvent.Drag:
      case GraphCanvasEvent.MouseWheelScroll:
      case GraphCanvasEvent.Zoom:
      case GraphCanvasEvent.Pinch:
      case GraphCanvasEvent.Click:
      case GraphCanvasEvent.SelectStart:
      case GraphCanvasEvent.SelectMove:
      case GraphCanvasEvent.SelectEnd:
      case GraphCanvasEvent.ResetSelection:
      case GraphCanvasEvent.Navigate:
      case GraphCanvasEvent.Paste:
      case GraphCanvasEvent.Undo:
      case GraphCanvasEvent.Redo:
      case GraphCanvasEvent.Delete:
      case GraphCanvasEvent.KeyUp:
      case GraphCanvasEvent.DraggingNodeFromItemPanelStart:
      case GraphCanvasEvent.DraggingNodeFromItemPanel:
      case GraphCanvasEvent.DraggingNodeFromItemPanelEnd:
        dispatch(event);
        break;
      case GraphCanvasEvent.Copy:
        {
          const selectedData = filterSelectedItems(propsAPI.getData());
          const clipboard = graphConfig.getClipboard();

          clipboard.write(selectedData);
        }
        break;
      case GraphCanvasEvent.KeyDown:
        if (
          !event.rawEvent.repeat &&
          event.rawEvent.target === event.rawEvent.currentTarget &&
          !event.rawEvent.shiftKey &&
          event.rawEvent.key === "Tab"
        ) {
          event.rawEvent.preventDefault();
          event.rawEvent.stopPropagation();
          setFocusedWithoutMouse(true);
          focusFirstNode(event.rawEvent);
        } else {
          keyDownHandler(event.rawEvent as React.KeyboardEvent<SVGSVGElement>);
        }
        dispatch(event);
        break;
      case GraphCanvasEvent.MouseDown:
        {
          graphController.nodeClickOnce = null;
          svgRef.current?.focus({ preventScroll: true });
          setFocusedWithoutMouse(false);
          const evt = event.rawEvent as React.MouseEvent;
          updateViewport();
          onContainerMouseDown(evt, {
            state: propsAPI.getState(),
            canvasMouseMode,
            isPanDisabled,
            isMultiSelectDisabled,
            isLassoSelectEnable,
            dragThreshold,
            containerRef,
            getPositionFromEvent: defaultGetPositionFromEvent,
            graphConfig,
            eventChannel,
            graphController
          });
        }
        break;
      case GraphCanvasEvent.MouseUp:
        if (graphController.canvasClickOnce) {
          graphController.canvasClickOnce = false;
          const evt = event.rawEvent as React.MouseEvent;
          if (evt.target instanceof Node && svgRef.current?.contains(evt.target) && evt.target.nodeName === "svg") {
            eventChannel.trigger({
              type: GraphCanvasEvent.Click,
              rawEvent: event.rawEvent
            });
          }
        }
        break;
      case GraphCanvasEvent.ContextMenu:
        event.rawEvent.preventDefault();
        event.rawEvent.stopPropagation();
        dispatch(event);
        break;
      case GraphCanvasEvent.MouseMove:
        {
          const evt = event.rawEvent as MouseEvent;
          graphController.setMouseClientPosition({
            x: evt.clientX,
            y: evt.clientY
          });
        }
        break;
      case GraphCanvasEvent.MouseLeave:
        graphController.unsetMouseClientPosition();
        graphController.canvasClickOnce = false;
        break;
      case GraphCanvasEvent.Blur:
        setFocusedWithoutMouse(false);
        break;
      default:
    }
  };

  //#endregion canvas

  //#region node
  const onNodePointerEnter = (event: INodeCommonEvent) => {
    const { node } = event;
    const { isNodeHoverViewEnabled } = featureControl;
    const behavior = graphController.getBehavior();
    switch (behavior) {
      case GraphBehavior.connecting:
      case GraphBehavior.default:
        if (isNodeHoverViewEnabled) {
          setCurHoverNode(node.id);
          setCurHoverPort(undefined);
        }
        break;
      default:
    }
    dispatch(event);
  };

  const onNodePointerLeave = (event: INodeCommonEvent) => {
    dispatch(event);
    setCurHoverNode(undefined);
  };

  const onNodeDoubleClick = (event: INodeCommonEvent) => {
    if (isNodeEditDisabled) {
      return;
    }

    event.rawEvent.stopPropagation();
    const { node } = event;

    propsAPI.updateNode(node.id, {
      state: addState(GraphNodeState.editing)(node.state)
    });
  };

  const onNodeKeyDown = (event: INodeCommonEvent) => {
    if (!svgRef || !isA11yEnable) {
      return;
    }
    const data = propsAPI.getData();
    const { node } = event;
    const evt = event.rawEvent as React.KeyboardEvent;
    switch (evt.key) {
      case "Tab":
        {
          evt.preventDefault();
          evt.stopPropagation();
          const nextItem = evt.shiftKey ? getPrevItem(data, node) : getNextItem(data, node);
          focusItem(svgRef, nextItem, evt, eventChannel);
        }
        break;
      case "ArrowUp":
        evt.preventDefault();
        evt.stopPropagation();
        focusUpNode(data, node.id, svgRef, propsAPI, evt, eventChannel);
        break;
      case "ArrowDown":
        evt.preventDefault();
        evt.stopPropagation();
        focusDownNode(data, node.id, svgRef, propsAPI, evt, eventChannel);
        break;
      case "ArrowLeft":
        evt.preventDefault();
        evt.stopPropagation();
        focusLeftNode(data, node.id, svgRef, propsAPI, evt, eventChannel);
        break;
      case "ArrowRight":
        evt.preventDefault();
        evt.stopPropagation();
        focusRightNode(data, node.id, svgRef, propsAPI, evt, eventChannel);
        break;
      default:
    }
  };

  // eslint-disable-next-line complexity
  const handleNodeEvent = (event: IEvent) => {
    switch (event.type) {
      case GraphNodeEvent.ResizingStart:
      case GraphNodeEvent.Resizing:
      case GraphNodeEvent.ResizingEnd:
      case GraphNodeEvent.DragStart:
      case GraphNodeEvent.Drag:
      case GraphNodeEvent.DragEnd:
      case GraphNodeEvent.SelectAll:
        dispatch(event);
        break;
      case GraphNodeEvent.PointerMove:
        if ((event.rawEvent as PointerEvent).pointerId === graphController.pointerId) {
          animationFramedDispatch(event);
        }
        break;
      case GraphNodeEvent.PointerDown:
        {
          graphController.nodeClickOnce = null;
          if (graphController.getBehavior() !== GraphBehavior.default) {
            return;
          }
          const evt = event.rawEvent as React.PointerEvent;
          updateViewport();
          onNodePointerDown(evt, event.node, {
            svgRef,
            rectRef,
            isNodesDraggable,
            isAutoAlignEnable,
            dragThreshold,
            getPositionFromEvent,
            isClickNodeToSelectDisabled,
            graphConfig,
            autoAlignThreshold,
            eventChannel,
            graphController
          });
        }
        break;
      case GraphNodeEvent.PointerEnter:
        onNodePointerEnter(event);
        break;
      case GraphNodeEvent.PointerLeave:
        onNodePointerLeave(event);
        break;
      case GraphNodeEvent.MouseDown:
        graphController.nodeClickOnce = null;
        event.rawEvent.preventDefault();
        if (isNodesDraggable) {
          event.rawEvent.stopPropagation();
        }
        setFocusedWithoutMouse(false);
        break;
      case GraphNodeEvent.Click:
        if (graphController.nodeClickOnce?.id === event.node.id) {
          const { currentTarget } = event.rawEvent;
          if (currentTarget instanceof SVGElement) {
            currentTarget.focus({ preventScroll: true });
          }
          event.node = graphController.nodeClickOnce;
          dispatch(event);
          graphController.nodeClickOnce = null;
        } else {
          event.intercepted = true;
        }
        break;
      case GraphNodeEvent.ContextMenu:
        event.rawEvent.preventDefault();
        event.rawEvent.stopPropagation();
        dispatch(event);
        break;
      case GraphNodeEvent.DoubleClick:
        onNodeDoubleClick(event);
        break;
      case GraphNodeEvent.KeyDown:
        onNodeKeyDown(event);
        break;
      default:
    }
  };
  //#endregion node

  //#region port
  const onPortPointerDown = React.useCallback(
    (event: IPortEvent) => {
      const evt = event.rawEvent as React.PointerEvent;
      const { node, port } = event;
      setFocusedWithoutMouse(false);
      evt.stopPropagation();
      evt.preventDefault();

      prevMouseDownPortId = `${node.id}:${port.id}`;
      prevMouseDownPortTime = performance.now();

      if (isConnectDisabled || (evt.pointerType === "mouse" && evt.button !== MouseEventButton.Primary)) {
        return;
      }
      updateViewport();
      const globalEventTarget = graphConfig.getGlobalEventTarget();
      const dragging = new DragController<PointerEvent>(
        new PointerEventProvider(globalEventTarget, evt.pointerId),
        getPositionFromEvent
      );
      dragging.onMove = ({ clientX, clientY, e }) => {
        eventChannel.trigger({
          type: GraphEdgeEvent.ConnectMove,
          rawEvent: e,
          clientX,
          clientY
        });
      };
      dragging.onEnd = ({ e }) => {
        eventChannel.trigger({
          type: GraphEdgeEvent.ConnectEnd,
          rawEvent: e,
          edgeWillAdd,
          defaultEdgeShape,
          isCancel: false
        });
        graphController.pointerId = null;
      };
      eventChannel.trigger({
        type: GraphEdgeEvent.ConnectStart,
        nodeId: node.id,
        portId: port.id,
        rawEvent: evt,
        clientPoint: {
          x: evt.clientX,
          y: evt.clientY
        }
      });
      if (evt.target instanceof Element && evt.pointerType !== "mouse") {
        evt.target.releasePointerCapture(evt.pointerId);
      }
      graphController.pointerId = evt.pointerId;
      dragging.start(evt.nativeEvent);
    },
    [
      defaultEdgeShape,
      edgeWillAdd,
      eventChannel,
      getPositionFromEvent,
      graphConfig,
      graphController,
      isConnectDisabled,
      setFocusedWithoutMouse,
      updateViewport
    ]
  );

  const onPortPointerUp = React.useCallback(
    (event: IPortEvent) => {
      const evt = event.rawEvent as PointerEvent;
      const { node, port } = event;
      // simulate port click event
      if (prevMouseDownPortId === `${node.id}:${port.id}` && performance.now() - (prevMouseDownPortTime || 0) < 500) {
        prevMouseDownPortId = undefined;
        prevMouseDownPortTime = undefined;

        eventChannel.trigger({
          type: GraphPortEvent.Click,
          node,
          port,
          rawEvent: evt
        });
      }
    },
    [eventChannel]
  );

  const onPortPointerEnter = (event: IPortEvent) => {
    const behavior = graphController.getBehavior();
    switch (behavior) {
      case GraphBehavior.default:
        setCurHoverPort([event.node.id, event.port.id]);
        break;
      default:
    }
    if (isPortHoverViewEnable) {
      setCurHoverPort([event.node.id, event.port.id]);
    }
    if ((event.rawEvent as PointerEvent).pointerId === graphController.pointerId) {
      dispatch(event);
    }
  };

  const onPortPointerLeave = (event: IPortEvent) => {
    setCurHoverPort(undefined);
    dispatch(event);
  };

  const onPortKeyDown = (event: IPortEvent) => {
    if (!isA11yEnable) {
      return;
    }
    const evt = event.rawEvent as React.KeyboardEvent;
    // nativeEvent.code not support by Edge <79, use evt.key to polyfill
    if (evt.altKey && (evt.nativeEvent.code === "KeyC" || evt.key === "c")) {
      evt.preventDefault();
      evt.stopPropagation();
      eventChannel.trigger({
        type: GraphEdgeEvent.ConnectStart,
        nodeId: event.node.id,
        portId: event.port.id,
        rawEvent: evt
      });
      return;
    }
    const data = propsAPI.getData();
    const { node, port } = event;
    switch (evt.key) {
      case "Tab":
        if (isA11yEnable && propsAPI.getGraphBehavior() === GraphBehavior.connecting) {
          evt.preventDefault();
          evt.stopPropagation();
          eventChannel.trigger({
            type: GraphEdgeEvent.ConnectNavigate,
            rawEvent: evt
          });
        } else {
          const nextItem = evt.shiftKey ? getPrevItem(data, node, port) : getNextItem(data, node, port);
          focusItem(svgRef, nextItem, evt, eventChannel);
        }
        break;
      case "ArrowUp":
      case "ArrowLeft":
        evt.preventDefault();
        evt.stopPropagation();
        focusPrevPort(node.ports ?? [], node, port.id, svgRef, evt, eventChannel);
        break;
      case "ArrowDown":
      case "ArrowRight":
        evt.preventDefault();
        evt.stopPropagation();
        focusNextPort(node.ports ?? [], node, port.id, svgRef, evt, eventChannel);
        break;
      case "g":
        evt.preventDefault();
        evt.stopPropagation();
        goToConnectedPort(data, node, port, svgRef, evt, eventChannel);
        break;
      case "Escape":
        if (propsAPI.getGraphBehavior() === GraphBehavior.connecting) {
          evt.preventDefault();
          evt.stopPropagation();
          if (svgRef.current) {
            (findDOMElement(svgRef.current, { node, port }) as SVGGElement | null)?.blur();
          }
        }
        break;
      case "Enter":
        evt.preventDefault();
        evt.stopPropagation();
        eventChannel.trigger({
          type: GraphEdgeEvent.ConnectEnd,
          rawEvent: evt.nativeEvent,
          edgeWillAdd,
          defaultEdgeShape,
          isCancel: false
        });
        break;
      default:
    }
  };

  const handlePortEvent = (event: IEvent) => {
    switch (event.type) {
      case GraphPortEvent.Click:
        dispatch(event);
        break;
      case GraphPortEvent.PointerDown:
        onPortPointerDown(event);
        break;
      case GraphPortEvent.PointerUp:
        onPortPointerUp(event);
        break;
      case GraphPortEvent.PointerEnter:
        onPortPointerEnter(event);
        break;
      case GraphPortEvent.PointerLeave:
        onPortPointerLeave(event);
        break;
      case GraphPortEvent.ContextMenu:
        event.rawEvent.preventDefault();
        event.rawEvent.stopPropagation();
        dispatch(event);
        break;
      case GraphPortEvent.Focus:
        event.rawEvent.stopPropagation();
        dispatch(event);
        break;
      case GraphPortEvent.Blur:
        if (graphController.getBehavior() === GraphBehavior.connecting) {
          eventChannel.trigger({
            type: GraphEdgeEvent.ConnectEnd,
            rawEvent: (event.rawEvent as React.FocusEvent).nativeEvent,
            defaultEdgeShape,
            edgeWillAdd,
            isCancel: true
          });
        }
        break;
      case GraphPortEvent.KeyDown:
        onPortKeyDown(event);
        break;
      default:
    }
  };
  //#endregion port

  const handleEvent = (event: IEvent) => {
    const behavior = handleBehaviorChange(graphController.getBehavior(), event);
    graphController.setBehavior(behavior);
    handleEdgeEvent(event);
    handleCanvasEvent(event);
    handleNodeEvent(event);
    handlePortEvent(event);

    //#region other events
    switch (event.type) {
      case GraphMinimapEvent.Pan:
      case GraphScrollBarEvent.Scroll:
      case GraphContextMenuEvent.Open:
      case GraphContextMenuEvent.Close:
        dispatch(event);
        break;
      default:
    }
    //#endregion other events
  };

  React.useImperativeHandle(eventChannel.listenersRef, () => handleEvent);
  React.useImperativeHandle(eventChannel.externalHandlerRef, () => props.onEvent);
}
