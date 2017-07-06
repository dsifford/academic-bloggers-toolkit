/**
 * Communicates with AJAX to the WordPress server to retrieve metadata for a given web URL.
 * @param url - The URL of interest
 * @return URL Meta returned from the server
 */
export function getFromURL(url: string): Promise<ABT.URLMeta> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        const data = `action=get_website_meta&site_url=${encodeURIComponent(
            url
        )}`;
        req.open('POST', top.ajaxurl);
        req.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
        );
        req.timeout = 5000;
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                return reject(
                    new Error(
                        `${top.ABT_i18n.errors.prefix}: getFromURL => ${top
                            .ABT_i18n.errors.statusError}`
                    )
                );
            }

            const res = <ABT.ExternalSiteMeta>JSON.parse(req.responseText);

            if (res.error) return reject(new Error(res.error));

            const content_title =
                res.og.title || res.sailthru.title || res.title || '';
            const site_title = res.og.site_name || '';
            let issued =
                res.issued ||
                res.og.pubdate ||
                res.article.published_time ||
                res.sailthru.date ||
                '';

            if (issued !== '') {
                issued = new Date(issued).toISOString();
            }

            resolve({
                accessed: new Date(Date.now()).toISOString(),
                authors: res.authors,
                content_title,
                issued,
                site_title,
                url,
            });
        });
        req.addEventListener('error', () =>
            reject(
                new Error(
                    `${top.ABT_i18n.errors.prefix}: ${top.ABT_i18n.errors
                        .networkError}`
                )
            )
        );
        req.addEventListener('timeout', () =>
            reject(
                new Error(
                    `${top.ABT_i18n.errors.prefix}: ${top.ABT_i18n.errors
                        .denied}`
                )
            )
        );
        req.send(data);
    });
}
