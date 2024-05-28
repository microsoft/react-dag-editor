import {
  binaryFind,
  INode,
  InternalNode,
  LeafNode,
} from "../../lib/collections/b-tree";

function leaf(values: number[], owner = 0): LeafNode<number, number> {
  return new LeafNode(
    owner,
    values,
    values.map((it) => it * 10)
  );
}

function range(start: number, end: number, step?: number): number[] {
  step = step === undefined ? (start < end ? 1 : -1) : step;
  const size = Math.max(Math.ceil((end - start) / (step || 1)), 0);
  const result = [];
  for (let i = 0, x = start; i < size; ++i, x += step) {
    result.push(x);
  }
  return result;
}

function internal(
  values: Array<readonly [INode<number, number>, number | null]>,
  owner = 0
): InternalNode<number, number> {
  const node = new InternalNode(
    owner,
    values.slice(0, values.length - 1).map((it) => it[1]!),
    values.slice(0, values.length - 1).map((it) => it[1]! * 10),
    values.map((it) => it[0]),
    0
  );
  node["updateSize"].call(node);
  return node;
}

describe("test utils", () => {
  it("binary find should find a index", () => {
    const values = [1, 3, 5, 6, 7, 9];
    expect(binaryFind(values, 0)).toBe(0);
    expect(binaryFind(values, 3)).toBe(1);
    expect(binaryFind(values, 5)).toBe(2);
    expect(binaryFind(values, 6)).toBe(3);
    expect(binaryFind(values, 7)).toBe(4);
    expect(binaryFind(values, 8)).toBe(5);
    expect(binaryFind(values, 9)).toBe(5);
    expect(binaryFind(values, 10)).toBe(6);
  });

  it("should create new node after toOwned", () => {
    const leaf0 = leaf([], 12);
    expect(leaf0.toOwned(13)).not.toBe(leaf0);
    const node1 = internal([], 12);
    expect(node1.toOwned(13)).not.toBe(node1);
  });

  it("should not create new node if owner is the same", () => {
    const node0 = leaf([], 12);
    expect(node0.toOwned(12)).toBe(node0);
    const node1 = internal([], 12);
    expect(node1.toOwned(12)).toBe(node1);
  });
});

describe("test find", () => {
  const mock1 = () =>
    internal([
      [leaf([1, 3, 5, 6, 7, 9]), 11],
      [leaf([13, 15, 16, 17, 19]), 20],
      [leaf([21, 23, 26, 27]), 29],
      [leaf([31, 33, 36, 37]), null],
    ]);

  it("should find value from leaf", () => {
    const node = leaf([1, 3, 5, 6, 7, 9]);
    expect(node.get(3)).toBe(30);
  });

  it("should find nothing from leaf", () => {
    const node = leaf([1, 3, 5, 6, 7, 9]);
    expect(node.get(4)).toBeUndefined();
  });

  it("should find value from internal node", () => {
    const node = mock1();
    expect(node.get(20)).toBe(200);
  });

  it("should find value from leaf node", () => {
    const node = mock1();
    expect(node.get(23)).toBe(230);
  });

  it("should find value from most right leaf node", () => {
    const node = mock1();
    expect(node.get(37)).toBe(370);
  });

  it("should find nothing", () => {
    const node = mock1();
    expect(node.get(14)).toBeUndefined();
    expect(node.get(39)).toBeUndefined();
  });
});

