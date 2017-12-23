import { AutociteResponse } from 'utils/resolvers';

export async function getFromURL(url: string): Promise<AutociteResponse> {
    if (url === 'ERROR') {
        return Promise.reject(new Error('Testing errors'));
    }
    const data: AutociteResponse = {
        fields: {
            accessed: '2018/01/01',
            title: 'Mocked Response Title',
            issued: '2017/01/01',
            'container-title': 'Mocked Site Title',
            URL: url,
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
