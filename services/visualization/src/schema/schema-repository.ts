import * as fs from 'fs'
import {resolve} from 'path'
import {AxiosInstance} from 'axios'
import {Logger} from '@hopara/logger'
import {VscodeSchemaValidator} from '@hopara/schema-validator'
import {SymbolDefinition, symbols} from '../build/symbols.js'
import {SchemaValidationError} from './SchemaValidationError.js'

const packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

function clone(obj: any): any {
  return JSON.parse(JSON.stringify(obj))
}

const findSchemaBySymbol = (symbol: string): SymbolDefinition | undefined => {
  return symbols.find((s) => s.symbol === symbol)
}

export const getCurrentAppVersion = (): string => {
  if (packageJSON.version) {
    const [major, minor] = packageJSON.version.split('.')
    return `${major}.${minor}`
  }
  return '0.0'
}

const TEST_SCHEMA_URL = 'https://schema.test.hopara.app/app'
const PROD_SCHEMA_URL = 'https://schema.hopara.app/app'

export const getSchemaEndpoint = (): string => {
  if (process.env.SCHEMA_URL === TEST_SCHEMA_URL) return TEST_SCHEMA_URL
  return PROD_SCHEMA_URL
}

export const getSchemaId = (schemaVersion?: string, symbol?: string): string => {
  const endpoint = getSchemaEndpoint()
  const version = schemaVersion ?? getCurrentAppVersion()
  const symbolSuffix = symbol === 'VisualizationSpec' ? '' : symbol ? `-${symbol.toLowerCase()}` : ''
  return `${endpoint}/${version}${symbolSuffix}`
}

export const resolveSchemaPath = (schemaData: SymbolDefinition): string => {
  const version = getCurrentAppVersion()
  const name = schemaData.symbol === 'VisualizationSpec' ? version : `${version}-${String(schemaData.symbol).toLowerCase()}`
  const fileName = name + '.json'
  return resolve('out/schemas', fileName)
}

const symbolSchemas = {} as Record<string, any>

export const sanitizeSymbol = (symbol?: string): string | undefined => {
  if (!symbol) return
  return symbol.replace('#/definitions/', '')
}

const schemaCache = {} as Record<string, any>

export const getSchema = (symbol: string): any => {
  if (symbol === 'VisualizationSpec') {
    const schemaPath = resolveSchemaPath(findSchemaBySymbol(symbol) as SymbolDefinition)
    if (!schemaCache[schemaPath]) {
      schemaCache[schemaPath] = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))
    }

    return schemaCache[schemaPath]
  }
  const rootSchema = getSchema('VisualizationSpec')
  if (symbolSchemas[symbol]) {
    return symbolSchemas[symbol]
  }
  const schemaData = findSchemaBySymbol(symbol)
  if (schemaData) {
    symbolSchemas[symbol] = JSON.parse(fs.readFileSync(resolveSchemaPath(schemaData), 'utf-8'))
    symbolSchemas[symbol].definitions = clone(rootSchema.definitions)
    return symbolSchemas[symbol]
  }
  const schema = clone(rootSchema.definitions[symbol])
  if (!schema) {
    throw new Error(`Schema for symbol ${symbol} not found`)
  }
  schema.definitions = clone(rootSchema.definitions)
  symbolSchemas[symbol] = schema
  return schema
}


export class SchemaRepository {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly logger: Logger,
  ) {
  }

  async validateSchema(
    input: Buffer | Record<string, any>,
    schema: Record<string, any>
  ): Promise<void> {
    this.logger.debug(`validating schema: ${schema.$id}`)

    const validator = new VscodeSchemaValidator()
    const errors = await validator.validate(input as Buffer, schema)
    if (errors?.length) {
      throw errors.map((e) => ({
        ...e,
        message: `${e.message} path: ${e.path.join('->')}`,
      }))
    }
  }

  async getSchemaFromURL(schemaURL: string): Promise<Record<string, any> | null> {
    try {
      const schemaResponse = await this.httpClient.get(schemaURL)
      if (!schemaResponse.data.$id) return null

      return schemaResponse.data
    } catch {
      this.logger.error(`error getting schema: ${schemaURL}`)
      return null
    }
  }

  isSchemaURLValid(schemaURL: string): boolean {
    return !!schemaURL && (schemaURL.indexOf(TEST_SCHEMA_URL) >= 0 || schemaURL.indexOf(PROD_SCHEMA_URL) >= 0)
  }

  async tryValidate(input: Buffer, schemaURL?: string): Promise<void | SchemaValidationError> {
    this.logger.debug(`should validate schema with url: ${schemaURL}`)

    const url = this.isSchemaURLValid(schemaURL!) ? schemaURL : getSchemaId()
    this.logger.debug(`validating external schema with url: ${url}`)

    let schema: Record<string, any> | null
    if (['development', 'test'].includes(process.env.NODE_ENV!) && url === getSchemaId()) {
      schema = await getSchema('VisualizationSpec')
    } else {
      schema = await this.getSchemaFromURL(url!)
    }
    // eslint-disable-next-line no-throw-literal
    if (!schema) throw [{message: 'Schema not found', $schema: url}] as any[]

    try {
      await this.validateSchema(input, schema)
    } catch (e) {
      return new SchemaValidationError(e)
    }
  }

  async validate(input: Buffer, schemaURL?: string): Promise<void> {
    const error = await this.tryValidate(input, schemaURL)
    if (error) {
      throw error.errors
    }
  }
}
