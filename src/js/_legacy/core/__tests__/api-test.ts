jest.mock('utils/resolvers/pubmed');
jest.mock('utils/resolvers/doi');
import { getRemoteData } from '../api';

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
        const data = await getRemoteData(
            '33333,10.1097/TA.0000000000001546,77777,c98s9d7fa',
        );
        expect(data[0].length).toBe(3);
        expect(typeof data[1]).toBe('string');
    });
});
