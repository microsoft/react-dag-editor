import { v4 as uuid } from "uuid";
import { GraphEdgeEvent, GraphNodeEvent, GraphPortEvent } from "../common/GraphEvent.constant";
import { EMPTY_CONNECT_STATE, IGraphState } from "../contexts/GraphStateContext";
import { GraphEdgeState, GraphPortState, ICanvasEdge } from "../Graph.interface";
import {
  addState,
  getNearestConnectablePort,
  isConnectable,
  isViewPortComplete,
  pushHistory,
  removeState,
  resetState,
  unSelectAllEntity,
  updateState
} from "../utils";
import { nextConnectablePort } from "../utils/a11yUtils";
import { graphController } from "../utils/graphController";
import { IBuiltinReducer } from "./builtinReducer.type";

function attachPort(state: IGraphState, nodeId: string, portId: string): IGraphState {
  if (!state.connectState) {
    return state;
  }
  let data = state.data.present;
  data = data.updatePort(nodeId, portId, updateState(addState(GraphPortState.connectingAsTarget)));
  if (state.connectState.targetNode && state.connectState.targetPort) {
    data = data.updatePort(
      state.connectState.targetNode,
      state.connectState.targetPort,
      updateState(removeState(GraphPortState.connectingAsTarget))
    );
  }
  return {
    ...state,
    connectState: {
      ...state.connectState,
      targetNode: nodeId,
      targetPort: portId
    },
    data: {
      ...state.data,
      present: data
    }
  };
}

function clearAttach(state: IGraphState): IGraphState {
  if (!state.connectState) {
    return state;
  }
  let data = state.data.present;
  const { targetPort, targetNode } = state.connectState;
  if (targetNode && targetPort) {
    data = data.updatePort(targetNode, targetPort, updateState(removeState(GraphPortState.connectingAsTarget)));
  }
  return {
    ...state,
    connectState: {
      ...state.connectState,
      targetNode: undefined,
      targetPort: undefined
    },
    data: {
      ...state.data,
      present: data
    }
  };
}

// eslint-disable-next-line complexity
export const connectingReducer: IBuiltinReducer = (state, action, context): IGraphState => {
  if (!isViewPortComplete(state.viewport)) {
    return state;
  }
  const { rect } = state.viewport;
  switch (action.type) {
    case GraphEdgeEvent.ConnectStart:
      return {
        ...state,
        connectState: {
          ...EMPTY_CONNECT_STATE,
          sourceNode: action.nodeId,
          sourcePort: action.portId,
          movingPoint: action.clientPoint
            ? {
                x: action.clientPoint.x - rect.left,
                y: action.clientPoint.y - rect.top
              }
            : undefined
        },
        data: {
          ...state.data,
          present: state.data.present.updatePort(
            action.nodeId,
            action.portId,
            updateState(addState(GraphPortState.connecting))
          )
        }
      };
    case GraphEdgeEvent.ConnectMove:
      if (state.connectState) {
        return {
          ...state,
          connectState: {
            ...state.connectState,
            movingPoint: {
              x: action.clientX - rect.left,
              y: action.clientY - rect.top
            }
          }
        };
      }
      return state;
    case GraphEdgeEvent.ConnectEnd:
      if (state.connectState) {
        const { edgeWillAdd, defaultEdgeShape, isCancel } = action;
        const { sourceNode, sourcePort, targetNode, targetPort } = state.connectState;
        let data = state.data.present;
        data = data.updatePort(sourceNode, sourcePort, updateState(resetState(GraphPortState.default)));
        if (!isCancel && targetNode && targetPort) {
          let edge: ICanvasEdge = {
            source: sourceNode,
            sourcePortId: sourcePort,
            target: targetNode,
            targetPortId: targetPort,
            id: uuid(),
            shape: defaultEdgeShape,
            state: GraphEdgeState.default
          };
          if (edgeWillAdd) {
            edge = edgeWillAdd(edge, data);
          }
          data = data
            .insertEdge(edge)
            .updatePort(targetNode, targetPort, updateState(resetState(GraphPortState.default)));
          return {
            ...state,
            connectState: undefined,
            data: pushHistory(state.data, data, unSelectAllEntity())
          };
        }
        return {
          ...state,
          connectState: undefined,
          data: {
            ...state.data,
            present: data
          }
        };
      }
      return state;
    case GraphEdgeEvent.ConnectNavigate:
      if (state.connectState) {
        const data = state.data.present;
        const sourceNode = data.nodes.get(state.connectState.sourceNode);
        const sourcePort = sourceNode?.getPort(state.connectState.sourcePort);
        const targetNode = state.connectState.targetNode ? data.nodes.get(state.connectState.targetNode) : undefined;
        const targetPort = state.connectState.targetPort
          ? targetNode?.getPort(state.connectState.targetPort)
          : undefined;
        if (!sourceNode || !sourcePort) {
          return state;
        }
        const next = nextConnectablePort(context.graphConfig, {
          anotherNode: sourceNode,
          anotherPort: sourcePort
        })(data, targetNode || sourceNode, targetPort);
        if (!next.node || !next.port || (next.node.id === sourceNode.id && next.port.id === sourcePort.id)) {
          return state;
        }
        return attachPort(state, next.node.id, next.port.id);
      }
      return state;
    case GraphPortEvent.PointerEnter:
      if (state.connectState && (action.rawEvent as PointerEvent).pointerId === graphController.pointerId) {
        const { sourceNode, sourcePort } = state.connectState;
        const data = state.data.present;
        const node = data.nodes.get(action.node.id);
        const port = node?.getPort(action.port.id);
        const anotherNode = data.nodes.get(sourceNode);
        const anotherPort = anotherNode?.getPort(sourcePort);
        if (
          node &&
          port &&
          anotherNode &&
          anotherPort &&
          isConnectable(context.graphConfig, {
            parentNode: node,
            model: port,
            data,
            anotherPort,
            anotherNode
          })
        ) {
          return attachPort(state, node.id, port.id);
        }
      }
      return state;
    case GraphNodeEvent.PointerEnter:
    case GraphNodeEvent.PointerMove:
      if (state.connectState && (action.rawEvent as PointerEvent).pointerId === graphController.pointerId) {
        const { clientX, clientY } = action.rawEvent as PointerEvent;
        const { sourceNode, sourcePort } = state.connectState;
        const data = state.data.present;
        const node = data.nodes.get(action.node.id);
        const anotherNode = data.nodes.get(sourceNode);
        const anotherPort = anotherNode?.getPort(sourcePort);
        if (node && anotherNode && anotherPort) {
          const targetPort = getNearestConnectablePort({
            parentNode: node,
            clientX,
            clientY,
            graphConfig: context.graphConfig,
            data: state.data.present,
            viewport: state.viewport,
            anotherPort,
            anotherNode
          });
          if (!targetPort) {
            return state;
          }
          return attachPort(state, node.id, targetPort.id);
        }
      }
      return state;
    case GraphNodeEvent.PointerLeave:
      if (state.connectState?.targetNode === action.node.id) {
        return clearAttach(state);
      }
      return state;
    case GraphPortEvent.PointerLeave:
      if (state.connectState?.targetNode === action.node.id && state.connectState?.targetPort === action.port.id) {
        return clearAttach(state);
      }
      return state;
    default:
      return state;
  }
};
