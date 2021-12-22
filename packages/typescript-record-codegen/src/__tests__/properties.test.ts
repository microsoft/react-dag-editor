import * as path from "path";
import { generate } from "../generate";

it("should generate properties correctly", async () => {
  const files = generate({
    tsConfig: path.resolve(__dirname, "../../tsconfig.spec.json"),
    sources: [path.resolve(__dirname, "./input.interface.ts")],
    outDir: path.resolve(__dirname, "__generated__"),
    classNameTemplate: "<%= name %>Record",
  });
  files.forEach((file) => {
    const text = file.getText();
    expect(text).toMatchSnapshot(file.getBaseName());
  });
});
