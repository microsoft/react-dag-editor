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
    $$initialize(partial) {
      INITIALIZE
    }
    merge(partial) {
      return this.$$create(MERGE)
    }
    pipe(...list) {
      let next = this.clone();
      list.forEach(f => {
        Object.assign(next, f(next))
      })
    }
    toJSON() {
      return TO_JSON;
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
    this.classDeclaration.traverse({
      ClassProperty: (property) => {
        if (!isRecordProperty(property.node)) {
          return;
        }
        if (!property.node.optional && !property.node.value) {
          throw new Error();
        }
        const key = property.node.key;
        if (key.type !== "Identifier") {
          return;
        }
        const value = property.node.value;
        if (!value && !property.node.optional) {
          throw new Error();
        }
        this.properties.set(key.name, value);
        property.node.value = null;
      },
    });
  }

  private insertMethods(): void {
    const INITIALIZE: t.Statement[] = [];
    const mergeProperties: t.ObjectProperty[] = [];
    const fieldsProperties: t.ObjectProperty[] = [];
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
      const fieldsProperty = t.objectProperty(
        t.identifier(name),
        t.memberExpression(t.thisExpression(), t.identifier(name))
      );
      fieldsProperties.push(fieldsProperty);
    });
    const klass = methodsTemplate({
      INITIALIZE,
      MERGE: t.objectExpression(mergeProperties),
      TO_JSON: t.objectExpression(fieldsProperties),
    });
    if (Array.isArray(klass) || klass.type !== "ClassDeclaration") {
      throw new Error();
    }
    this.classDeclaration.node.body.body.push(...klass.body.body);
  }
}
