import { ICanvasPort, ICanvasPortInit } from "../models/port";

export function applyHorizontalGraphPortsPosition<T>(
  list: ReadonlyArray<ICanvasPortInit<T>>
): Array<ICanvasPort<T>> {
  const inputPorts = list.filter(p => !p.isInputDisabled);
  const outputPorts = list.filter(p => !p.isOutputDisabled);
  const inputPortsCount = inputPorts.length;
  const outputPortsCount = outputPorts.length;
  const inputPortsInterval = 1 / (inputPortsCount + 1);
  const outputPortsInterval = 1 / (outputPortsCount + 1);
  const res: Array<ICanvasPort<T>> = [];

  for (let i = 0; i < inputPortsCount; i += 1) {
    res.push({
      ...inputPorts[i],
      position: [0, (i + 1) * inputPortsInterval] // input port relative position for horizontal graph
    });
  }

  for (let i = 0; i < outputPortsCount; i += 1) {
    res.push({
      ...outputPorts[i],
      position: [1, (i + 1) * outputPortsInterval] // output port relative position for horizontal graph
    });
  }

  return res;
}
