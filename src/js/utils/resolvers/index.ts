import * as DOI from './doi';
import * as Pubmed from './pubmed';

type StringFields = { [k in CSL.StandardFieldKey | CSL.DateFieldKey]?: string };
type PersonFields = ABT.Contributor[];

export interface AutociteResponse {
    fields: StringFields;
    people: PersonFields;
}

export { deprecatedGetFromDOI as getFromDOI } from './doi';
export { getFromPubmed, pubmedQuery } from './pubmed';
export { getFromISBN } from './isbn';
export { getFromURL } from './url';

export { DOI, Pubmed };
