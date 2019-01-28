import { AutociteResponse } from '../';

export async function getFromISBN(
    ISBN: string,
    kind: 'book' | 'chapter',
): Promise<AutociteResponse> {
    const titleKey = kind === 'chapter' ? 'container-title' : 'title';
    const data: AutociteResponse = {
        fields: {
            ISBN,
            issued: '2017/01/01',
            'number-of-pages': '100',
            [titleKey]: 'Mocked Response Title',
            publisher: 'Mocked Publisher',
        },
        people: [
            {
                type: 'author',
                given: 'John',
                family: 'Doe',
            },
            {
                type: 'author',
                given: 'Jane',
                family: 'Smith',
            },
        ],
    };
    return Promise.resolve(data);
}
