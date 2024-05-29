export const inputData = [
  { dependencies: [], name: "81777c66", cost: 32 },
  {
    dependencies: ["81777c66"],
    name: "c4ee5025",
    cost: 35,
  },
  {
    dependencies: ["c4ee5025"],
    name: "fb404f70",
    cost: 37,
  },
  {
    dependencies: ["fb404f70", "c4ee5025"],
    name: "d1647408",
    cost: 35,
  },
  {
    dependencies: ["d1647408"],
    name: "f6dc0eb1",
    cost: 30,
  },
  {
    dependencies: ["f6dc0eb1"],
    name: "47566002",
    cost: 22,
  },
  {
    dependencies: ["47566002"],
    name: "1fd27f80",
    cost: 0,
  },
  {
    dependencies: ["fb404f70"],
    name: "4b199015",
    cost: 0,
  },
];

export const outputData = {
  name: "1fd27f80",
  cost: 0,
  earlyFinish: 0,
  criticalCost: 191,
  latestStart: 0,
  latestFinish: 0,
  earlyStart: 0,
  dependencies: [
    {
      name: "47566002",
      cost: 22,
      earlyFinish: 22,
      criticalCost: 191,
      latestStart: 0,
      latestFinish: 22,
      earlyStart: 0,
      dependencies: [
        {
          name: "f6dc0eb1",
          cost: 30,
          earlyFinish: 52,
          criticalCost: 169,
          latestStart: 22,
          latestFinish: 52,
          earlyStart: 22,
          dependencies: [
            {
              name: "d1647408",
              cost: 35,
              earlyFinish: 87,
              criticalCost: 139,
              latestStart: 52,
              latestFinish: 87,
              earlyStart: 52,
              dependencies: [
                {
                  name: "fb404f70",
                  cost: 37,
                  earlyFinish: 124,
                  criticalCost: 104,
                  latestStart: 87,
                  latestFinish: 124,
                  earlyStart: 87,
                  dependencies: [
                    {
                      name: "c4ee5025",
                      cost: 35,
                      earlyFinish: 159,
                      criticalCost: 67,
                      latestStart: 124,
                      latestFinish: 159,
                      earlyStart: 124,
                      dependencies: [
                        {
                          name: "81777c66",
                          cost: 32,
                          earlyFinish: 191,
                          criticalCost: 32,
                          latestStart: 159,
                          latestFinish: 191,
                          earlyStart: 159,
                          dependencies: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "c4ee5025",
                  cost: 35,
                  earlyFinish: 159,
                  criticalCost: 67,
                  latestStart: 124,
                  latestFinish: 159,
                  earlyStart: 124,
                  dependencies: [
                    {
                      name: "81777c66",
                      cost: 32,
                      earlyFinish: 191,
                      criticalCost: 32,
                      latestStart: 159,
                      latestFinish: 191,
                      earlyStart: 159,
                      dependencies: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
