interface Window {
  tinymce: any
}

interface TinyMCEMenuItem {
  text: string
  menu?: TinyMCEMenuItem[]
  onclick?: (e?: Event) => void
  disabled?: boolean
  id?: string
}

interface TinyMCEWindowElement {
  type: string
  name: string
  label: string
  value: string
  tooltip?: string
}

interface TinyMCEWindowMangerObject {
  title: string
  width: number
  height: any
  body?: TinyMCEWindowElement[]
  url?: string
  onclose?: (e?) => void
}

interface TinyMCEPluginButton {
  type: string
  image: string
  title: string
  icon: boolean
  menu: TinyMCEMenuItem[]
  onclick?: (e?: Event) => void
}

interface Author {
  authtype?: string
  clusterid?: string
  name: string
}

interface ReferenceFormData {
  'citation-format': string
  'pmid-input'?: string
  'include-link'?: boolean
  'manual-type-selection'?: string
  authors?: Author[]
}

interface ReferenceObj {
  authors: Author[]
  lastauthor: string
  pages: string
  pubdate: string
  source: string
  title: string
  accessdate?: string
  chapter?: string
  edition?: string
  fulljournalname?: string
  issue?: string
  location?: string
  updated?: string
  url?: string
  volume?: string
}

interface ReferencePayload {
  [i: number]: ReferenceObj
  uids?: string[]
}
