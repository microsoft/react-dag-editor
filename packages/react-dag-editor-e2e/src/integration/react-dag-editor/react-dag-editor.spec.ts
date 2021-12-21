describe("react-dag-editor: ReactDagEditor component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=reactdageditor--primary"));

  it("should render the component", () => {
    cy.get("h1").should("contain", "Welcome to ReactDagEditor!");
  });
});
