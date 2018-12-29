import { addQueryArgs } from '@wordpress/url';
import { parseName } from 'astrocite-core';

import { ResponseError } from 'utils/error';

import { AutociteResponse } from './';

interface ISBNResponse {
    items: Array<{
        id: string;
        volumeInfo: {
            authors?: string[];
            pageCount?: number;
            /**
             * "2016-07-31"
             */
            publishedDate?: string;
            publisher?: string;
            title?: string;
        };
    }>;
    kind: string;
    totalItems: number;
}

export async function get(
    ISBN: string,
    isChapter: boolean = false,
): Promise<CSL.Data | ResponseError> {
    const response = await fetch(
        addQueryArgs('https://www.googleapis.com/books/v1/volumes', {
            q: `isbn:${ISBN.replace(/-/g, '')}`,
        }),
    );
    if (!response.ok) {
        return new ResponseError(ISBN, response);
    }
    const json: ISBNResponse = await response.json();

    if (json.totalItems === 0) {
        return new ResponseError(ISBN, response);
    }

    // TODO: move this all to astrocite
    const {
        id,
        volumeInfo: { authors, pageCount, publishedDate, publisher, title },
    } = json.items[0];

    let data: CSL.Data = {
        id,
        type: isChapter ? 'chapter' : 'book',
        ISBN,
        publisher,
        'number-of-pages': pageCount,
        [isChapter ? 'container-title' : 'title']: title,
        author: Array.isArray(authors)
            ? // FIXME: fix this in astrocite
              (authors.map(parseName) as CSL.Person[])
            : [],
    };

    if (publishedDate) {
        const [year, month, day] = publishedDate.split('-');
        data = {
            ...data,
            issued: {
                'date-parts': [[year, month, day]],
            },
        };
    }

    return data;
}

/**
 * @deprecated
 */
export async function deprecatedGetFromISBN(
    ISBN: string,
    kind: 'book' | 'chapter',
): Promise<AutociteResponse> {
    const req = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN.replace(
            '-',
            '',
        )}`,
    );
    if (!req.ok) {
        throw new Error(
            `${top.ABT.i18n.errors.prefix}: getFromISBN => ${
                top.ABT.i18n.errors.status_error
            }`,
        );
    }
    const res: ISBNResponse = await req.json();

    if (res.totalItems === 0) {
        throw new Error(`${top.ABT.i18n.errors.no_results}`);
    }

    const {
        authors,
        pageCount,
        publishedDate,
        publisher,
        title,
    } = res.items[0].volumeInfo;

    const author: ABT.Contributor[] = Array.isArray(authors)
        ? authors.map(person => {
              const fields = parseName(person);
              return {
                  ...fields,
                  type: 'author' as 'author',
                  given: fields.given || '',
                  family: fields.family || '',
              };
          })
        : [];
    const titleKey = kind === 'chapter' ? 'container-title' : 'title';

    return {
        fields: {
            ISBN,
            issued:
                typeof publishedDate === 'string'
                    ? publishedDate.replace(/-/g, '/')
                    : '',
            'number-of-pages':
                typeof pageCount === 'number' ? pageCount.toString() : '',
            [titleKey]: title || '',
            publisher: publisher || '',
        },
        people: author,
    };
}
