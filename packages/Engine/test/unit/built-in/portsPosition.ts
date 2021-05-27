import { applyHorizontalGraphPortsPosition, ICanvasPort } from "../../../src";

describe("test applyHorizontalGraphPortsPosition", () => {
  it("should return ports", () => {
    const portsWithPos = applyHorizontalGraphPortsPosition([
      {
        id: "0",
        name: "port",
        isInputDisabled: false,
        isOutputDisabled: true
      },
      {
        id: "1",
        name: "port",
        isInputDisabled: true,
        isOutputDisabled: false
      }
    ]);
    const expectedPorts: ICanvasPort[] = [
      {
        id: "0",
        name: "port",
        position: [0, 0.5],
        isInputDisabled: false,
        isOutputDisabled: true
      },
      {
        id: "1",
        name: "port",
        position: [1, 0.5],
        isInputDisabled: true,
        isOutputDisabled: false
      }
    ];
    expect(portsWithPos).toEqual(expectedPorts);
  });
});
