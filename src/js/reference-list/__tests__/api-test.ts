jest.mock('utils/resolvers/pubmed');
jest.mock('utils/resolvers/doi');
import { getRemoteData, parseManualData } from '../api';

describe('getRemoteData()', () => {
    it('should retrieve valid PMIDs', async () => {
        const data = await getRemoteData('11111,22222');
        expect(data[0].length).toBe(2);
        expect(data[1].length).toBe(0);
    });
    it('should retrieve valid DOIs', async () => {
        const data = await getRemoteData('10.1097/TA.0000000000001530');
        expect(data[0].length).toBe(1);
        expect(data[1].length).toBe(0);
    });
    it('should retrieve a valid PMCID', async () => {
        const data = await getRemoteData('PMC4359000');
        expect(data[0].length).toBe(1);
        expect(data[1].length).toBe(0);
    });
    it('should handle situations where no id is valid', async () => {
        const data = await getRemoteData('x98asd');
        expect(data[0].length).toBe(0);
        expect(typeof data[1]).toBe('string');
    });
    it('should handle a mixture of ids', async () => {
        const data = await getRemoteData('33333,10.1097/TA.0000000000001546,77777,c98s9d7fa');
        expect(data[0].length).toBe(3);
        expect(typeof data[1]).toBe('string');
    });
});
describe('parseManualData()', () => {
    let data: ABT.ManualData;
    beforeEach(() => {
        data = {
            manualData: {
                id: '12345',
                title: 'Test title',
            },
            people: [
                { family: 'Doe', given: 'John', type: 'author' },
                { family: 'Smith', given: 'Jane', type: 'author' },
            ],
        };
    });
    it('should parse a basic set of manual data', () => {
        const expected = [
            [
                {
                    author: [{ family: 'Doe', given: 'John' }, { family: 'Smith', given: 'Jane' }],
                    id: '12345',
                    title: 'Test title',
                },
            ],
            '',
        ];
        const actual = parseManualData(data);
        expect(actual).toEqual(expected);
    });
    it('should generate an ID if one doesnt exist', () => {
        delete data.manualData.id;
        const parsed = parseManualData(data);
        expect(parsed[0][0].id).not.toBeUndefined();
    });
    it('should handle dates', () => {
        data.manualData.issued = <any>'2003/01/02';
        const parsed = parseManualData(data);
        expect(parsed[0][0].issued).toEqual({ 'date-parts': [['2003', '01', '02']] });
    });
    it('should handle empty fields', () => {
        data.manualData.issue = '';
        const parsed = parseManualData(data);
        expect(parsed[0][0].issue).toBeUndefined();
    });
});
