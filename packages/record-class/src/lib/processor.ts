import { NodePath } from "@babel/core";
import template from "@babel/template";
import * as t from "@babel/types";

function isRecordProperty(node: t.ClassProperty) {
  return (
    !node.static &&
    !node.declare &&
    node.readonly &&
    node.accessibility === "public"
  );
}

const mergePropertyValue = template.expression("partial.NAME ?? this.NAME");

const assignWithDefault = template.statement(
  "TARGET.NAME = SOURCE.NAME ?? DEFAULT_VALUE;"
);

const assign = template.statement("TARGET.NAME = SOURCE.NAME;");

const methodsTemplate = template(`
  class Template {
    constructor(partial) {
      super(partial)
      INITIALIZE
    }
    merge(partial) {
      return new CLASS(MERGE)
    }
    pipe(...list) {
      let next = this.clone();
      list.forEach(f => {
        Object.assign(next, f(next))
      })
      return next
    }
  }
`);

export class Processor {
  private readonly properties = new Map<
    string,
    t.Expression | null | undefined
  >();

  constructor(
    private readonly classDeclaration: NodePath<t.ClassDeclaration>
  ) {}

  public process() {
    this.processProperties();
    this.insertMethods();
  }

  private processProperties() {
    const properties = new Set<t.ClassProperty>();
    this.classDeclaration.traverse({
      ClassProperty: (property) => {
        if (!isRecordProperty(property.node)) {
          return;
        }
        const key = property.node.key;
        if (key.type !== "Identifier") {
          return;
        }
        const value = property.node.value;
        this.properties.set(key.name, value);
        properties.add(property.node);
      },
    });
    this.classDeclaration.node.body.body =
      this.classDeclaration.node.body.body.filter((item) => {
        return item.type !== "ClassProperty" || !properties.has(item);
      });
  }

  private insertMethods(): void {
    const INITIALIZE: t.Statement[] = [];
    const mergeProperties: t.ObjectProperty[] = [];
    this.properties.forEach((value, name) => {
      const init = value
        ? assignWithDefault({
            TARGET: t.thisExpression(),
            NAME: t.identifier(name),
            SOURCE: t.identifier("partial"),
            DEFAULT_VALUE: value,
          })
        : assign({
            TARGET: t.thisExpression(),
            SOURCE: t.identifier("partial"),
            NAME: t.identifier(name),
          });
      INITIALIZE.push(init);
      const mergeProperty = t.objectProperty(
        t.identifier(name),
        mergePropertyValue({
          NAME: t.identifier(name),
        })
      );
      mergeProperties.push(mergeProperty);
    });
    const klass = methodsTemplate({
      INITIALIZE,
      CLASS: this.classDeclaration.node.id,
      MERGE: t.objectExpression(mergeProperties),
    });
    if (Array.isArray(klass) || klass.type !== "ClassDeclaration") {
      throw new Error();
    }
    this.classDeclaration.node.body.body.push(...klass.body.body);
  }
}
