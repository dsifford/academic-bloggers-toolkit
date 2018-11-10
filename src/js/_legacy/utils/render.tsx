import { render as Render } from 'react-dom';

type RenderParams = [any, string] | [any, string, () => void];

export async function renderMany(items: RenderParams[]): Promise<void> {
    const tasks = items.map(item => render.apply(null, item));
    await Promise.all(tasks).catch(e => {
        throw e;
    });
}

export default async function render(
    element: any,
    containerId: string,
    callback?: () => void,
): Promise<void> {
    await new Promise<void>(
        (resolve, reject): void => {
            const interval: number = window.setInterval(() => {
                const container = document.getElementById(containerId);
                if (container) {
                    window.clearInterval(interval);
                    Render(element, container, resolve);
                }
                if (!container && document.readyState !== 'loading') {
                    window.clearInterval(interval);
                    reject(
                        new Error(
                            `Could not find element using selector "${containerId}" and document is fully loaded`,
                        ),
                    );
                }
            }, 100);
        },
    );
    return callback ? callback() : void 0;
}
