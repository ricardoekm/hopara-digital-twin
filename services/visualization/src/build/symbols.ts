import Case from 'case'
import {outDocsFolder} from "./constants.js";

export interface SymbolDefinition {
  path: string
  symbol: string
  section?: string
}

export const rootSymbol = {
  symbol: 'VisualizationSpec',
  path: 'visualization/domain/visualization/spec/Visualization.ts'
}

export const symbols = [
  rootSymbol,
] as SymbolDefinition[]

export const getSymbolPagePath = (symbol: string) => {
  const symbolDef = symbols.find(s => s.symbol === symbol)
  if (!symbolDef) {
    return `${outDocsFolder}visualization/hidden/${Case.kebab(symbol)}.md`
  }
  return `${outDocsFolder}visualization/${Case.kebab(symbolDef.section ?? 'hidden')}/${Case.kebab(symbol)}.md`
}

export const getSymbolPartialPagePath = (symbol: string) => {
  return `${outDocsFolder}visualization/partials/schemas/pages/${Case.kebab(symbol)}.md`
}

export const getSymbolPartialPropertiesPath = (symbol: string) => {
  return `${outDocsFolder}visualization/partials/schemas/properties/${Case.kebab(symbol)}.md`
}

export const getSymbolLink = (symbol: string) => {
  const symbolDef = symbols.find(s => s.symbol === symbol)
  if (!symbolDef) {
    return `/docs/hidden/${Case.kebab(symbol)}.html`
  }
  return `/docs/${Case.kebab(symbolDef.section ?? 'hidden')}/${Case.kebab(symbol)}.html`
}
