export type Script = {
    create: string
    drop: string
}

export type Template = {
    visualization: any
    queries?: any[]
    scripts?: Script[]
}
