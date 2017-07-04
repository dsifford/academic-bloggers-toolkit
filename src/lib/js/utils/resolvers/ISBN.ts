export function getFromISBN(ISBN: string): Promise<GoogleBooks.Meta> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN.replace(
            '-',
            ''
        )}`;
        req.open('GET', url);
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                reject(
                    new Error(
                        `${top.ABT_i18n.errors.prefix}: getFromISBN => ${top
                            .ABT_i18n.errors.statusError}`
                    )
                );
                return;
            }
            const res = <GoogleBooks.Response>JSON.parse(req.responseText);
            if (res.totalItems === 0) {
                reject(new Error(`${top.ABT_i18n.errors.noResults}`));
                return;
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
            const payload: GoogleBooks.Meta = {
                authors,
                issued: meta.publishedDate.replace(/-/g, '/'),
                'number-of-pages': meta.pageCount.toString(),
                publisher: meta.publisher,
                title: meta.title,
            };
            resolve(payload);
        });
        req.addEventListener('error', () =>
            reject(
                new Error(
                    `${top.ABT_i18n.errors.prefix}: ${top.ABT_i18n.errors
                        .networkError}`
                )
            )
        );
        req.send(null);
    });
}
