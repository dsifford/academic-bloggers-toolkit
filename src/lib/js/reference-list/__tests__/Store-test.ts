jest.disableAutomock();

const reflistState = require('../../../../../scripts/fixtures').reflistState;
import { Store } from '../Store';

const testState = reflistState;
const stateCopy = JSON.parse(JSON.stringify(testState));

describe('Reflist Store', () => {

    let store;

    describe('Citation Store', () => {
        beforeEach(() => {
            store = new Store(testState);
        });

        it('should return a "lookup" correctly', () => {
            expect(store.citations.lookup).toEqual(
                {
                    ids: ['citationId'],
                    titles: ['Test Title'],
                }
            );
        });

        it('should return citationByIndex as JS object', () => {
            expect(store.citations.citationByIndex).toEqual(stateCopy.citationByIndex);
        });

        it('should call init', () => {
            expect(store.citations.init(store.citations.citationByIndex)).toBeUndefined();
        });

        it('should handle an undefined language in cleanCSL', () => {
            let cite = store.citations.CSL.get('citationId');
            cite.language = 'gibberish';
            store.citations.CSL.set('citationId', cite);
            expect(store.citations.CSL.get('citationId').language).toBe('gibberish');
            store.citations.CSL = store.citations.cleanCSL(JSON.parse(JSON.stringify(store.citations.CSL)));
            expect(store.citations.CSL.get('citationId').language).toBe('en-US');
        });

        it('should intercept a citation already defined', () => {
            const cite = JSON.parse(JSON.stringify(store.citations.CSL.get('citationId')));
            store.citations.CSL.set('sameCitation', cite);
            expect(store.citations.CSL.keys().length).toBe(1);
        });

        it('should allow non-existing CSL to be set', () => {
            const cite = JSON.parse(JSON.stringify(store.citations.CSL.get('citationId')));
            cite.title = 'Something different';
            store.citations.CSL.set('sameCitation', cite);
            expect(store.citations.CSL.keys().length).toBe(2);
        });

        /* TODO: test removeItems */
    });

    beforeEach(() => {
        store = new Store(testState);
    });

    /* TODO: These fail with Jest due to the decorators. Will have to look into how to fix. */
    // it('should return citedIDs', () => {
    //     expect(store.citedIDs).toEqual(['citationId']);
    // });
    //
    // it('should return uncited CSL', () => {
    //     expect(store.uncited.length).toEqual(0);
    //     store.citations.CSL.set('newcitation', {id: 'newcitation'});
    //     expect(store.uncited.length).toEqual(1);
    // });
    //
    // it('should return cited CSL', () => {
    //     expect(store.cited.length).toEqual(1);
    // });
    //
    // it('should return persistent', () => {
    //     expect(JSON.parse(store.persistent).CSL).not.toBeUndefined();
    //     expect(JSON.parse(store.persistent).cache).not.toBeUndefined();
    //     expect(JSON.parse(store.persistent).citationByIndex).not.toBeUndefined();
    // });

    it('should reset', () => {
        expect(store.citations.CSL.keys().length).toBe(1);
        expect(store.citations.citationByIndex.length).toBe(1);
        store.reset();
        expect(store.citations.CSL.keys().length).toBe(0);
        expect(store.citations.citationByIndex.length).toBe(0);
    });

});
