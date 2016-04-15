interface Window {
  tinyMCE: tinyMCE
}

interface tinyMCE {
  DOM: any
  EditorManager: any
  EditorObservable: any
  Env: any
  WindowManager: any
  activeEditor: tinyMCEEditor
  add: (a:any) => any
  dom: any
  editors: any[]
  remove: (e?: any) => void
}

interface tinyMCEEditor {
  addButton: (any) => any
  buttons: any
  container: any
  contentDocument: HTMLDocument
  contentWindow: Window
  controlManager: any
  dom: any
  editorCommands: any
  editorContainer: any
  editorManager: any
  editorUpload: any
  insertContent(any): any
  plugins: any
  settings: any
  target: any
  windowManager: TinyMCEWindowManager
  wp: any
}

interface TinyMCEWindowManager {
  alert: (a?:any) => any
  close: (a?:any) => any
  confirm: (a?:any) => any
  createInstance: (a?:any) => any
  editor: tinyMCEEditor
  getParams: (a?:any) => any
  getWindows: (a?:any) => any
  onClose: any
  onOpen: any
  open: (a?:any) => any
  parent: any
  setParams: (a?:any) => any
  windows: any
  wp: any
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
  name?: string
  firstname?: string
  lastname?: string
  middleinitial?: string
}

interface CommonMeta {
  title: string
  source: string
  pubdate: string
}

interface BookMeta extends CommonMeta {
  chapter: string
  edition: string
  location: string
  pages: string
}

interface JournalMeta extends CommonMeta {
  volume: string
  issue: string
  pages: string
}

interface WebsiteMeta extends CommonMeta {
  url: string
  updated: string
  accessed: string
}

interface ManualDataObj {
  authors: Author[]
  meta: {
    book: BookMeta
    journal: JournalMeta
    website: WebsiteMeta
  }
  type: 'journal'|'website'|'book'
}

interface ReferenceFormData {
  addManually: boolean
  attachInline: boolean
  citationFormat: string
  includeLink: boolean
  manualData: ManualDataObj
  pmidList: string
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
