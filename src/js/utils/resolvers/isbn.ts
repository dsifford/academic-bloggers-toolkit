export interface BookMeta {
    authors: Array<{
        family: string;
        given: string;
        // tslint:disable-next-line
        type: 'author';
    }>;
    /** 2012-06-07 */
    issued: string;
    'number-of-pages': string;
    publisher: string;
    title: string;
}

interface Item {
    volumeInfo: {
        authors: string[];
        pageCount: number;
        /** "2016-07-31" */
        publishedDate: string;
        publisher: string;
        title: string;
    };
}

interface APIResponse {
    items: Item[];
    kind: string;
    totalItems: number;
}

export async function getFromISBN(ISBN: string): Promise<BookMeta> {
    const req = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN.replace('-', '')}`,
    );
    if (!req.ok) {
        throw new Error(
            `${top.ABT.i18n.errors.prefix}: getFromISBN => ${top.ABT.i18n.errors.statusError}`,
        );
    }
    const res: APIResponse = await req.json();

    if (res.totalItems === 0) {
        throw new Error(`${top.ABT.i18n.errors.noResults}`);
    }

    const meta = res.items[0].volumeInfo;
    const authors = meta.authors.map(y => {
        const t = y.split(' ');
        if (t.length > 3) {
            return {
                family: t.slice(1).join(' '),
                given: t[0],
                type: <'author'>'author',
            };
        }
        const [a, b, c] = t;
        if (c === undefined) {
            return {
                family: b,
                given: a,
                type: <'author'>'author',
            };
        }
        return {
            family: c,
            given: `${a}, ${b}`,
            type: <'author'>'author',
        };
    });
    return {
        authors,
        issued: meta.publishedDate.replace(/-/g, '/'),
        'number-of-pages': meta.pageCount.toString(),
        publisher: meta.publisher,
        title: meta.title,
    };
}
