import { IPoint, Direction, IViewport, ITransformMatrix, EMPTY_TRANSFORM_MATRIX } from "../../index";
import { focusArea, pan, scrollIntoView, zoom as zoomImpl, zoomTo as zoomToImpl } from "../../lib/utils";
import { identical } from "../../lib/utils/identical";
import { mockClientRect } from "../utils";

const zoomTo = (anchor: IPoint, transformMatrix: ITransformMatrix, direction?: Direction) => {
  return zoomToImpl({
    scale: 0.5,
    anchor,
    limitScale: identical,
    direction,
  })({ transformMatrix });
};

describe("test zoomTo", () => {
  const anchor: IPoint = {
    x: 100,
    y: 100,
  };

  it("should zoom to", () => {
    expect(zoomTo(anchor, [1, 0, 0, 1, 50, 50])).toEqual({
      transformMatrix: [0.5, 0, 0, 0.5, 75, 75],
    });
  });

  it("should zoom x", () => {
    expect(zoomTo(anchor, [1, 0, 0, 1, 50, 50], Direction.X)).toEqual({
      transformMatrix: [0.5, 0, 0, 1, 75, 50],
    });
  });

  it("should zoom y", () => {
    expect(zoomTo(anchor, [1, 0, 0, 1, 50, 50], Direction.Y)).toEqual({
      transformMatrix: [1, 0, 0, 0.5, 50, 75],
    });
  });

  it("should noop", () => {
    expect(zoomTo(anchor, [0.5, 0, 0, 0.5, 25, 25])).toEqual({
      transformMatrix: [0.5, 0, 0, 0.5, 25, 25],
    });
  });
});

describe("test zoomToWithoutPan", () => {
  const anchor: IPoint = {
    x: 0,
    y: 0,
  };
  it("should zoom to along x and y directions without pan", () => {
    expect(zoomTo(anchor, [1, 0, 0, 1, 50, 50])).toEqual({
      transformMatrix: [0.5, 0, 0, 0.5, 25, 25],
    });
  });

  it("should zoom x", () => {
    expect(zoomTo(anchor, [1, 0, 0, 1, 50, 50], Direction.X)).toEqual({
      transformMatrix: [0.5, 0, 0, 1, 25, 50],
    });
  });

  it("should zoom y", () => {
    expect(zoomTo(anchor, [1, 0, 0, 1, 50, 50], Direction.Y)).toEqual({
      transformMatrix: [1, 0, 0, 0.5, 50, 25],
    });
  });

  it("should noop", () => {
    expect(zoomTo(anchor, [0.5, 0, 0, 0.5, 25, 25])).toEqual({
      transformMatrix: [0.5, 0, 0, 0.5, 25, 25],
    });
  });
});

describe("test zoom", () => {
  const anchor: IPoint = {
    x: 100,
    y: 100,
  };

  const zoom = (scale: number, transformMatrix: ITransformMatrix, direction?: Direction) => {
    return zoomImpl({
      scale,
      anchor,
      direction,
      limitScale: identical,
    })({ transformMatrix });
  };

  it("should zoom", () => {
    expect(zoom(0.5, [1, 0, 0, 1, 50, 50])).toEqual({
      transformMatrix: [0.5, 0, 0, 0.5, 75, 75],
    });
  });

  it("should zoom x", () => {
    expect(zoom(0.5, [1, 0, 0, 1, 50, 50], Direction.X)).toEqual({
      transformMatrix: [0.5, 0, 0, 1, 75, 50],
    });
  });

  it("should zoom y", () => {
    expect(zoom(0.5, [1, 0, 0, 1, 50, 50], Direction.Y)).toEqual({
      transformMatrix: [1, 0, 0, 0.5, 50, 75],
    });
  });

  it("should noop", () => {
    expect(zoom(1, [0.5, 0, 0, 0.5, 25, 25])).toEqual({
      transformMatrix: [0.5, 0, 0, 0.5, 25, 25],
    });
  });
});

describe("test scrollIntoView", () => {
  const rect: DOMRect | ClientRect = {
    ...mockClientRect,
    bottom: 200,
    height: 200,
    left: 0,
    right: 200,
    top: 0,
    width: 200,
  };

  it("should scroll", () => {
    expect(scrollIntoView(150, 150, rect, true)({ transformMatrix: [1, 0, 0, 1, 50, 50] })).toEqual({
      transformMatrix: [1, 0, 0, 1, 0, 0],
    });
  });

  it("should not scroll", () => {
    expect(scrollIntoView(150, 150, rect)({ transformMatrix: [1, 0, 0, 1, 50, 50] })).toEqual({
      transformMatrix: [1, 0, 0, 1, 50, 50],
    });
  });
});

describe("test focusArea", () => {
  const rect: DOMRect | ClientRect = {
    ...mockClientRect,
    bottom: 200,
    height: 200,
    left: 0,
    right: 200,
    top: 0,
    width: 200,
  };

  const viewport: Required<IViewport> = {
    rect,
    transformMatrix: EMPTY_TRANSFORM_MATRIX,
  };

  it("should focus", () => {
    expect(focusArea(100, 100, 150, 150, viewport)).toEqual({
      rect,
      transformMatrix: [4, 0, 0, 4, -400, -400],
    });
  });
});

describe("test pan", () => {
  it("should pan", () => {
    expect(pan(10, 10)({ transformMatrix: [1, 0, 0, 1, 50, 50] })).toEqual({
      transformMatrix: [1, 0, 0, 1, 60, 60],
    });
  });
});
