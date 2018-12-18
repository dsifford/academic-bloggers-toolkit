import { parse as parseBibtex } from 'astrocite-bibtex';
import { parse as parseRis } from 'astrocite-ris';

export async function readFile(file: File): Promise<string> {
    const reader = new FileReader();
    await new Promise(
        (resolve, reject): void => {
            reader.addEventListener('load', resolve);
            reader.addEventListener('error', reject);
            reader.readAsText(file);
        },
    );
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
        case '.ris': {
            const data: CSL.Data[] = parseRis(content);
            return data;
        }
        case '.bib':
        case '.bibtex': {
            const data: CSL.Data[] = parseBibtex(content);
            return data;
        }
        default:
            throw new Error(`Invalid file extension: ${extension}`);
    }
}
