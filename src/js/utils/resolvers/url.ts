import uuid from 'uuid/v4';

import { fetchAjax } from 'utils/ajax';
import { firstTruthyValue } from 'utils/data';
import { ResponseError } from 'utils/error';

interface WebpageResponse {
    authors: Array<{
        given: string;
        family: string;
    }>;
    article: {
        /**
         * Facebook URL - not name
         */
        author?: string;
        /**
         * ISO Date String
         */
        modified_time?: string;
        /**
         * ISO Date String
         */
        published_time?: string;
        /**
         * Facebook URL
         */
        publisher?: string;
        /**
         * Category or section of source
         */
        section?: string;
        /**
         * CSV list of tags
         */
        tag?: string;
    };
    /**
     * Published Date ISO string
     */
    issued?: string;
    og: {
        /**
         * Article description
         */
        description?: string;
        /**
         * Height of main image in px
         */
        image_height?: string;
        /**
         * Width of main image in px
         */
        image_width?: string;
        /**
         * urlencoded image url
         */
        image?: string;
        /**
         * Site locale
         */
        locale?: string;
        /**
         * ISO Date String
         */
        pubdate?: string;
        /**
         * Clean URL form of site (e.g. `social.techcrunch.com`)
         */
        site?: string;
        /**
         * Title of website
         */
        site_name?: string;
        /**
         * Title of Article
         */
        title?: string;
        /**
         * Type of posting (generally article)
         */
        type?: string; // tslint:disable-line
        /**
         * ISO Date String
         */
        updated_time?: string;
        /**
         * URL of page
         */
        url?: string;
    };
    sailthru: {
        /**
         * _usually_ is `firstname lastname`
         */
        author?: string;
        /**
         * ISO Date String (issued)
         */
        date?: string;
        /**
         * Article description
         */
        description?: string;
        /**
         * Full-size image URL
         */
        image_full?: string;
        /**
         * Thumbnail image URL
         */
        image_thumb?: string;
        /**
         * CSV list of tags
         */
        tags?: string;
        /**
         * Title of Article
         */
        title?: string;
    };
    /**
     * Title of Article - last resort
     */
    title?: string;
    /**
     * URL of page
     */
    url?: string;
}

export async function get(url: string): Promise<CSL.Data | ResponseError> {
    const response = await fetchAjax('get_website_meta', { url });
    if (!response.ok) {
        return new ResponseError(url, response);
    }
    const json: WebpageResponse = await response.json();
    return {
        id: uuid(),
        type: 'webpage',
        title: firstTruthyValue(json, ['og.title', 'sailthru.title', 'title']),
        URL: url,
        'container-title': json.og.site_name,
        author: json.authors,
        ...parseDateField('accessed', new Date().toISOString()),
        ...parseDateField(
            'issued',
            firstTruthyValue(json, [
                'issued',
                'og.pubdate',
                'article.published_time',
                'sailthru.date',
            ]),
        ),
    };
}

function parseDateField<T extends CSL.DateFieldKey>(
    key: T,
    input?: string,
): { [k in T]: CSL.Date } | {} {
    if (!input || isNaN(Date.parse(input))) {
        return {};
    }
    const date = new Date(input);
    return {
        [key]: {
            raw: [
                date.getUTCFullYear(),
                `0${date.getUTCMonth() + 1}`.slice(-2),
                `0${date.getUTCDate()}`.slice(-2),
            ].join('/'),
        },
    };
}
