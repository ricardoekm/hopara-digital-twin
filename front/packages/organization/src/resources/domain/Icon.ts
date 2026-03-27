export interface Icon {
  name: string
}

export interface ListIconResponse {
  icons: Icon[]
  nextPageToken?: string
}

export interface IconLibrary {
  name: string
  editable?: boolean

  icons?: Icon[]
}
