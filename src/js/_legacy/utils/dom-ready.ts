/**
 * A better jQuery `$(document).ready()`
 */
export default async function domReady(): Promise<{}> {
    return new Promise<{}>(
        (resolve): void => {
            if (document.readyState !== 'loading') {
                return resolve();
            } else {
                document.addEventListener('DOMContentLoaded', resolve);
            }
        },
    );
}
