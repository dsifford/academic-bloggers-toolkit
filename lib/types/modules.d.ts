import 'bibtex-parse-js';
import 'react';

declare module 'react' {
    interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
        jsx?: boolean;
        global?: boolean;
    }
}
declare module 'bibtex-parse-js' {
    interface BibJSON {
        citationKey: string;
        entryTags: {
            abstract: string;
            // string of "LN, FN MI." separated by "and"
            author: string;
            address: string;
            chapter: string;
            doi: string;
            edition: string;
            institution: string;
            issn: string;
            isbn: string;
            journal: string;
            keywords: string;
            language: string;
            location: string;
            /** 3-letter month - lowercase */
            month: string;
            // tslint:disable-next-line
            number: string;
            /** Number or Range separated with two dashes:  */
            pages: string;
            pagetotal: string;
            pmcid: string;
            pmid: string;
            publisher: string;
            school: string;
            series: string;
            shorttitle: string;
            title: string;
            url: string;
            /** Format: `YYYY-MM-DDTZ` -- example: 2015-06-27TZ */
            urldate: string;
            version: string;
            volume: string;
            volumes: string;
            year: string;
            [k: string]: string;
        };
        entryType: string;
    }

    export function toJSON(str: string): BibJSON[];
}