describe("test update leaf", () => {
  const mock1 = () =>
    leaf([2, 4, 6, 8, 10, 12, 14, 16, 17, 18, 20, 23, 24, 25, 26, 28, 33]);
  const mock2 = () => {
    const values = [] as number[];
    for (let i = 0; i < 31; i += 1) {
      values.push(i * 2);
    }
    return leaf(values);
  };

  it("should not split node", () => {
    const node = mock1();
    expect(node.insert(1, 11, 110)).toEqual([
      leaf(
        [2, 4, 6, 8, 10, 11, 12, 14, 16, 17, 18, 20, 23, 24, 25, 26, 28, 33],
        1
      ),
    ]);
  });

  it("should reuse node", () => {
    const node = mock1();
    const reused = node.update(0, 10, () => 100);
    expect(reused).toBe(node);
    expect(reused).toEqual(mock1());
  });

  it("should update value", () => {
    const node = mock1();
    const reused = node.update(0, 10, () => 10);
    expect(reused).toBe(node);
    expect(reused.values[4]).toBe(10);
    expect(reused.size).toBe(17);
  });

  it("should split node 1", () => {
    const node = mock2();
    const result = node.insert(1, 15, 150);
    expect(result.length).toBe(4);
    const [next1, next2, nextKey, nextValue] = result;
    expect(next1).toEqual(
      leaf([0, 2, 4, 6, 8, 10, 12, 14, 15, 16, 18, 20, 22, 24, 26], 1)
    );
    expect(nextKey).toBe(28);
    expect(nextValue).toBe(280);
    expect(next2).toEqual(
      leaf([30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60], 1)
    );
  });

  it("should split node 2", () => {
    const node = mock2();
    const result = node.insert(0, 29, 290);
    if (result.length !== 4) {
      expect(result.length).toBe(4);
    }
    const [next1, next2, nextKey, nextValue] = result;
    expect(next1).toEqual(
      leaf([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28])
    );
    expect(nextKey).toBe(29);
    expect(nextValue).toBe(290);
    expect(next2).toEqual(
      leaf([30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60])
    );
  });

  it("should split node 3", () => {
    const node = mock2();
    const result = node.insert(0, 33, 330);
    if (result.length !== 4) {
      expect(result.length).toBe(4);
    }
    const [next1, next2, nextKey, nextValue] = result;
    expect(next1.size).toBe(15);
    expect(next1).toEqual(
      leaf([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28])
    );
    expect(nextKey).toBe(30);
    expect(nextValue).toBe(300);
    expect(next2).toEqual(
      leaf([32, 33, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60])
    );
  });
});

describe("test update internal", () => {
  const mock1 = () =>
    internal([
      [leaf(range(0, 31)), 31],
      [leaf(range(32, 63)), 63],
      [leaf(range(64, 95)), null],
    ]);

  it("should update internal value", () => {
    const node = mock1();
    const result = node.update(1, 31, (prev = 0) => prev + 1);
    const exp = new InternalNode(
      1,
      [31, 63],
      [311, 630],
      [leaf(range(0, 31)), leaf(range(32, 63)), leaf(range(64, 95))],
      95
    );
    expect(result).toEqual(exp);
  });

  it("should be noop if value is the same in internal node", () => {
    const node = mock1();
    const result = node.update(1, 31, (v = 0) => v);
    expect(result).toBe(node);
    expect(node).toEqual(mock1());
  });

  it("should update leaf value", () => {
    const node = mock1();
    const result = node.update(1, 33, (prev = 0) => prev + 1);
    const expValues = range(32, 63).map((it) => (it === 33 ? 331 : it * 10));
    const exp = new InternalNode(
      1,
      [31, 63],
      [310, 630],
      [
        leaf(range(0, 31)),
        new LeafNode<number, number>(1, range(32, 63), expValues),
        leaf(range(64, 95)),
      ],
      95
    );
    expect(result).toEqual(exp);
  });

  it("should be noop if value is the same in leaf node", () => {
    const node = mock1();
    const result = node.update(1, 33, (v = 0) => v);
    expect(result).toBe(node);
    expect(node).toEqual(mock1());
  });

  it("should insert and split leaf node", () => {
    const node = internal([
      [leaf(range(0, 62, 2)), 62],
      [leaf(range(64, 126, 2)), 126],
      [leaf(range(128, 190, 2)), null],
    ]);
    const result = node.insert(1, 125, 1250);
    const newKeys = range(96, 126, 2);
    newKeys.push(125);
    const exp = new InternalNode(
      1,
      [62, 94, 126],
      [620, 940, 1260],
      [
        leaf(range(0, 62, 2)),
        leaf(range(64, 94, 2), 1),
        leaf(newKeys, 1),
        leaf(range(128, 190, 2)),
      ],
      96
    );
    expect(result).toEqual([exp]);
    expect(exp.getChild(1).size).toBe(15);
    expect(exp.getChild(2).size).toBe(16);
  });

  it("should insert and split internal node", () => {
    function mockLeaves(
      it: number,
      start = 0,
      end = 31,
      owner = 0
    ): readonly [LeafNode<number, number>, number] {
      return [
        leaf(
          range(start, end).map((l) => l + it * 32),
          owner
        ),
        it * 32 + end,
      ] as const;
    }
    const node = internal(range(0, 32).map((it) => mockLeaves(it)));
    const [next1, next2, newKey, newValue] = node.insert(1, 1023, 1023);
    expect(newKey).toBe(16 * 32 - 1);
    expect(newValue).toBe((16 * 32 - 1) * 10);
    const exp1 = internal(
      range(0, 16).map((it) => mockLeaves(it)),
      1
    );
    const last = mockLeaves(31, 16, 31, 1);
    const lastLeaf = last[0];
    lastLeaf.insert(1, 1023, 1023);
    const exp2 = internal(
      [
        ...range(16, 31).map((it) => mockLeaves(it)),
        mockLeaves(31, 0, 15, 1),
        last,
      ],
      1
    );
    expect(next1).toEqual(exp1);
    expect(next2).toEqual(exp2);
  });
});

