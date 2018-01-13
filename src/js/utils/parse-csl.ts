import readFile from 'utils/read-file';

export default async function parseCSL(file: File): Promise<ABT.CitationStyle> {
    const content = await readFile(file, 'Text');
    const xml = new DOMParser().parseFromString(content, 'application/xml');
    const error = xml.querySelector('parsererror');
    const label = xml.querySelector('info title');
    if (error || !label || !label.textContent) {
        throw new Error(top.ABT.i18n.errors.filetype_error);
    }
    return {
        kind: 'custom',
        value: content,
        label: label.textContent,
    };
}
