import { createMacro, MacroParams } from "babel-plugin-macros";
import { Processor } from "./lib/processor";

function recordClassMacro({ references }: MacroParams): void {
  references.default.forEach((referencePath) => {
    const decorator = referencePath.parentPath;
    if (!decorator || !decorator.isDecorator()) {
      throw new Error();
    }
    const classDeclaration = referencePath.parentPath?.parentPath;
    if (!classDeclaration || !classDeclaration.isClassDeclaration()) {
      throw new Error();
    }
    classDeclaration.node.decorators = classDeclaration.node.decorators?.filter(
      (it) => it !== decorator.node
    );
    const processor = new Processor(classDeclaration);
    processor.process();
  });
}

export = createMacro(recordClassMacro);