describe("test remove", () => {
  it("should remove most right from leaf", () => {
    expect(leaf(range(0, 32)).removeMostRight(1)).toEqual([
      31,
      310,
      leaf(range(0, 31), 1),
    ]);
  });

  it("should remove most right", () => {
    const node = internal([
      [leaf(range(0, 15)), 15],
      [leaf(range(16, 31)), null],
    ]);
    const result = node.removeMostRight(1);
    const exp = new InternalNode(1, [], [], [leaf(range(0, 30), 1)], 30);
    expect(result).toEqual([30, 300, exp]);
  });

  it("should remove correct node from leaf", () => {
    expect(leaf(range(0, 16)).remove(1, 4)).toEqual(
      new LeafNode(
        1,
        range(0, 4).concat(range(5, 16)),
        range(0, 40, 10).concat(range(50, 160, 10))
      )
    );
  });

  it("should do nothing if key not exist in leaf", () => {
    const node = leaf(range(0, 16));
    const result = node.remove(1, 16);
    expect(result).toBe(node);
    expect(result).toEqual(leaf(range(0, 16)));
  });

  it("should do nothing if child not changed", () => {
    const node = internal([
      [leaf(range(0, 62, 2)), 62],
      [leaf(range(64, 126, 2)), 126],
      [leaf(range(128, 190, 2)), null],
    ]);
    const next = node.remove(0, 0);
    expect(next).toBe(node);
    expect(next).toEqual(
      internal([
        [leaf(range(2, 62, 2)), 62],
        [leaf(range(64, 126, 2)), 126],
        [leaf(range(128, 190, 2)), null],
      ])
    );
  });

  it("should do nothing if key not exist", () => {
    const node = internal([
      [leaf(range(0, 62, 2)), 62],
      [leaf(range(64, 126, 2)), 126],
      [leaf(range(128, 190, 2)), null],
    ]);
    const next = node.remove(1, 1000);
    expect(next).toBe(node);
    expect(next).toEqual(
      internal([
        [leaf(range(0, 62, 2)), 62],
        [leaf(range(64, 126, 2)), 126],
        [leaf(range(128, 190, 2)), null],
      ])
    );
  });

  it("should not re-balance if node size is larger than min size", () => {
    const node = internal([
      [leaf(range(0, 62, 2)), 62],
      [leaf(range(64, 126, 2)), 126],
      [leaf(range(128, 190, 2)), null],
    ]);
    const next = node.remove(1, 0);
    expect(next).not.toBe(node);
    expect(next).toEqual(
      internal(
        [
          [leaf(range(2, 62, 2), 1), 62],
          [leaf(range(64, 126, 2)), 126],
          [leaf(range(128, 190, 2)), null],
        ],
        1
      )
    );
  });

  function mockLeaves(i: number): readonly [LeafNode<number, number>, number] {
    return [leaf(range(0, 15).map((it) => it + i * 16)), i * 16 + 15] as const;
  }

  it("should merge most right node", () => {
    const node = internal([
      [internal(range(0, 16).map(mockLeaves)), 255],
      [internal(range(16, 32).map(mockLeaves)), 511],
      [internal(range(32, 48).map(mockLeaves)), null],
    ]);
    const result = node.remove(1, 766);
    const exp = new InternalNode(
      1,
      [255],
      [2550],
      [
        internal(range(0, 16).map(mockLeaves)),
        internal(
          [...range(16, 46).map(mockLeaves), [leaf(range(736, 766), 1), null]],
          1
        ),
      ],
      0
    );
    exp["updateSize"].call(exp);
    expect(result.size).toBe(node.size - 1);
    expect(result).toEqual(exp);
  });

  it("should merge most left node", () => {
    const node = internal([
      [internal(range(0, 16).map(mockLeaves)), 255],
      [internal(range(16, 32).map(mockLeaves)), 511],
      [internal(range(32, 48).map(mockLeaves)), null],
    ]);
    const result = node.remove(1, 0);
    const exp = new InternalNode(
      1,
      [511],
      [5110],
      [
        internal(
          [[leaf(range(1, 31), 1), 31], ...range(2, 32).map(mockLeaves)],
          1
        ),
        internal(range(32, 48).map(mockLeaves)),
      ],
      0
    );
    exp["updateSize"].call(exp);
    expect(result.size).toBe(node.size - 1);
    expect(result).toEqual(exp);
  });

  it("should rotate left", () => {
    const node = internal([
      [internal(range(0, 16).map(mockLeaves)), 255],
      [internal(range(16, 32).map(mockLeaves)), 511],
      [internal(range(32, 49).map(mockLeaves)), null],
    ]);
    const result = node.remove(1, 256);
    const exp = internal(
      [
        [internal(range(0, 16).map(mockLeaves)), 255],
        [
          internal(
            [[leaf(range(257, 287), 1), 287], ...range(18, 33).map(mockLeaves)],
            1
          ),
          527,
        ],
        [internal(range(33, 49).map(mockLeaves), 1), null],
      ],
      1
    );
    expect(result.size).toBe(node.size - 1);
    expect(result).toEqual(exp);
  });

  it("should rotate right", () => {
    const node = internal([
      [internal(range(0, 17).map(mockLeaves)), 271],
      [internal(range(17, 33).map(mockLeaves)), 511],
      [internal(range(33, 49).map(mockLeaves)), null],
    ]);
    const result = node.remove(1, 272);
    const exp = internal(
      [
        [internal(range(0, 16).map(mockLeaves), 1), 255],
        [
          internal(
            [
              [leaf(range(256, 271), 0), 271],
              [leaf(range(273, 303), 1), 303],
              ...range(19, 33).map(mockLeaves),
            ],
            1
          ),
          511,
        ],
        [internal(range(33, 49).map(mockLeaves)), null],
      ],
      1
    );
    expect(result.size).toEqual(node.size - 1);
    expect(result).toEqual(exp);
  });

  it("should rotate left when balance head", () => {
    const node = internal([
      [internal(range(0, 16).map(mockLeaves)), 255],
      [internal(range(16, 33).map(mockLeaves)), 527],
      [internal(range(33, 49).map(mockLeaves)), null],
    ]);
    const result = node.remove(1, 254);
    const exp = internal(
      [
        [
          internal(
            [
              ...range(0, 14).map(mockLeaves),
              [leaf(range(224, 254), 1), 255],
              [leaf(range(256, 271)), 271],
            ],
            1
          ),
          271,
        ],
        [internal(range(17, 33).map(mockLeaves), 1), 527],
        [internal(range(33, 49).map(mockLeaves)), null],
      ],
      1
    );
    expect(result.size).toBe(node.size - 1);
    expect(result).toEqual(exp);
  });

  it("should rotate right when balance tail", () => {
    const node = internal([
      [internal(range(0, 16).map(mockLeaves)), 255],
      [internal(range(16, 33).map(mockLeaves)), 527],
      [internal(range(33, 49).map(mockLeaves)), null],
    ]);
    const result = node.remove(1, 528);
    const exp = internal(
      [
        [internal(range(0, 16).map(mockLeaves)), 255],
        [internal(range(16, 32).map(mockLeaves), 1), 511],
        [
          internal(
            [
              [leaf(range(512, 527)), 527],
              [leaf(range(529, 559), 1), 559],
              ...range(35, 49).map(mockLeaves),
            ],
            1
          ),
          null,
        ],
      ],
      1
    );
    expect(result.size).toBe(node.size - 1);
    expect(result).toEqual(exp);
  });

  it("should split and merge into two neighbors", () => {
    const node = internal([
      [internal(range(0, 16).map(mockLeaves)), 255],
      [internal(range(16, 32).map(mockLeaves)), 511],
      [internal(range(32, 48).map(mockLeaves)), null],
    ]);
    const result = node.remove(1, 256);
    const exp = internal(
      [
        [
          internal(
            [
              ...range(0, 16).map(mockLeaves),
              [leaf(range(257, 287), 1), 287],
              ...range(18, 25).map(mockLeaves),
            ],
            1
          ),
          399,
        ],

        [internal(range(25, 48).map(mockLeaves), 1), null],
      ],
      1
    );
    expect(result.size).toBe(node.size - 1);
    expect(result).toEqual(exp);
  });

  it("should remove from internal node", () => {
    const node = internal([
      [leaf(range(0, 15)), 15],
      [leaf(range(16, 31)), null],
    ]);
    const result = node.remove(1, 15);
    const exp = new InternalNode(
      1,
      [],
      [],
      [leaf(range(0, 15).concat(range(16, 31)), 1)],
      30
    );
    expect(result).toEqual(exp);
  });
});
