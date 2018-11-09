type F = File | Blob;

async function readFile(file: F, kind: 'ArrayBuffer'): Promise<ArrayBuffer>;
async function readFile(file: F, kind: 'DataURL' | 'Text'): Promise<string>;
async function readFile(file: F, kind: string): Promise<string | ArrayBuffer> {
    const reader = new FileReader();
    await new Promise(
        (resolve, reject): void => {
            reader.addEventListener('load', resolve);
            reader.addEventListener('error', reject);
            switch (kind) {
                case 'ArrayBuffer':
                    reader.readAsArrayBuffer(file);
                    break;
                case 'DataURL':
                    reader.readAsDataURL(file);
                    break;
                case 'Text':
                    reader.readAsText(file);
                    break;
                default:
                    reject(
                        new TypeError(
                            '"kind" parameter must be one of ArrayBuffer, DataURL, or Text',
                        ),
                    );
            }
        },
    );
    return reader.result || '';
}

export default readFile;
