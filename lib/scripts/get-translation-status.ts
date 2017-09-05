import * as puppeteer from 'puppeteer';
import * as devices from 'puppeteer/DeviceDescriptors';

async function screenshotDOMElement(page: any, opts: any = {}) {
    const padding = 'padding' in opts ? opts.padding : 0;
    const path = 'path' in opts ? opts.path : null;
    const selector = opts.selector;

    if (!selector) throw Error('Please provide a selector.');

    const rect = await page.evaluate((sel: any) => {
        const element = document.querySelector(sel);
        if (!element) return null;
        const { x, y, width, height } = element.getBoundingClientRect();
        return { left: x, top: y, width, height, id: element.id };
    }, selector);

    if (!rect) throw Error(`Could not find element that matches selector: ${selector}.`);

    return await page.screenshot({
        path,
        clip: {
            x: rect.left - padding,
            y: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
        },
    });
}

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.emulate(devices['iPhone 6']);
    await page.goto('https://poeditor.com/join/project/PGYLKWQM5h');
    await screenshotDOMElement(page, {
        path: '.github/translations-incomplete.png',
        selector: '#join-project > div:nth-of-type(1)',
        // padding: 16,
    });
    await screenshotDOMElement(page, {
        path: '.github/translations-complete.png',
        selector: '#join-project > div:nth-of-type(2)',
        padding: 5,
    });
    browser.close();
})();
