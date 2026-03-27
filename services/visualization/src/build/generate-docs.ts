import fs from "fs";
import {getSymbolPartialPagePath, getSymbolPagePath, getSymbolPartialPropertiesPath} from "./symbols.js";
import {JsonSchemaToMarkdown, printRenderedTypes} from "./schema-to-md.js";
import path from "path";
import * as Ajv from "ajv";
import Case from "case";
import * as glob from "glob";
import {outDocsFolder} from "./constants.js";
import {getSchema} from "../schema/schema-repository.js";

const generateExamples = async (entities: Record<string, any>) => {
  const schemaToRef = Object.entries(entities).reduce((acc, [key, value]) => {
    acc['#/definitions/' + key] = value;
    return acc;
  }, {} as Record<string, any>);

  const ajv = new Ajv.Ajv({schemas: schemaToRef, discriminator: true});

  const exampleFiles = await glob.glob("docs/examples/**/*.json") as string[];
  if (exampleFiles.length === 0) {
    throw new Error('No examples found');
  }
  await Promise.all(exampleFiles.map(async (exampleFile) => {
    let data
    const content = fs.readFileSync(exampleFile, "utf8");
    try {
      data = JSON.parse(content);
    } catch (e) {
      console.error('Error parsing example file:', exampleFile);
      console.error(e);
      process.exit(1);
    }
    const schemaNameCandidates = [path.basename(exampleFile, '.json'), path.basename(path.dirname(exampleFile))]
      .filter(f => f !== 'examples')
      .map(f => Case.pascal(f))

    const schema = schemaNameCandidates
      .map(schemaName => ({name: schemaName, fn: ajv.getSchema('#/definitions/' + schemaName)}))
      .find(s => s.fn)

    if (!schema || !schema.fn) {
      console.error('No schema found for example:', exampleFile);
      console.error('Schema candidates:', schemaNameCandidates);
      process.exit(1);
    }
    const valid = schema.fn(data);
    if (!valid) {
      console.error(`${exampleFile} example is invalid using schema '${schema.name}'`)
      console.error(JSON.stringify(schema.fn.errors, null, 2));
      process.exit(1)
    }
    const exampleOutPath = outDocsFolder + 'visualization/partials/schemas/examples' + exampleFile.replace('docs/examples/', '/').replace(/\.json$/, '.md');
    fs.mkdirSync(path.dirname(exampleOutPath), {recursive: true})
    fs.writeFileSync(exampleOutPath, '```json\n' + content + '\n```\n')
    console.log(`${exampleOutPath} generated`)
  }));
}

(async () => {
  const converter = new JsonSchemaToMarkdown()
  const json = getSchema('VisualizationSpec')


  const mds = converter.generate('VisualizationSpec', json)

  printRenderedTypes()

  await Promise.all(mds.map(async (md) => {

    const symbolPath = getSymbolPagePath(md.symbol)
    await fs.promises.mkdir(path.dirname(symbolPath), {recursive: true});
    await fs.promises.writeFile(symbolPath, md.pageContent)
    console.log(`${symbolPath} generated with ${md.pageContent.length} bytes`)

    const partialPath = getSymbolPartialPagePath(md.symbol)
    await fs.promises.mkdir(path.dirname(partialPath), {recursive: true});
    await fs.promises.writeFile(partialPath, md.partialContent)
    console.log(`${partialPath} generated with ${md.partialContent.length} bytes`)

    const propertiesPath = getSymbolPartialPropertiesPath(md.symbol)
    await fs.promises.mkdir(path.dirname(propertiesPath), {recursive: true});
    await fs.promises.writeFile(propertiesPath, md.propertiesContent)
    console.log(`${propertiesPath} generated with ${md.propertiesContent.length} bytes`)
  }))

  const entities = {
    VisualizationSpec: json,
    ...json.definitions,
  }
  await generateExamples(entities)
})()
