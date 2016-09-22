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

        it('should return citedIDs', () => {
            expect(store.citations.citedIDs).toEqual(['citationId', 'otherCitationId']);
        });

        it('should return uncited CSL', () => {
            expect(store.citations.uncited.length).toEqual(1);
            store.citations.CSL.set('newcitation', {id: 'newcitation', title: 'new citation'});
            expect(store.citations.uncited.length).toEqual(2);
        });

        it('should return cited CSL', () => {
            expect(store.citations.cited.length).toEqual(2);
        });

        it('should return a "lookup" correctly', () => {
            expect(store.citations.lookup).toEqual(
                {
                    ids: ['citationId', 'otherCitationId', 'uncitedCitationId'],
                    titles: ['Test Title', 'Other Test Title', 'Test Title Uncited'],
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
            const cite = store.citations.CSL.get('citationId');
            cite.language = 'gibberish';
            store.citations.CSL.set('citationId', cite);
            expect(store.citations.CSL.get('citationId').language).toBe('gibberish');
            store.citations.CSL = store.citations.cleanCSL(JSON.parse(JSON.stringify(store.citations.CSL)));
            expect(store.citations.CSL.get('citationId').language).toBe('en-US');
        });

        it('should intercept a citation already defined', () => {
            const cite = JSON.parse(JSON.stringify(store.citations.CSL.get('citationId')));
            const cite2 = { title: 'TEST TITLE', type: 'article-journal', PMID: '12345' }; // tslint:disable-line
            store.citations.CSL.set('sameCitation', cite);
            store.citations.CSL.set('sameCitationAgain', cite2);
            expect(store.citations.CSL.keys().length).toBe(3);
        });

        it('should allow non-existing CSL to be set', () => {
            const cite = JSON.parse(JSON.stringify(store.citations.CSL.get('citationId')));
            cite.title = 'Something different';
            store.citations.CSL.set('sameCitation', cite);
            expect(store.citations.CSL.keys().length).toBe(4);
        });

        it('removeItems() should remove cited items from processor state, but keep CSL (bump to uncited)', () => {
            expect(store.citations.citationByIndex.length).toBe(2);
            expect(store.citations.CSL.keys().length).toBe(3);

            const parent = document.createElement('DIV');
            const el = document.createElement('DIV');
            el.id = 'htmlSpanId';
            parent.appendChild(el);
            document.body.appendChild(parent);

            store.citations.removeItems(['citationId'], document);

            expect(store.citations.citationByIndex.length).toBe(1);
            expect(store.citations.CSL.keys().length).toBe(3);
        });

        it('removeItems() should completely delete all traces of uncited items', () => {
            expect(store.citations.citationByIndex.length).toBe(2);
            expect(store.citations.CSL.keys().length).toBe(3);

            store.citations.removeItems(['uncitedCitationId'], document);

            expect(store.citations.citationByIndex.length).toBe(2);
            expect(store.citations.CSL.keys().length).toBe(2);
        });

        it('should add CSL items with addItems()', () => {
            expect(store.citations.CSL.keys().length).toBe(3);
            const item: CSL.Data = {id: 'newItem', title: 'new item'};
            store.citations.addItems([item]);
            expect(store.citations.CSL.keys().length).toBe(4);
        });

    });

    beforeEach(() => {
        store = new Store(testState);
    });

    it('should return persistent', () => {
        expect(JSON.parse(store.persistent).CSL).not.toBeUndefined();
        expect(JSON.parse(store.persistent).cache).not.toBeUndefined();
        expect(JSON.parse(store.persistent).citationByIndex).not.toBeUndefined();
    });

    it('should reset', () => {
        expect(store.citations.CSL.keys().length).toBe(3);
        expect(store.citations.citationByIndex.length).toBe(2);
        store.reset();
        expect(store.citations.CSL.keys().length).toBe(0);
        expect(store.citations.citationByIndex.length).toBe(0);
    });

    it('should set citationStyle', () => {
        expect(store.citationStyle).toBe('american-medical-association');
        store.setStyle('apa-5th');
        expect(store.citationStyle).toBe('apa-5th');
    });

});
