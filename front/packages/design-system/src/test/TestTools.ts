import Case from 'case'

export const labelToTestId = (label: string): string => {
  return Case.kebab(label.replace(/…/g, ''))
}
