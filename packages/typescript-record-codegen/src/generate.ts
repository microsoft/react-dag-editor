// eslint-disable-next-line no-restricted-imports
import { template, TemplateExecutor } from "lodash";
import * as path from "path";
import {
  ClassDeclaration,
  InterfaceDeclaration,
  Project,
  PropertySignature,
  Scope,
  SourceFile,
  WriterFunction,
} from "ts-morph";
import { TS_RECORD } from "./constants";

function getPropertyType(property: PropertySignature): string | WriterFunction {
  const structure = property.getStructure();
  const propertyType = property.getType();
  if (!property.hasQuestionToken()) {
    return structure.type ?? "unknown";
  } else if (propertyType.isUnion()) {
    const unionTypes = propertyType.getUnionTypes();
    if (unionTypes.every((it) => !it.isUndefined())) {
      return `${structure.type} | undefined`;
    } else {
      return unionTypes.map((type) => type.getText()).join(" | ");
    }
  } else if (!propertyType.isUndefined()) {
    return `(${structure.type}) | undefined`;
  }
  return structure.type ?? "unknown";
}

function processClass(klass: ClassDeclaration, src: InterfaceDeclaration) {
  src.getProperties().forEach((property) => {
    const type = getPropertyType(property);
    klass.addProperty({
      name: property.getName(),
      isReadonly: true,
      hasQuestionToken: false,
      scope: Scope.Public,
      type,
    });
  });
}

export interface IGenerateOptions {
  sources: string[];
  outDir: string;
  tsConfig: string;
  classNameTemplate: string;
}

function transformName(
  src: InterfaceDeclaration,
  nameTemplate: TemplateExecutor
): string {
  const name = src.getName().match(/^I(.+)$/)?.[1] ?? "Unknown";
  return nameTemplate({
    name,
  });
}

export function generate(options: IGenerateOptions): SourceFile[] {
  const nameTemplate = template(options.classNameTemplate);
  const project = new Project({
    tsConfigFilePath: options.tsConfig,
  });
  const files: SourceFile[] = [];
  options.sources.forEach((sourcePath) => {
    const source = project.addSourceFileAtPath(sourcePath);
    if (!source) {
      return;
    }
    let target: SourceFile | undefined;
    source.getInterfaces().forEach((singleInterface) => {
      const jsDocs = singleInterface.getJsDocs();
      let shouldProcess = false;
      jsDocs.forEach((jsDoc) => {
        jsDoc.getTags().forEach((tag) => {
          switch (tag.getTagName()) {
            case TS_RECORD:
              shouldProcess = true;
              break;
            default:
              break;
          }
        });
      });

      if (!shouldProcess) {
        return;
      }
      if (!target) {
        const sourceFilename = source.getBaseNameWithoutExtension();
        const targetFilename = `${sourceFilename.split(".")[0]}.record.ts`;
        target = project.createSourceFile(
          path.resolve(options.outDir, targetFilename),
          "",
          {
            overwrite: true,
          }
        );
      }
      if (!target) {
        return;
      }
      const klass = target.addClass({
        name: transformName(singleInterface, nameTemplate),
      });
      processClass(klass, singleInterface);
    });
    if (!target) {
      return;
    }
    files.push(target);
  });
  return files;
}
