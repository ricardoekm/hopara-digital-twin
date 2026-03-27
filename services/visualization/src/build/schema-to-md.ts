import path from 'path'
import {getSymbolLink} from "./symbols.js";

interface Options {
  writeComment?: boolean;
  writeId?: boolean;
  writeRef?: boolean;
  renderSchema?: boolean;
  renderPath?: boolean
  renderAdditionalProperties?: boolean;
}

const defaultOptions: Options = {
  renderPath: false,
  renderSchema: false,
  writeRef: false,
  writeId: false,
  writeComment: false,
  renderAdditionalProperties: false,
}

interface Markdown {
  symbol: string;
  pageContent: string;
  partialContent: string;
  propertiesContent: string;
}

class MarkdownTable {
  private rows: string[][] = [];
  private header: string[] = [];

  addHeader(header: string[]) {
    this.header = header;
  }

  addRow(row: string[]) {
    this.rows.push(row);
  }

  private static renderRow(row: string[]) {
    return '|' + row.join('|') + '|\n';
  }

  toString(): string {
    const header = MarkdownTable.renderRow(this.header);
    const headerSeparator = MarkdownTable.renderRow(this.header.map(h => '-'.repeat(h.length)));
    const rows = this.rows.map(MarkdownTable.renderRow).join('');
    return `${header}${headerSeparator}${rows}`;
  }
}

const renderedTypes = {} as Record<string, true>

export function printRenderedTypes(): void {
  console.log('Rendered types:')
  console.log(Object.keys(renderedTypes).sort().map(t => `  ${t}`).join('\n'))
}

export class JsonSchemaToMarkdown {
  private readonly pathDivider: string;
  private readonly objectNotation: string;
  private options: Options;

  constructor(options: Options = defaultOptions) {
    this.pathDivider = '/'
    this.objectNotation = '&thinsp;.&thinsp;'
    this.options = {...defaultOptions, ...options}
  }

  renderPage(name: string, data: any): string {
    let md = this.renderMainTitle(data.title ?? name)
    md += this.renderPartial(name, data)
    return md
  }

  renderContent(name: string, data: any): string {
    if (data.$ref) {
      return this.renderRef(data.$ref)
    }
    if (typeof data.type === 'string') {
      return this.renderByType(data.type, name, data)
    }
    if (Array.isArray(data.type)) {
      return data.type.map((type: string) => {
        return this.renderByType(type, name, data)
      })
    }
    if (data.anyOf) {
      return 'Any of\n' + data.anyOf.map((item: any) => this.inferType(item))
        .map((item: any) => `* ${item}`)
        .join('\n')
    }
    if(data.oneOf) {
      return 'One of\n' + data.oneOf.map((item: any) => this.inferType(item))
        .map((item: any) => `* ${item}`)
        .join('\n')
    }
    return ''
  }

  renderPartial(name: string, data: any): string {
    return this.renderHeader(name, data) + this.renderContent(name, data)
  }

  generate(name: string, data: any): Markdown[] {
    const mds: Markdown[] = []

    mds.push({
      symbol: name,
      pageContent: this.renderPage(name, data),
      partialContent: this.renderPartial(name, data),
      propertiesContent: this.renderPropertiesTable(name, data),
    })
    Object.keys(data.definitions ?? {}).forEach((key: string) => {
      const definition = data.definitions[key]
      mds.push(...this.generate(key, definition))
    })
    return mds
  }

  renderHeader(symbol: string, data: any): string {
    const firstBlock = [
      this.renderDescription(data.description),
      this.renderExamplesBlock(data.examples),
      this.renderEnumBlock(data.enum)
    ].filter(b => !!b)
    return firstBlock.join('\n\n') + (firstBlock.length ? '\n' : '')
  }

  renderArrayContent(name: string, data: any): string {
    if (Array.isArray(data)) {
      return data.map((item: any) => {
        return this.renderContent('item', item)
      }).join('\n')
    }
    return this.renderContent('item', data)
  }

  renderArray(name: string, data: any): string {
    let md = this.renderAdditionalItems(data.additionalItems)
    if (this.notEmpty(data.minItems) || this.notEmpty(data.maxItems)) {
      md += 'item Count: '
      md += this.renderMinMax(data.minItems, data.maxItems)
    }
    if (this.notEmpty(data.items)) {
      md += this.renderTitleBlock('items')
      md += this.renderArrayContent(name, data.items)
    }
    return md
  }

