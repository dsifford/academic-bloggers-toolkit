export { getFromDOI } from './doi';
export { getFromPubmed, pubmedQuery } from './pubmed';
export { getFromISBN } from './isbn';
export { getFromURL } from './url';

type StringFields = { [k in CSL.StandardFieldKey | CSL.DateFieldKey]?: string };
type PersonFields = ABT.Contributor[];
export interface AutociteResponse {
    fields: StringFields;
    people: PersonFields;
}
