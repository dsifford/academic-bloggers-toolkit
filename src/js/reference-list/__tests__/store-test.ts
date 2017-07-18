/// <reference path="../../../../lib/types/CSL.d.ts" />
const reflistState = require('../../../../lib/fixtures').reflistState;
import Store from '../store';

const testState = reflistState;

describe('Reflist Store', () => {
    let store;
    describe('Citation Store', () => {
        beforeEach(() => {
            store = new Store(testState);
        });
        it('should return citedIDs', () => {
            expect(store.citations.citedIDs).toEqual(['aaaaaaaa', 'bbbbbbbb']);
        });
        it('should return uncited CSL', () => {
            expect(store.citations.uncited.length).toEqual(1);
            store.citations.CSL.set('newcitation', {
                id: 'zzzzzzzz',
                title: 'new citation',
            });
            expect(store.citations.uncited.length).toEqual(2);
        });
        it('should return cited CSL', () => {
            expect(store.citations.cited.length).toEqual(2);
        });
        it('should return a "lookup" correctly', () => {
            expect(store.citations.lookup).toEqual({
                ids: ['aaaaaaaa', 'bbbbbbbb', 'cccccccc'],
                titles: [
                    'Test Title',
                    'Other Test Title',
                    'Test Title Uncited',
                ],
            });
        });
        it('should return citationByIndex as JS object', () => {
            const stateCopy = JSON.parse(JSON.stringify(testState));
            expect(store.citations.citationByIndex).toEqual(
                stateCopy.citationByIndex
            );
        });
        it('should call init', () => {
            expect(
                store.citations.init(store.citations.citationByIndex)
            ).toBeUndefined();
        });
        it('should handle an undefined language in cleanCSL', () => {
            const cite = store.citations.CSL.get('aaaaaaaa');
            cite.language = 'gibberish';
            store.citations.CSL.set('aaaaaaaa', cite);
            expect(store.citations.CSL.get('aaaaaaaa').language).toBe(
                'gibberish'
            );
            store.citations.CSL = store.citations.cleanCSL(
                JSON.parse(JSON.stringify(store.citations.CSL))
            );
            expect(store.citations.CSL.get('aaaaaaaa').language).toBe('en-US');
        });
        it('should intercept a citation already defined', () => {
            const cite = {
                PMID: '12345',
                title: 'Test Title',
                type: 'article-journal',
            };
            const cite2 = {
                PMID: '12345',
                title: 'Test Title',
                type: 'article-journal',
            };
            store.citations.CSL.set('sameCitation', cite);
            store.citations.CSL.set('sameCitationAgain', cite2);
            expect(store.citations.CSL.keys().length).toBe(3);
        });
        it('should intercept a citation that has no title set', () => {
            expect(store.citations.CSL.keys().length).toBe(3);
            const invalidCSL = { PMID: '11223344', type: 'article-journal' };
            store.citations.CSL.set('invalidCSL', invalidCSL);
            expect(store.citations.CSL.keys().length).toBe(3);
        });
        it('should allow non-existing CSL to be set', () => {
            const cite = JSON.parse(
                JSON.stringify(store.citations.CSL.get('aaaaaaaa'))
            );
            cite.title = 'Something different';
            store.citations.CSL.set('sameCitation', cite);
            expect(store.citations.CSL.keys().length).toBe(4);
        });
        it('removeItems() should remove cited items from processor state, but keep CSL (bump to uncited)', () => {
            expect(store.citations.citationByIndex.length).toBe(2);
            expect(store.citations.CSL.keys().length).toBe(3);

            const parent = document.createElement('div');
            const el = document.createElement('div');
            el.id = 'htmlSpanId';
            parent.appendChild(el);
            document.body.appendChild(parent);

            store.citations.removeItems(['aaaaaaaa'], document);

            expect(store.citations.citationByIndex.length).toBe(2);
            expect(store.citations.CSL.keys().length).toBe(3);
        });
        it('removeItems() should completely delete all traces of uncited items', () => {
            expect(store.citations.citationByIndex.length).toBe(2);
            expect(store.citations.CSL.keys().length).toBe(3);

            store.citations.removeItems(['cccccccc'], document);

            expect(store.citations.citationByIndex.length).toBe(2);
            expect(store.citations.CSL.keys().length).toBe(2);
        });
        it('should add CSL items with addItems()', () => {
            expect(store.citations.CSL.keys().length).toBe(3);
            const item: CSL.Data = { id: 'newItem', title: 'new item' };
            store.citations.addItems([item]);
            expect(store.citations.CSL.keys().length).toBe(4);
        });
        it('should pruneOrphanedCitations() properly', () => {
            expect(store.citations.citationByIndex.length).toBe(2);
            expect(
                store.citations.citationByIndex.map(i => i.citationID)
            ).toEqual(['htmlSpanId', 'otherHtmlSpanId']);
            store.citations.pruneOrphanedCitations(['htmlSpanId']);
            expect(store.citations.citationByIndex.length).toBe(1);
            expect(
                store.citations.citationByIndex.map(i => i.citationID)
            ).toEqual(['htmlSpanId']);
        });
        it('should return early from pruneOrphanedCitations() if lengths match', () => {
            expect(store.citations.citationByIndex.length).toBe(2);
            expect(
                store.citations.citationByIndex.map(i => i.citationID)
            ).toEqual(['htmlSpanId', 'otherHtmlSpanId']);
            store.citations.pruneOrphanedCitations([
                'htmlSpanId',
                'otherHtmlSpanId',
            ]);
            expect(store.citations.citationByIndex.length).toBe(2);
            expect(
                store.citations.citationByIndex.map(i => i.citationID)
            ).toEqual(['htmlSpanId', 'otherHtmlSpanId']);
        });
    });
    beforeEach(() => {
        store = new Store(testState);
    });
    it('should return persistent', () => {
        expect(JSON.parse(store.persistent).CSL).not.toBeUndefined();
        expect(JSON.parse(store.persistent).cache).not.toBeUndefined();
        expect(
            JSON.parse(store.persistent).citationByIndex
        ).not.toBeUndefined();
    });
    it('should reset', () => {
        expect(store.citations.CSL.keys().length).toBe(3);
        expect(store.citations.citationByIndex.length).toBe(2);
        store.reset();
        expect(store.citations.CSL.keys().length).toBe(0);
        expect(store.citations.citationByIndex.length).toBe(0);
    });
    it('should set citationStyle', () => {
        expect(store.citationStyle.get()).toBe('american-medical-association');
        store.setStyle('apa-5th');
        expect(store.citationStyle.get()).toBe('apa-5th');
    });
});
