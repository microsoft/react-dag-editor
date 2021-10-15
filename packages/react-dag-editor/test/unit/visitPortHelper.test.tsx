import * as React from "react";
import { cleanup, render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { VisitPortHelper } from "../../src/components/A11yHelpers/VisitPortHelper";
import { getNeighborPorts, GraphModel } from "../../src";
import { getSample4Data } from "./__data__/getSample4Data";

describe("test VisitPortHelper", () => {
  afterEach(cleanup);

  const data = GraphModel.fromJSON(getSample4Data());
  // let onCompleteSpy;

  it("the port has no neighbor port", () => {
    const neighborPorts = getNeighborPorts(data, "24a8e253", "port-2");
    const { container } = render(<VisitPortHelper neighborPorts={neighborPorts} onComplete={jest.fn()} data={data} />);
    expect(container).toMatchSnapshot();
  });

  it("the port has one neighbor port", () => {
    const neighborPorts = getNeighborPorts(data, "24a8e253", "port-1");
    const { container } = render(<VisitPortHelper neighborPorts={neighborPorts} onComplete={jest.fn()} data={data} />);
    expect(container).toMatchSnapshot();
  });

  it("the port has multi neighbor ports", () => {
    const onComplete = jest.fn();

    const neighborPorts = getNeighborPorts(data, "8b2714dd", "port-1");
    const { container } = render(<VisitPortHelper neighborPorts={neighborPorts} onComplete={onComplete} data={data} />);
    expect(container).toMatchSnapshot();

    const selectEl = container.querySelector("select")!;
    expect(selectEl?.length).toBe(3);

    act(() => {
      fireEvent.change(selectEl, {
        target: {
          value: JSON.stringify({
            nodeId: "fc9f8703",
            portId: "port-0"
          })
        }
      });
    });
    act(() => {
      fireEvent.keyDown(selectEl, {
        key: "Escape"
      });
    });

    expect(onComplete).toBeCalledWith({ nodeId: "fc9f8703", portId: "port-0" });
  });
});
