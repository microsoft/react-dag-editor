import { GraphModel } from "react-dag-editor";
import { getSample1Data } from "./__data__/getSample1Data";

it("should convert from plain objects", () => {
  const graph = GraphModel.fromJSON(getSample1Data());
  expect(graph.nodes).toMatchSnapshot();
  expect(graph.edges).toMatchSnapshot();
  expect(graph.head).toMatchSnapshot();
  expect(graph.tail).toMatchSnapshot();
  expect(graph.edgesBySource).toMatchSnapshot();
  expect(graph.edgesByTarget).toMatchSnapshot();
});

it("should convert to plain objects", () => {
  expect(GraphModel.fromJSON(getSample1Data()).toJSON()).toMatchSnapshot();
});
