import {i18n} from '@hopara/i18n'
import {v4 as uuidv4} from 'uuid'
import wordsToNumbers from '@hopara/multilingual-number-parser'
import {naturalCompare} from '@discoveryjs/natural-compare'

function ordinalToNumber(token: string) {
  let numbers: string | string[] | number | number[]
  try {
    numbers = wordsToNumbers(token, {language: (window.navigator.language.toLowerCase() ?? 'en-us') as any})
  } catch {
    return []
  }
  if (typeof numbers === 'number') return [numbers.toString()]
  if (Array.isArray(numbers)) return numbers.map((number) => number.toString())
  return (numbers.match(/[\w-]+/g) ?? [])
    .filter((token) => token.length > 0)
    .map((token) => token.replace(/(\d+)(st|nd|rd|th|º|ª)/g, '$1'))
}

function getAcronymByName(name: string | number): string {
  if (typeof name === 'number') {
    name = name.toString()
  }

  if (name.length === 0) return '?'

  if ( name.includes('/') ) {
    return name.toUpperCase()
  }

  const normalizedName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  const numbers = ordinalToNumber(normalizedName)
  const number = numbers.find((number) => {
    if (number) {
      return /^-?[0-9]+$/.test(number.toString())
    }
  })
  if (number) {
    return number.toString().toUpperCase()
  }
  const tokens = (normalizedName.match(/[\w-]+/g) ?? [])
    .filter((token) => token.length > 0)
  const letter = tokens.find((token) => token.match(/^[a-z]$/))
  if (letter) return letter.toUpperCase()
  if (tokens[0].match(/^[a-z].*/)) return tokens[0].substring(0, 1).toUpperCase()
  return '?'
}

export class Floor {
  id: string
  name: string
  acronym: string

  constructor(props: Partial<Floor> | string) {
    if (typeof props === 'string') {
      props = {name: props}
    }
    this.name = props.name ?? i18n('FLOOR_NAME')
    this.id = props.id ?? uuidv4()
    this.acronym = props.acronym ?? getAcronymByName(this.name)
  }

  getTooltip() {
    if (this.name.toString() === this.acronym) return `${i18n('FLOOR')} ${this.acronym}`
    return this.name.toString()
  }

  setName(name: string) {
    this.name = name
    this.acronym = getAcronymByName(name)
  }
  compare(other: Floor) {
    return naturalCompare(this.acronym, other.acronym)
  }
  equals(other: Floor) {
    return this.acronym === other.acronym
  }
}
