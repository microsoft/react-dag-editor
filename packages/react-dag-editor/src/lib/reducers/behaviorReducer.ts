import { IGraphReactReducer } from "../contexts";
import { GraphCanvasEvent, GraphEdgeEvent, GraphNodeEvent, IEvent } from "../models/event";
import { GraphBehavior } from "../models/state";

/**
 * this function is used both in useEventChannel and behaviorReducer to share the same logic
 */
export const handleBehaviorChange = (prevBehavior: GraphBehavior, event: IEvent): GraphBehavior => {
  switch (event.type) {
    case GraphNodeEvent.DragStart:
      return GraphBehavior.Dragging;
    case GraphEdgeEvent.ConnectStart:
      return GraphBehavior.Connecting;
    case GraphCanvasEvent.SelectStart:
      return GraphBehavior.MultiSelect;
    case GraphCanvasEvent.DragStart:
      return GraphBehavior.Panning;
    case GraphCanvasEvent.DraggingNodeFromItemPanelStart:
      return GraphBehavior.AddingNode;
    case GraphNodeEvent.DragEnd:
    case GraphEdgeEvent.ConnectEnd:
    case GraphCanvasEvent.SelectEnd:
    case GraphCanvasEvent.DragEnd:
    case GraphCanvasEvent.DraggingNodeFromItemPanelEnd:
      return GraphBehavior.Default;
    default:
      return prevBehavior;
  }
};

export const behaviorReducer: IGraphReactReducer = (prevState, action) => {
  const nextBehavior = handleBehaviorChange(prevState.behavior, action);

  if (nextBehavior === prevState.behavior) {
    return prevState;
  }

  return {
    ...prevState,
    behavior: nextBehavior,
  };
};
