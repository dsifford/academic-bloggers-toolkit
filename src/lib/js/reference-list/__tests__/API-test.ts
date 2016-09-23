jest.disableAutomock();

import { getRemoteData, parseManualData } from '../API';
import { stub } from 'sinon';

const testCSL = require('../../../../../scripts/fixtures.js').reflistState.CSL.citationId;

const manualData = {
    addManually: true,
    attachInline: true,
    identifierList: '',
    manualData: testCSL,
    people: [],
};

describe('API', () => {

    describe('getRemoteData()', () => {
        let mce;
        beforeEach(() => {
            mce = { alert: stub() };
        });

        it('should get a single PMID', () => {
            return getRemoteData('12345', <any>mce)
            .then(d => {
                expect(d[0].title).toBe('A new granulation method for compressed tablets [proceedings].');
            });
        });
        it('should get a single DOI', () => {
            return getRemoteData('10.1097/TA.0000000000000999', <any>mce)
            .then(d => {
                expect(d[0].title).toBe('Not all prehospital time is equal');
            });
        });
        it('should get a combination of DOIs and PMIDs', () => {
            return getRemoteData('10.1097/TA.0000000000000999,12345', <any>mce)
            .then(d => {
                expect(d[0].title).toBe('A new granulation method for compressed tablets [proceedings].');
                expect(d[1].title).toBe('Not all prehospital time is equal');
            });
        });
        it('should error appropriately for invalid data', () => {
            return getRemoteData('10.1097/TA.0000000000000999,      a823hh,       12345', <any>mce)
            .then(d => {
                expect(mce.alert.callCount).toBe(1);
                expect(mce.alert.calledWith('𝗘𝗿𝗿𝗼𝗿: The following identifiers could not be found: a823hh')).toBeTruthy(); // tslint:disable-line
                expect(d[0].title).toBe('A new granulation method for compressed tablets [proceedings].');
                expect(d[1].title).toBe('Not all prehospital time is equal');
            });
        });
        it('should error appropriately when no valid identifiers are set', () => {
            return getRemoteData(' sadfasfdg', <any>mce)
            .then(d => {
                expect(d.length).toBe(0);
                expect(mce.alert.callCount).toBe(1);
                expect(mce.alert.args[0][0]).toBe('𝗘𝗿𝗿𝗼𝗿: The following identifiers could not be found: sadfasfdg'); // tslint:disable-line
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
