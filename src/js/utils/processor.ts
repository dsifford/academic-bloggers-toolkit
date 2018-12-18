import { select } from '@wordpress/data';
import { Citation, Engine } from 'citeproc';

import { localeCache } from 'utils/cache';

export default class Processor {
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

    constructor(style: string) {
        const { instance } = Processor;
        if (instance) {
            if (instance.style !== style) {
                instance.style = style;
                instance.engine = new Engine(instance.sys, instance.style);
                // FIXME: types for this or implement a better way manually
                (instance as any).engine.opt.development_extensions.wrap_url_and_doi = true;
            }
            return instance;
        } else {
            Processor.instance = this;
            this.style = style;
            this.engine = new Engine(this.sys, this.style);
            // FIXME: types for this or implement a better way manually
            (this as any).engine.opt.development_extensions.wrap_url_and_doi = true;
        }
    }

    parseCitations(citations: Citation[]) {
        return this.engine.rebuildProcessorState(citations);
    }

    makeBibliography() {
        return this.engine.makeBibliography();
    }
}