  renderNumber(name: string, data: any): string {
    const parts = ['number']
    if (this.notEmpty(data.minimum) || this.notEmpty(data.maximum)) {
      parts.push(`range: ${this.renderMinMax(data.minimum, data.maximum)}`)
    }
    if (this.notEmpty(data.exclusiveMinimum) || this.notEmpty(data.exclusiveMaximum)) {
      parts.push(`range: ${this.renderMinMaxExclusive(data.exclusiveMinimum, data.exclusiveMaximum)}`)
    }
    if (this.notEmpty(data.multipleOf)) {
      parts.push(this.writeMultipleOf(data.multipleOf))
    }
    return parts.join('\n')
  }

  renderString(name: string, data: any): string {
    const parts = ['string']
    if(this.notEmpty(data.format)) {
      parts.push(this.renderFormat(data.format))
    }
    if(this.notEmpty(data.pattern)) {
      parts.push(this.renderPattern(data.pattern))
    }
    if (this.notEmpty(data.minLength) || this.notEmpty(data.maxLength)) {
      parts.push('length: ' + this.renderMinMax(data.minLength, data.maxLength))
    }
    return parts.join('\n')
  }

  renderObject(name: string, data: any): string {
    let md = this.renderAdditionalProperties(data.additionalProperties)

    if (this.notEmpty(data.minProperties) || this.notEmpty(data.maxProperties)) {
      md += 'property count: '
      md += this.renderMinMax(data.minProperties, data.maxProperties)
    }

    md += this.renderPropertyNames(data.propertyNames)

    if (Object.keys(data.properties ?? {}).length) {
      md += this.renderTitleBlock('properties') + '\n'
      md += this.renderPropertiesTable(name, data)
    }
    return md
  }

  private capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  public renderPropertiesTable(name: string, data: any) {
    const markdownTable = new MarkdownTable()
    markdownTable.addHeader(['Property', 'Type', 'Description'])
    const requiredFields = (this.empty(data.required)) ? [] : data.required
    for (const propName in data.properties) {
      const property = data.properties[propName]
      const required = (requiredFields?.includes(propName))
      const type = this.capitalizeFirstLetter(this.inferType(property))
      renderedTypes[type] = true

      if (type === 'any of:<br>, ') {
        console.error(`${name} > ${propName}`)
        process.exit(1)
      }
      if (type === 'object') {
        console.error(`Object type not supported in properties`)
        console.error(`${name}>${propName}`)
        process.exit(1)
      }
      if (type === 'array') {
        console.error(`Generic arrays are not supported in properties`)
        console.error(`${name} > ${propName}`)
        process.exit(1)
      }
      if (type === '') {
        console.error(`Empty type not supported in properties`)
        console.error(`${name}>${propName}`)
        process.exit(1)
      }

      markdownTable.addRow([
        this.renderPropertyName(propName),
        type,
        this.renderDescriptionBlock(required, propName, property)
      ])
    }
    return markdownTable.toString()
  }

  renderUnknown(name: string, data: any, pth = ''): string {
    console.error('unknown prop type "', data.type, '" at ' + pth, data)
    return ''
  }

  renderAdditionalItems(bool: boolean): string {
    if (this.notEmpty(bool)) {
      if (bool) {
        return 'this schema <u>does not</u> accept additional items.'
      } else {
        return 'this schema accepts additional items.'
      }
    }
    return ''
  }

  renderAdditionalProperties(bool: boolean): string {
    if (this.notEmpty(bool) && this.options.renderAdditionalProperties) {
      if (!bool) {
        return 'this schema <u>does not</u> accept additional properties.'
      } else {
        return 'this schema accepts additional properties.'
      }
    }
    return ''
  }

  renderDefaultValue(value: string): string {
    if (this.notEmpty(value)) {
      return 'the default is ' + this.valueFormat(value)
    }
    return ''
  }

  renderRequired(value: boolean): string {
    if (value) {
      return '***Required.*** '
    }
    return ''
  }

  renderDescription(description: string): string {
    if (this.notEmpty(description)) {
      return description.replace('\n', '<br>')
    }
    return ''
  }

  renderDescriptionBlock(required: boolean, propName: string, property: any): string {
    const descriptionBlock = [
      this.renderRequired(required) + this.renderDescription(property.description),
      this.renderEnumBlock(property.enum),
      this.renderExamplesBlock(property.examples),
      this.renderDefaultValue(property.default),
    ]
    return this.capitalizeFirstLetter(descriptionBlock.filter(b => !!b).join('<br>'))
  }

  renderEnumBlock(list: unknown[]): string {
    if (this.notEmpty(list)) {
      if (list.length === 1) {
        return 'must be ' + this.valueFormat(list[0])
      }
      return 'any of:<br>' + this.renderList(list)
    }
    return ''
  }

  renderFormat(format: string): string {
      return 'format must be a "' + format + '"'
  }

