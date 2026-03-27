export enum Language {
  PT_BR = 'pt-BR',
  EN = 'en'
}

export const isPortuguese = (language: string) => language === 'pt' || language.startsWith('pt-')

export const getLanguage = (): Language => {
  return isPortuguese(navigator.language) ? Language.PT_BR : Language.EN
}
