import { getNodeSize, IGraphConfig } from "../../src";
import { ILine } from "../../src/components/Line";
import { IDummyNode } from "../../src/models/dummy-node";
import { getAlignmentLines, getAutoAlignDisplacement } from "../../src/utils/autoAlign";
import { getGraphConfig } from "../utils";
import { getSample1Data } from "./__data__/getSample1Data";

describe("AutoAlign", () => {
  let graphConfig: IGraphConfig;
  let allNodes: readonly IDummyNode[];

  let testData: Array<{
    dummyNodes: IDummyNode[];
    expected: ILine[];
  }>;

  /**
   *
   */
  function initData(): void {
    allNodes = getSample1Data().nodes.map(node => ({
      id: node.id,
      x: node.x,
      y: node.y,
      ...getNodeSize(node, graphConfig)
    }));
    testData = [
      {
        dummyNodes: [
          {
            ...allNodes[0],
            x: 174,
            y: 386
          }
        ],
        expected: [
          {
            x1: 173,
            y1: 386,
            x2: 173,
            y2: 443.5,
            visible: true
          },
          {
            x1: 453,
            y1: 386,
            x2: 453,
            y2: 443.5,
            visible: true
          },
          {
            x1: 174,
            y1: 386,
            x2: 822,
            y2: 386,
            visible: true
          },
          {
            x1: 174,
            y1: 436,
            x2: 822,
            y2: 436,
            visible: true
          }
        ]
      },
      {
        dummyNodes: [
          {
            ...allNodes[0],
            x: 438,
            width: 500
          }
        ],
        expected: [
          {
            x1: 688,
            y1: 162,
            x2: 688,
            y2: 330,
            visible: true
          }
        ]
      },
      {
        dummyNodes: [
          {
            ...allNodes[0],
            x: 328,
            width: 500
          }
        ],
        expected: [
          {
            x1: 828,
            y1: 162,
            x2: 828,
            y2: 330,
            visible: true
          }
        ]
      },
      {
        dummyNodes: [
          {
            ...allNodes[0],
            x: 172
          },
          {
            ...allNodes[1],
            x: 190
          }
        ],
        expected: [
          {
            x1: 173,
            y1: 162,
            x2: 173,
            y2: 443.5,
            visible: true
          }
        ]
      }
    ];
  }

  beforeAll(() => {
    graphConfig = getGraphConfig();
    initData();
  });

  describe("getAlignmentLines", () => {
    it("dragging one node with default threshold, align x and y, should has 4 alignment lines", () => {
      const alignmentLines = getAlignmentLines(testData[0].dummyNodes, allNodes, graphConfig);
      expect(alignmentLines).toEqual(testData[0].expected);
    });

    it("dragging one node with default threshold, with a larger width, align middle, should has one alignment line", () => {
      const alignmentLines = getAlignmentLines(testData[1].dummyNodes, allNodes, graphConfig);
      expect(alignmentLines).toEqual(testData[1].expected);
    });

    it("dragging one node with specified threshold, with a larger width, align x right, should has 1 alignment ling", () => {
      const alignmentLines = getAlignmentLines(testData[2].dummyNodes, allNodes, graphConfig, 5);
      expect(alignmentLines).toEqual(testData[2].expected);
    });

    it("dragging multi nodes with default threshold, align x left, should has 1 alignment line", () => {
      const alignmentLines = getAlignmentLines(testData[3].dummyNodes, allNodes, graphConfig);
      expect(alignmentLines).toEqual(testData[3].expected);
    });
  });

  describe("getAutoAlignDisplacement", () => {
    it("dragging one node", () => {
      const dx = getAutoAlignDisplacement(testData[0].expected, testData[0].dummyNodes, graphConfig, "x");
      const dy = getAutoAlignDisplacement(testData[0].expected, testData[0].dummyNodes, graphConfig, "y");
      expect(dx).toBe(-1);
      expect(dy).toBe(0);
    });

    it("dragging one node, and the node has a different width, align x middle", () => {
      const dx = getAutoAlignDisplacement(testData[1].expected, testData[1].dummyNodes, graphConfig, "x");
      const dy = getAutoAlignDisplacement(testData[1].expected, testData[1].dummyNodes, graphConfig, "y");
      expect(dx).toBe(0);
      expect(dy).toBe(0);
    });

    it("dragging one node, and the node has a different width, align x right", () => {
      const dx = getAutoAlignDisplacement(testData[2].expected, testData[2].dummyNodes, graphConfig, "x");
      const dy = getAutoAlignDisplacement(testData[2].expected, testData[2].dummyNodes, graphConfig, "y");
      expect(dx).toBe(0);
      expect(dy).toBe(0);
    });

    it("dragging multi nodes", () => {
      const dx = getAutoAlignDisplacement(testData[3].expected, testData[3].dummyNodes, graphConfig, "x");
      const dy = getAutoAlignDisplacement(testData[3].expected, testData[3].dummyNodes, graphConfig, "y");
      expect(dx).toBe(1);
      expect(dy).toBe(0);
    });
  });
});
