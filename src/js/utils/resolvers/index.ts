import * as DOI from './doi';
import * as ISBN from './isbn';
import * as Pubmed from './pubmed';
import * as URL from './url';

export { DOI, ISBN, Pubmed, URL };

/**
 * @deprecated
 */
type StringFields = {
    [k in CSL.StringFieldKey | CSL.NumberFieldKey | CSL.DateFieldKey]?: string
};

/**
 * @deprecated
 */
type PersonFields = ABT.Contributor[];

/**
 * @deprecated
 */
export interface AutociteResponse {
    fields: StringFields;
    people: PersonFields;
}

export { deprecatedGetFromDOI } from './doi';
export { deprecatedGetFromPubmed, deprecatedPubmedQuery } from './pubmed';
export { deprecatedGetFromISBN } from './isbn';
export { deprecatedGetFromURL } from './url';
