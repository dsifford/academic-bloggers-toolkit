interface String {
  toTitleCase(): string
}

interface TinyMCEMenuItem {
  text: string
  menu?: TinyMCEMenuItem[]
  onclick?: (e?: Event) => void
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
  onclose?: (e?: Event) => void
}

interface TinyMCEPluginButton {
  type: string
  image: string
  title: string
  icon: boolean
  menu: TinyMCEMenuItem[]
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
  title: string
  source: string
  pubdate: string
  pages: string
  lastauthor: string
  issue?: string
  volume?: string
  fulljournalname?: string
  url?: string
  accessdate?: string
}

interface ManualReference extends ReferenceObj {
  /** FIXME */
}

interface ReferencePayload {
  [i: number]: ReferenceObj
  uids?: string[]
}