  renderExamplesBlock(list: unknown[]): string {
    if (this.notEmpty(list)) {
      return 'example values: ' + this.renderList(list)
    }
    return ''
  }

  renderMainTitle(header: string): string {
    if (this.notEmpty(header)) {
      return '# ' + header + '\n'
    }
    return ''
  }

  renderList(list: unknown[]): string {
    if (this.notEmpty(list)) {
      return list.map((item) => this.valueFormat(item)).join(', ')
    }
    return ''
  }

  renderMinMax(min: number, max: number): string {
    if (this.notEmpty(min) && this.notEmpty(max)) {
      return `between \`${min}\` and \`${max}\`\n`
    } else if (this.notEmpty(min)) {
      return `&ge; \`${min}\`\n`
    } else if (this.notEmpty(max)) {
      return `&le; \`${max}\`\n`
    }
    return ''
  }

  renderMinMaxExclusive(min: number, max: number): string {
    if (this.notEmpty(min) && this.notEmpty(max)) {
      return `between \`${min}\` and \`${max}\` (exclusive)\n`
    } else if (this.notEmpty(min)) {
      return `&gt; \`${min}\`\n`
    } else if (this.notEmpty(max)) {
      return `&lt; \`${max}\`\n`
    }
    return ''
  }

  writeMultipleOf(number: number): string {
    return 'multiple of `' + number + '`'
  }

  renderPattern(pattern: RegExp): string {
      return 'must match this pattern: `' + pattern + '`'
  }

  renderPropertyNames(data: any): string {
    if (this.notEmpty(data) && this.notEmpty(data.pattern)) {
      return 'property names must match this pattern: `' + data.pattern + '`'
    }
    return ''
  }

  renderPropertyName(prop: string): string {
    return prop
  }

  renderRef(ref: string): string {
    if (this.notEmpty(ref)) {
      return '[' + path.basename(ref) + '](' + this.refLink(ref) + ')'
    }
    return ''
  }

  renderTitleBlock(name: string): string {
    if (this.notEmpty(name)) {
      return '## ' + name + '\n'
    }
    return ''
  }

  inferType(property: any): string {
    const type = property.type
    const items = property.items
    if (property.$ref) {
      return this.renderRef(property.$ref)
    }
    if (this.notEmpty(type)) {
      if (Array.isArray(type) && type.length) {
        return type.join('`, `')
      }
      if (type === 'array') {
        if (items?.anyOf) {
          return 'array containing any of:<br>' + items.anyOf.map((item: any) => this.inferType(item)).join(', ')
        }
        return this.inferType(items) + '[]'
      }
      if (type === 'string' && property.enum) {
        return this.renderEnumBlock(property.enum)
      }
      if(type === 'object' && property.properties) {
        return `{${Object.entries(property.properties).map(([key, value]) => `${key}: ${this.inferType(value)}`).join(', ')}}`
      }
      if(type === 'object' && property.additionalProperties) {
        return `Dictionary of ${this.inferType(property.additionalProperties)}`
      }
      return type
    }
    if (property.anyOf) {
      return 'any of:<br>' + property.anyOf.map((item: any) => this.inferType(item)).join(', ')
    }
    if (property['$ref']) {
      return this.renderRef(property['$ref'])
    }
    const {...sanitizedProperty} = property
    if (Object.keys(sanitizedProperty).length === 0) {
      return 'mixed'
    }
    return ''
  }

  private renderByType(type: string, name: string, data: any): string {
    switch (type.toLowerCase()) {
      case 'string':
        return this.renderString(name, data)
      case 'integer':
      case 'number':
        return this.renderNumber(name, data)
      case 'object':
        return this.renderObject(name, data)
      case 'array':
        return this.renderArray(name, data)
      // case 'boolean':
      //   return this.renderBoolean(name, data)
      default:
        return this.renderUnknown(name, data)
    }
  }

  valueBool(bool: unknown): string {
    if (typeof bool === 'string') {
      return bool
    } else {
      return (bool) ? 'true' : 'false'
    }
  }

  valueFormat(value: unknown): string {
    if (value === 'true' || value === 'false') {
      return '_' + value + '_'
    } else if (typeof value === 'boolean') {
      return '_' + this.valueBool(value) + '_'
    } else if (typeof value === 'string') {
      return '_"' + value + '"_'
    } else {
      return '`' + value + '`'
    }
  }

  refLink(ref: string): string {
    return getSymbolLink(path.basename(ref))
  }

  empty(value: unknown): boolean {
    return typeof value === 'undefined' || value === null || (typeof value === 'string' && value.length < 1) || (Array.isArray(value) && value.length === 0)
  }

  notEmpty(value: unknown): boolean {
    return !this.empty(value)
  }
}
