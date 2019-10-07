import { __ } from '@wordpress/i18n';
import { parse as parseBibtex } from 'astrocite-bibtex';
import { parse as parseRis } from 'astrocite-ris';

import { Style } from 'stores/data';
import { StyleKind } from 'stores/data/constants';

export async function readFile(file: File): Promise<string> {
    const reader = new FileReader();
    await new Promise((resolve, reject): void => {
        reader.addEventListener('load', resolve);
        reader.addEventListener('error', reject);
        reader.readAsText(file);
    });
    if (typeof reader.result !== 'string') {
        throw new Error('Error reading file.');
    }
    return reader.result;
}

export async function readReferencesFile(file: File): Promise<CSL.Data[]> {
    const extension = file.name
        .substring(file.name.lastIndexOf('.'))
        .toLowerCase();
    const content = await readFile(file);
    switch (extension) {
        case '.ris':
            return parseRis(content);
        case '.bib':
        case '.bibtex':
            return parseBibtex(content);
        default:
            throw new Error(`Invalid file extension: ${extension}`);
    }
}

export async function parseCSL(file: File): Promise<Style> {
    const content = await readFile(file);
    const xml = new DOMParser().parseFromString(content, 'application/xml');
    const error = xml.querySelector('parsererror');
    const label = xml.querySelector('info title');
    const shortTitle = xml.querySelector('info title-short');
    if (error) {
        const message = error.querySelector('div');
        throw new Error(
            message && message.textContent
                ? message.textContent
                : __('Error parsing CSL file.', 'academic-bloggers-toolkit'),
        );
    }
    if (!label || !label.textContent) {
        throw new Error(
            __('Error parsing CSL file.', 'academic-bloggers-toolkit'),
        );
    }
    // trim away unnecessary whitespace
    const value = content
        .replace(/(?:[\r\n]|<!--.*?-->)/g, '')
        .replace(/(>)(\s+?)(<)/g, '$1$3');
    return {
        kind: StyleKind.CUSTOM,
        value,
        label: label.textContent,
        shortTitle:
            shortTitle && shortTitle.textContent
                ? shortTitle.textContent
                : undefined,
    };
}
