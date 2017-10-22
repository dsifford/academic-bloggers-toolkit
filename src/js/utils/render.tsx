import { render as Render } from 'react-dom';

export default function render(component: any, selector: string) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            Render(component, element);
            clearInterval(interval);
        }
        if (!element && document.readyState === 'interactive') {
            clearInterval(interval);
            throw new Error(
                `Could not find element using selector "${selector}" and document is fully loaded`,
            );
        }
    }, 100);
}
