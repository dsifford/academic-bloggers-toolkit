interface WP_info {
    abt_url: string;
    home_url: string;
    plugins_url: string;
    wp_upload_dir: {
        /* /folder-of-wp-installation/wp-content/uploads */
        basedir: string;
        /* http(s)://siteurl.com/wp-content/uploads */
        baseurl: string;
        error: boolean;
        /* /folder-of-wp-installation/wp-content/uploads/2016/08 */
        path: string;
        /* /2016/08 */
        subdir: string;
        /* http(s)://siteurl.com/wp-content/uploads/2016/08 */
        url: string;
    };
    info: {
        site: {
            language: string;
            name: string;
            plugins: string[];
            theme: string;
            url: string;
        };
        versions: {
            abt: string;
            php: string;
            wordpress: string;
        };
    };
}

interface IRollbar {
    log(msg: string, e?: any): void;
    debug(msg: string, e?: any): void;
    info(msg: string, e?: any): void;
    warning(msg: string, e?: any): void;
    error(msg: string, e?: any): void;
    critical(msg: string, e?: any): void;
}

interface Window {
    ABT: ABT.Globals;
    ABT_EDITOR: {
        bibliography: import('citeproc').Bibliography;
        citations: CSL.Data[];
        style: {
            kind: import('stores/data/constants').StyleKind;
            value: string;
            label: string;
        };
    };
    DocumentTouch?: any;
    Rollbar: IRollbar;
    ajaxurl: string;
}
