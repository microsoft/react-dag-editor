/**
 * Critical path method
 */

let maxCost: number;

export class Task {
  public name: string;
  // the earliest start
  public earlyStart = 0;
  // the earliest finish
  public earlyFinish: number;
  // the latest start
  public latestStart = 0;
  // the latest finish
  public latestFinish = 0;
  // the actual cost of the task
  public cost: number;
  // the cost of the task along the critical path
  public criticalCost = 0;
  // the tasks on which this task is dependant
  public dependencies = new Set<Task>();

  public constructor(name: string, cost: number, dependencies?: Set<Task>) {
    this.name = name;
    this.cost = cost;
    dependencies?.forEach(t => {
      this.dependencies.add(t);
    });
    this.earlyFinish = -1;
  }

  public isDependent(t: Task): boolean {
    if (this.dependencies.has(t)) {
      return true;
    }
    return Array.from(this.dependencies).some(dep => dep.isDependent(t));
  }
}

export const criticalPath = (tasks: Set<Task>): Task => {
  const completed = new Set<Task>();
  const remaining = new Set<Task>(tasks);

  // while there are tasks whose critical cost isn't calculated.
  while (remaining.size !== 0) {
    let progress = false;

    // find a new task to calculate
    remaining.forEach(task => {
      if (containAll(completed, task.dependencies)) {
        let critical = 0;
        task.dependencies.forEach(t => {
          if (t.criticalCost > critical) {
            critical = t.criticalCost;
          }
        });
        task.criticalCost = critical + task.cost;
        completed.add(task);
        remaining.delete(task);
        progress = true;
      }
    });
    if (!progress) {
      throw new Error("Cyclic dependency, algorithm stopped!");
    }
  }

  getMaxCost(tasks);
  calculateEarly(tasks);

  // get the tasks
  const ret = Array.from(completed);
  ret.sort((o1: Task, o2: Task) => {
    const i = o2.criticalCost - o1.criticalCost;
    if (i !== 0) {
      return i;
    }
    if (o1.isDependent(o2)) {
      return -1;
    }
    if (o2.isDependent(o1)) {
      return 1;
    }
    return 0;
  });

  return ret[0];
};

const setEarly = (task: Task) => {
  const completionTime = task.earlyFinish;
  task.dependencies.forEach(t => {
    if (completionTime >= t.earlyStart) {
      t.earlyStart = completionTime;
      t.earlyFinish = completionTime + t.cost;
    }
    setEarly(t);
  });
};

const setLatest = (task: Task) => {
  task.latestStart = maxCost - task.criticalCost;
  task.latestFinish = task.latestStart + task.cost;
};

const calculateEarly = (tasks: Set<Task>) => {
  tasks.forEach(t => {
    t.earlyStart = 0;
    t.earlyFinish = t.cost;
    setEarly(t);
  });
};

const getMaxCost = (tasks: Set<Task>) => {
  let max = -1;
  tasks.forEach(t => {
    if (t.criticalCost > max) {
      max = t.criticalCost;
    }
  });
  maxCost = max;
  tasks.forEach(t => {
    setLatest(t);
  });
};

const containAll = <T>(AllItems: Set<T>, items: Set<T>): boolean => {
  return Array.from(items).every(item => AllItems.has(item));
};
