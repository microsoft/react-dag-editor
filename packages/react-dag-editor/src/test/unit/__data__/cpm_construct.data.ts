import { Task } from "../../../lib/utils/gantt/cpm";
import { inputData, outputData } from "./cpm_sample1.data";

/**
 *  construct "Critical Path Method" test data
 */

const constructInputData = (): Set<Task> => {
  const getSuccessors = (names: string[], allTasksMap: Map<string, Task>): Set<Task> => {
    const successors = new Set<Task>();

    names.forEach(name => {
      const task = allTasksMap.get(name);
      if (task) {
        successors.add(task);
      }
    });

    return successors;
  };

  const allTasks = new Set<Task>();
  const curAllTasksMap = new Map<string, Task>();

  inputData.forEach(item => {
    allTasks?.forEach(t => {
      if (!curAllTasksMap.has(t.name)) {
        curAllTasksMap.set(t.name, t);
      }
    });

    const task = new Task(item.name, item.cost, getSuccessors(item.dependencies, curAllTasksMap));
    allTasks.add(task);
  });

  return allTasks;
};

const tasksInputTestData = constructInputData();
export { tasksInputTestData };

const constructOutputData = (): Task => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSuccessorsSet = (task: any): Set<Task> => {
    const dependenciesSet = new Set<Task>();
    const dependencies = task.dependencies;

    if (dependencies.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dependencies.forEach((d: any) => {
        const t = new Task(d.name, d.cost);
        t.earlyFinish = d.earlyFinish;
        t.criticalCost = d.criticalCost;
        t.latestStart = d.latestStart;
        t.latestFinish = d.latestFinish;
        t.earlyStart = d.earlyStart;
        t.dependencies = getSuccessorsSet(d);
        dependenciesSet.add(t);
      });
    }

    return dependenciesSet;
  };

  const path = new Task(outputData.name, outputData.cost, getSuccessorsSet(outputData));
  path.earlyStart = outputData.earlyStart;
  path.earlyFinish = outputData.earlyFinish;
  path.latestStart = outputData.latestStart;
  path.latestFinish = outputData.latestFinish;
  path.criticalCost = outputData.criticalCost;

  return path;
};

const outputTestData = constructOutputData();
export { outputTestData };
