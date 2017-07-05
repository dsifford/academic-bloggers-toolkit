
/**
 * Communicates with AJAX to the WordPress server to retrieve metadata for a given
 *   web URL.
 * @param  {string}               url The URL of interest
 * @return {Promise<ABT.URLMeta>}     URL Meta returned from the server
 */
export function getFromURL(url: string): Promise<ABT.URLMeta> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        const data = `action=get_website_meta&site_url=${encodeURIComponent(
            url
        )}`;
        req.open('POST', (<any>top).ajaxurl);
        req.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
        );
        req.timeout = 5000;
        req.addEventListener('load', () => {
            if (req.status !== 200) {
                reject(
                    new Error(
                        `${top.ABT_i18n.errors.prefix}: getFromURL => ${top
                            .ABT_i18n.errors.statusError}`
                    )
                );
                return;
            }

            const res = <ABT.ExternalSiteMeta>JSON.parse(req.responseText);

            if (res.error) {
                reject(new Error(res.error));
                return;
            }

            const content_title: string =
                res.og.title || res.sailthru.title || res.title!;

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

            const payload: ABT.URLMeta = {
                accessed: new Date(Date.now()).toISOString(),
                authors: res.authors,
                content_title,
                issued,
                site_title,
                url,
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
