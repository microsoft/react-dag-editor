This algorithm is used to find the minimum-cost-maximum-matching in a bipartite graph.

## Usage

1. implement the [IGraphDiffContext](./context/GraphDiffContext.ts)
2. implement the [IGraphDiffResolver](./resolver/BaseGraphDiffResolver.ts)


```typescript

const context: IGraphDiffContext;
const resolver: IGraphDiffResolver;

// Find the best bipartite graph matching.
const candidateMappings = resolver.findCandidateMapping(context);
const mappings = findBipartiteGraphMaxMapping(candidateMappings);
// You can perform additional matches and modify mappings.

// Build diff graph.
context.buildDiffGraph(mappings, abOnlyNodes,)

```
