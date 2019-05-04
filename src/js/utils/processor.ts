import { select } from '@wordpress/data';
import { Bibliography as RawBib, Bibmeta, Citation, Engine } from 'citeproc';
import { flatten, zipWith } from 'lodash';

import { localeCache } from 'utils/cache';

namespace Processor {
    export interface BibItem {
        content: string;
        id: string;
    }

    export type BibMeta = Partial<
        Pick<
            Bibmeta,
            'entryspacing' | 'hangingindent' | 'linespacing' | 'maxoffset'
        > & {
            secondFieldAlign: Bibmeta['second-field-align'];
        }
    >;

    export interface Bibliography {
        items: BibItem[];
        meta: BibMeta;
    }

    export interface CitationMeta {
        /**
         * ID of the citation HTMLElement.
         */
        id: string;
        /**
         * Parsed citation HTML to set as the citation HTMLElement innerHTML.
         */
        html: string;
        /**
         * A JSON stringified list of the sorted item ids in the citation.
         */
        sortedItems: string;
    }
}
class Processor {
    private static instance: Processor | null = null;
    private style!: string;
    private engine!: Engine;

    private sys: Engine['sys'] = {
        retrieveItem(id: string): CSL.Data {
            const item = select('abt/data').getItemById(id);
            if (!item) {
                throw new Error(
                    `CSL Data could not be found for item ID "${id}"`,
                );
            }
            return item;
        },
        retrieveLocale(lang: string) {
            const locale = localeCache.getItem(lang);
            if (!locale) {
                throw new Error(
                    `Requested locale "${lang}" was not prefetched`,
                );
            }
            return locale;
        },
    };

    /* eslint-disable @typescript-eslint/camelcase */
    constructor(style: string) {
        const { instance } = Processor;
        if (instance) {
            if (instance.style !== style) {
                instance.style = style;
                instance.engine = new Engine(instance.sys, instance.style);
                instance.engine.opt.development_extensions.wrap_url_and_doi = true;
            }
            return instance;
        } else {
            Processor.instance = this;
            this.style = style;
            this.engine = new Engine(this.sys, this.style);
            this.engine.opt.development_extensions.wrap_url_and_doi = true;
        }
    }
    /* eslint-enable @typescript-eslint/camelcase */

    parseCitations(citations: Citation[]): Processor.CitationMeta[] {
        return this.engine
            .rebuildProcessorState(citations)
            .map(([id, , html]) => {
                const sortedItems = JSON.stringify(
                    this.registry.citationById[id].sortedItems.map(
                        ([ref]) => ref.id,
                    ),
                );
                return {
                    id,
                    html,
                    sortedItems,
                };
            });
    }

    get bibliography(): Processor.Bibliography {
        let data: RawBib | false;
        try {
            data = this.engine.makeBibliography();
            if (!data) {
                return { items: [], meta: {} };
            }
        } catch {
            return { items: [], meta: {} };
        }
        const [meta, html] = data;
        const {
            entryspacing,
            hangingindent,
            linespacing,
            maxoffset,
            ['second-field-align']: secondFieldAlign,
        } = meta;
        return {
            meta: {
                entryspacing,
                hangingindent,
                linespacing,
                maxoffset,
                secondFieldAlign: secondFieldAlign
                    ? secondFieldAlign
                    : undefined,
            },
            items: zipWith(flatten(meta.entry_ids), html, (id, content) => ({
                id,
                content,
            })),
        };
    }

    private get registry() {
        return this.engine.registry.citationreg;
    }
}

export default Processor;
