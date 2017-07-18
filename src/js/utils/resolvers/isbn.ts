export interface BookMeta {
    title: string;
    'number-of-pages': string;
    publisher: string;
    /** 2012-06-07 */
    issued: string;
    authors: Array<{
        // tslint:disable-next-line
        type: 'author';
        family: string;
        given: string;
    }>;
}

interface Item {
    volumeInfo: {
        title: string;
        // subtitle: string;
        authors: string[];
        publisher: string;
        /** "2016-07-31" */
        publishedDate: string;
        pageCount: number;
    };
}

interface APIResponse {
    kind: string;
    totalItems: number;
    items: Item[];
}

export async function getFromISBN(ISBN: string): Promise<BookMeta> {
    const req = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN.replace('-', '')}`
    );
    if (!req.ok) {
        throw new Error(
            `${top.ABT_i18n.errors.prefix}: getFromISBN => ${top.ABT_i18n.errors.statusError}`
        );
    }
    const res: APIResponse = await req.json();

    if (res.totalItems === 0) {
        throw new Error(`${top.ABT_i18n.errors.noResults}`);
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
