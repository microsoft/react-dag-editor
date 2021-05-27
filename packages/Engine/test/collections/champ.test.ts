import { bitCount, BitmapIndexedNode, bitPosFrom, HashCollisionNode, indexFrom } from "../../src/collections/champ";

const hashCollision = () =>
  new BitmapIndexedNode(
    0,
    0,
    1,
    [],
    [],
    [
      new BitmapIndexedNode(
        0,
        0,
        1,
        [],
        [],
        [
          new BitmapIndexedNode(
            0,
            0,
            1,
            [],
            [],
            [
              new BitmapIndexedNode(
                0,
                0,
                1,
                [],
                [],
                [
                  new BitmapIndexedNode(
                    0,
                    0,
                    1,
                    [],
                    [],
                    [new BitmapIndexedNode(0, 0, 1, [], [], [new HashCollisionNode(0, 0, [0, 1], [0, 1])], [], 2)],
                    [],
                    2
                  )
                ],
                [],
                2
              )
            ],
            [],
            2
          )
        ],
        [],
        2
      )
    ],
    [],
    2
  );

describe("test utils", () => {
  it("should return correct hamming weight", () => {
    expect(bitCount(0xffffffff)).toBe(32);
    expect(bitCount(0)).toBe(0);
    expect(bitCount(0xf0000000)).toBe(4);
    expect(bitCount(0x70000000)).toBe(3);
  });

  it("should get bit pos", () => {
    expect(bitPosFrom(0b111)).toEqual(0b10000000);
  });

  it("should get index from bit pos", () => {
    expect(indexFrom(0xffffffff, 0b10, 0b100)).toEqual(2);
    expect(indexFrom(0b1, 0b10, 0b100)).toEqual(1);
  });
});

describe("test get", () => {
  it("should get value", () => {
    const node = new BitmapIndexedNode(1, 0b11, 0, [0, 1], [0, 1], [], [0, 1], 2);
    const result = node.get(1, 1, 0);
    expect(result).toBe(1);
  });

  it("should get nothing", () => {
    const node = new BitmapIndexedNode(1, 0b11, 0, [0, 1], [0, 1], [], [0, 1], 2);
    expect(node.get(3, 1, 0)).toBeUndefined();
    expect(node.get(1, 3, 0)).toBeUndefined();
  });

  it("should get from child node", () => {
    const node = hashCollision();
    expect(node.get(1, 0, 0)).toBe(1);
    expect(node.get(2, 0, 0)).toBeUndefined();
  });
});

describe("test update", () => {
  it("should insert two value", () => {
    const node = BitmapIndexedNode.empty<number, number>(0);
    const next = node.insert(1, 0, 0, 0, 0);
    next.insert(1, 1, 1, 1, 0);
    expect(node).not.toBe(next);
    expect(next).toEqual(new BitmapIndexedNode(1, 0b11, 0, [0, 1], [0, 1], [], [0, 1], 2));
  });

  it("should do nothing if value is the same", () => {
    const node = BitmapIndexedNode.empty<number, number>(0);
    node.insert(0, 0, 0, 0, 0);
    node.insert(0, 1, 1, 1, 0);
    const next = node.update(1, 1, () => 1, 1, 0);
    expect(next).toBe(node);
    expect(next).toEqual(new BitmapIndexedNode(0, 0b11, 0, [0, 1], [0, 1], [], [0, 1], 2));
  });

  it("should copy on write", () => {
    const node = BitmapIndexedNode.empty<number, number>(0);
    node.insert(0, 0, 0, 0, 0);
    node.insert(0, 1, 1, 1, 0);
    const next = node.update(1, 1, () => 10, 1, 0);
    expect(next).not.toBe(node);
    expect(next).toEqual(new BitmapIndexedNode(1, 0b11, 0, [0, 1], [0, 10], [], [0, 1], 2));
  });

  it("should transform from value to node", () => {
    const node = BitmapIndexedNode.empty<number, number>(0);
    node.insert(0, 0, 0, 0, 0);
    node.insert(0, 1, 1, 1, 0);
    const next = node.insert(1, 0b100001, 0b100001, 0b100001, 0);
    expect(next).toEqual(
      new BitmapIndexedNode(
        1,
        0b1,
        0b10,
        [0],
        [0],
        [new BitmapIndexedNode(1, 0b11, 0, [1, 0b100001], [1, 0b100001], [], [1, 0b100001], 2)],
        [0],
        3
      )
    );
  });

  it("should ordered by hash", () => {
    const node = BitmapIndexedNode.empty<number, number>(0);
    node.insert(0, 0, 0, 0, 0);
    node.insert(0, 0b100001, 0b100001, 0b100001, 0);
    const next = node.insert(1, 1, 1, 1, 0);
    expect(next).toEqual(
      new BitmapIndexedNode(
        1,
        0b1,
        0b10,
        [0],
        [0],
        [new BitmapIndexedNode(1, 0b11, 0, [1, 0b100001], [1, 0b100001], [], [1, 0b100001], 2)],
        [0],
        3
      )
    );
  });

  it("should update value in sub node", () => {
    const node = new BitmapIndexedNode(
      0,
      0b1,
      0b10,
      [0],
      [0],
      [new BitmapIndexedNode(0, 0b11, 0, [1, 0b100001], [1, 0b100001], [], [1, 0b100001], 2)],
      [0],
      3
    );
    expect(node.update(1, 1, () => 10, 1, 0)).toEqual(
      new BitmapIndexedNode(
        1,
        0b1,
        0b10,
        [0],
        [0],
        [new BitmapIndexedNode(1, 0b11, 0, [1, 0b100001], [10, 0b100001], [], [1, 0b100001], 2)],
        [0],
        3
      )
    );
  });

  it("should not copy if child node not changed", () => {
    const node = new BitmapIndexedNode(
      0,
      0b1,
      0b10,
      [0],
      [0],
      [new BitmapIndexedNode(0, 0b11, 0, [1, 0b100001], [1, 0b100001], [], [1, 0b100001], 2)],
      [0],
      3
    );
    const next = node.update(1, 1, () => 1, 1, 0);
    expect(next).toBe(node);
    expect(next).toEqual(
      new BitmapIndexedNode(
        0,
        0b1,
        0b10,
        [0],
        [0],
        [new BitmapIndexedNode(0, 0b11, 0, [1, 0b100001], [1, 0b100001], [], [1, 0b100001], 2)],
        [0],
        3
      )
    );
  });

  it("should insert hash collision node", () => {
    const node = BitmapIndexedNode.empty(0);
    node.insert(0, 0, 0, 0, 0);
    node.insert(0, 1, 1, 0, 0);
    expect(node).toEqual(hashCollision());
  });
});

