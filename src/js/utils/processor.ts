import { select } from '@wordpress/data';
import { Citation, Engine } from 'citeproc';
import _ from 'lodash';

import { localeCache } from 'utils/cache';

export default class Processor {
    private static instance: Processor | null = null;
    private style!: string;
    private engine!: Engine;

    private sys: Engine['sys'] = {
        retrieveItem(id: string): CSL.Data {
            return _.cloneDeep(select<CSL.Data>('abt/data').getItemById(id));
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
            }
            return instance;
        } else {
            Processor.instance = this;
            this.style = style;
            this.engine = new Engine(this.sys, this.style);
        }
    }

    parseCitations(citations: Citation[]) {
        return this.engine.rebuildProcessorState(citations);
    }
}
