import { ICanvasEdge, ICanvasNode } from "../../Graph.interface";
import { ICanvasData } from "../../index";
import { criticalPath, Task } from "./cpm";
import { getTopoSortingNodes } from "./getTopoSortingNodes";

export interface IDuration {
  nodeId: string;
  duration: number;
}

export const getCriticalPath = (
  canvasData: ICanvasData,
  durations: Map<string, number>,
  isNodesSorted?: boolean
): Map<string, { task: Task; isCritical?: boolean }> => {
  const { edges } = canvasData;
  const nodesSorted: ICanvasNode[] = isNodesSorted ? [...canvasData.nodes] : getTopoSortingNodes(canvasData);

  const allTasks = new Set<Task>();
  const curAllTasksMap = new Map<string, Task>();

  nodesSorted.reverse().forEach(node => {
    allTasks?.forEach(t => {
      if (!curAllTasksMap.has(t.name)) {
        curAllTasksMap.set(t.name, t);
      }
    });

    const task = new Task(node.id, durations.get(node.id) || 0, getSuccessors(node.id, edges, curAllTasksMap));
    allTasks.add(task);
  });

  const path = criticalPath(allTasks);

  const result = new Map<string, { task: Task; isCritical?: boolean }>();
  markCriticalPath(path, result, true);

  return result;
};

export const markCriticalPath = (
  path: Task,
  ret: Map<string, { task: Task; isCritical?: boolean }>,
  isCritical = true,
  parentTask?: Task
): void => {
  // set as critical, only if it's parent task is in the critical path
  if (isCritical && (!parentTask || ret.get(parentTask.name)?.isCritical)) {
    ret.set(path.name, { task: path, isCritical });
  } else if (!ret.has(path.name)) {
    ret.set(path.name, { task: path, isCritical: false });
  }
  const { dependencies } = path;

  if (dependencies.size) {
    const criticalCostTask = getMaxCriticalCostTask(path.dependencies);
    markCriticalPath(criticalCostTask, ret, true, path);

    dependencies.forEach(t => {
      if (criticalCostTask.name !== t.name) {
        markCriticalPath(t, ret, false, path);
      }
    });
  }
};

// get max "criticalCost" task among the dependencies
const getMaxCriticalCostTask = (tasks: Set<Task>): Task => {
  let max = -Infinity;
  let criticalTask: Task = tasks.values().next().value;

  tasks.forEach(t => {
    if (t.criticalCost > max) {
      max = t.criticalCost;
      criticalTask = t;
    }
  });

  return criticalTask;
};

// get successor dependencies
const getSuccessors = (nodeId: string, edges: readonly ICanvasEdge[], allTasksMap: Map<string, Task>): Set<Task> => {
  const successors = new Set<Task>();

  edges.forEach(e => {
    if (nodeId === e.source) {
      const task = allTasksMap.get(e.target);
      if (task) {
        successors.add(task);
      }
    }
  });

  return successors;
};
