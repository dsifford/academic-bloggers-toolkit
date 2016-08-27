jest.disableAutomock();

const testCSL = require('../../../../../scripts/fixtures.js').reflistState.CSL.citationId;

import { getRemoteData, parseManualData } from '../API';
import { stub } from 'sinon';

const mce = {
    alert: stub(),
};

const manualData = {
    addManually: true,
    attachInline: true,
    identifierList: '',
    manualData: testCSL,
    people: [],
};

describe('API', () => {

    describe('getRemoteData()', () => {
        it('should get a single PMID', () => {
            return getRemoteData('12345', mce as any)
            .then(d => {
                expect(d[0].title).toBe('A new granulation method for compressed tablets [proceedings].');
            });
        });
        it('should get a single DOI', () => {
            return getRemoteData('10.1097/TA.0000000000000999', mce as any)
            .then(d => {
                expect(d[0].title).toBe('Not all prehospital time is equal');
            });
        });
        it('should get a combination of DOIs and PMIDs', () => {
            return getRemoteData('10.1097/TA.0000000000000999,12345', mce as any)
            .then(d => {
                expect(d[0].title).toBe('A new granulation method for compressed tablets [proceedings].');
                expect(d[1].title).toBe('Not all prehospital time is equal');
            });
        });
        it('should error appropriately for invalid data', () => {
            return getRemoteData('10.1097/TA.0000000000000999,      a823hh,       12345', mce as any)
            .then(d => {
                expect(mce.alert.callCount).toBe(1);
                expect(mce.alert.calledWith('The following identifiers could not be found: a823hh')).toBeTruthy();
                expect(d[0].title).toBe('A new granulation method for compressed tablets [proceedings].');
                expect(d[1].title).toBe('Not all prehospital time is equal');
            });
        });
    });

    describe('parseManualData()', () => {
        it('should parse manual data', () => {
            const beforeDate = manualData.manualData.issued;
            manualData.manualData.issued = '2016/08/19';
            return parseManualData(manualData)
            .then(d => {
                expect(d[0].issued).toEqual(beforeDate);
            });
        });
    });

});
