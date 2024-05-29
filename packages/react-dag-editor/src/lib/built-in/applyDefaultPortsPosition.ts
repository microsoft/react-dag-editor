import { ICanvasPort, ICanvasPortInit } from "../models/port";

export function applyDefaultPortsPosition<T>(list: ReadonlyArray<ICanvasPortInit<T>>): Array<ICanvasPort<T>> {
  const inputPorts = list.filter(p => !p.isInputDisabled);
  const outputPorts = list.filter(p => p.isInputDisabled);
  const inputPortsCount = inputPorts.length;
  const outputPortsCount = outputPorts.length;
  const inputPortsInterval = 1 / (inputPortsCount + 1);
  const outputPortsInterval = 1 / (outputPortsCount + 1);
  const res: Array<ICanvasPort<T>> = [];

  for (let i = 0; i < inputPortsCount; i += 1) {
    res.push({
      ...inputPorts[i],
      position: [(i + 1) * inputPortsInterval, 0],
    });
  }

  for (let i = 0; i < outputPortsCount; i += 1) {
    const port = outputPorts[i];
    res.push({
      ...port,
      position: [(i + 1) * outputPortsInterval, 1],
    });
  }

  return res;
}
