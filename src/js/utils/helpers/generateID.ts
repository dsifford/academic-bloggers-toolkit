/**
 * Creates a "unique" ID value to be used for an ID field.
 * @return {string}  Unique ID.
 */
export function generateID(): string {
    return (
        String.fromCharCode(97 + Math.floor(Math.random() * 26)) +
        Math.round(Math.random() * Date.now()).toString(30)
    );
}
