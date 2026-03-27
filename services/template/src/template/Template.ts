export type Script = {
  create: string[],
  drop: string[]
}

export interface Template {
  id: string
  visualizations: string[]
  queries?: string[]
  scripts?: Script
  images: string[]
}