describe("test remove", () => {
  it("should remove value", () => {
    const node = new BitmapIndexedNode(0, 0b11, 0, [0, 1], [0, 1], [], [0, 1], 2);
    const next = node.remove(1, 1, 1, 0);
    expect(next).toEqual([new BitmapIndexedNode(1, 0b1, 0, [0], [0], [], [0], 1), 1]);
  });

  it("should remove from child node", () => {
    const node = hashCollision();
    const next = node.remove(1, 1, 0, 0);
    expect(next).toEqual([new BitmapIndexedNode(1, 1, 0, [0], [0], [], [0], 1), 1]);
  });

  it("should remove child into single value", () => {
    const node = new BitmapIndexedNode(
      0,
      0,
      0b10,
      [],
      [],
      [new BitmapIndexedNode(0, 0b11, 0, [1, 0b100001], [1, 0b100001], [], [1, 0b100001], 2)],
      [],
      2
    );
    const next = node.remove(1, 0b100001, 0b100001, 0);
    expect(next).toEqual([new BitmapIndexedNode(1, 0b10, 0, [1], [1], [], [1], 1), 0b100001]);
  });

  it("should migrate sub node to value", () => {
    const node = new BitmapIndexedNode(
      0,
      0b1,
      0b10,
      [0],
      [0],
      [new BitmapIndexedNode(0, 0b11, 0, [1, 0b100001], [1, 0b100001], [], [1, 0b100001], 2)],
      [0],
      3
    );
    const next = node.remove(1, 0b100001, 0b100001, 0);
    expect(next).toEqual([new BitmapIndexedNode(1, 0b11, 0, [0, 1], [0, 1], [], [0, 1], 2), 0b100001]);
  });

  it("should update child node on remove", () => {
    const node = new BitmapIndexedNode(
      0,
      0b1,
      0b10,
      [0],
      [0],
      [
        new BitmapIndexedNode(
          0,
          0b1011,
          0,
          [1, 0b100001, 0b1100001],
          [1, 0b100001, 0b1100001],
          [],
          [1, 0b100001, 0b1100001],
          3
        )
      ],
      [0],
      4
    );
    const next = node.remove(1, 0b1100001, 0b1100001, 0);
    expect(next).toEqual([
      new BitmapIndexedNode(
        1,
        0b1,
        0b10,
        [0],
        [0],
        [new BitmapIndexedNode(1, 0b11, 0, [1, 0b100001], [1, 0b100001], [], [1, 0b100001], 2)],
        [0],
        3
      ),
      0b1100001
    ]);
  });

  it("should do nothing if hash is the same but key is not", () => {
    const make = () =>
      new BitmapIndexedNode(
        0,
        0b1,
        0b10,
        [0],
        [0],
        [new BitmapIndexedNode(0, 0b11, 0, [1, 0b100001], [1, 0b100001], [], [1, 0b100001], 2)],
        [0],
        3
      );
    const node = make();
    const next = node.remove(1, 2, 1, 0);
    expect(next).toBeUndefined();
    expect(node).toEqual(make());
    expect(hashCollision().remove(1, 3, 0, 0)).toBeUndefined();
  });

  it("should do nothing if child not exist", () => {
    const node = hashCollision();
    const next = node.remove(1, 123, 123, 0);
    expect(next).toBeUndefined();
    expect(node).toEqual(hashCollision());
  });
});

describe("test collision node", () => {
  it("should do nothing if owner is the same", () => {
    const node = new HashCollisionNode(0, 0, [0, 1], [0, 1]);
    const next = node.toOwned(0);
    expect(node).toBe(next);
  });

  it("should get hash", () => {
    const node = new HashCollisionNode(0, 0, [0, 1], [0, 1]);
    expect(node.getHash()).toBe(0);
  });

  it("should update value", () => {
    const node = new HashCollisionNode(0, 0, [0, 1], [0, 1]);
    const next = node.update(1, 1, () => 10);
    expect(next).toEqual(new HashCollisionNode(1, 0, [0, 1], [0, 10]));
  });

  it("should do nothing if value is the same", () => {
    const node = new HashCollisionNode(0, 0, [0, 1], [0, 1]);
    const next = node.update(1, 1, (it = 1) => it);
    expect(next).toBe(node);
    expect(next).toEqual(new HashCollisionNode(0, 0, [0, 1], [0, 1]));
  });

  it("should not insert new value", () => {
    const node = new HashCollisionNode(0, 0, [0, 1], [0, 1]);
    const next = node.update(1, 10, (it = 1) => it);
    expect(next).toEqual(new HashCollisionNode(0, 0, [0, 1], [0, 1]));
  });
});
