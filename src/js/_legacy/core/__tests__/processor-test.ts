jest.mock('stores/cache/csl-cache');
jest.mock('stores/cache/locale-cache');

const { CSL } = require('citeproc');

import Store from '_legacy/stores/data';
import { Processor } from '../processor';

declare const ABT: ABT.Globals;

(<any>window).CSL = CSL;

const setup = () => {
    const store = new Store({ ...ABT.state });
    const processor = new Processor(store);
    return {
        processor,
        store,
    };
};

describe('CSLProcessor', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        (<any>window).sessionStorage = new (<any>window).StorageMock();
        (<any>window).localStorage = new (<any>window).StorageMock();
    });
    it('should work', async () => {
        const { processor } = setup();
        expect(true).toBeTruthy();
        await processor.init();
    });
});
