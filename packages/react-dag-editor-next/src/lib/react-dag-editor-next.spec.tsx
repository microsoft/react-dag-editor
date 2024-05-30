import { render } from "@testing-library/react";

import ReactDagEditorNext from "./react-dag-editor-next";

describe("ReactDagEditorNext", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ReactDagEditorNext />);
    expect(baseElement).toBeTruthy();
  });
});
