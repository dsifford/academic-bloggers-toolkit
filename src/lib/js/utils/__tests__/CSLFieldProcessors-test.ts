jest.unmock('../CSLFieldProcessors');

import * as processor from '../CSLFieldProcessors';

const risNames = [
    'Paterson, Quinten S',
    'Rezaie, Salim R',
    'Lawrentschuk, Nathan',
    'Straus, Sharon E',
    'Chan, Teresa M',
];

const pubmedNames = [
    'Giebel W',
    'Reijula A',
    'Breuninger H',
    'Ullmann U',
    'Doe JM',
];

const risDates = [
    '1980/05/15/Spring',
    '2015///',
    '1998/12//',
    '1975/01/05/',
    '///fall',
    '',
    '///',
];

const pubmedDates = [
    '1979/01/01 00:00',
    '1998/12/01 00:00',
    '1975/01/05 00:00',
    '2015/11/28 00:00',
    '1980/05/15 00:00',
    '',
];

describe('CSLFieldProcessors', () => {
    it('should process RIS names correctly', () => {
        expect(processor.processName(risNames[0], 'RIS')).toEqual({ family: 'Paterson', given: 'Quinten S' });
        expect(processor.processName(risNames[1], 'RIS')).toEqual({ family: 'Rezaie', given: 'Salim R' });
        expect(processor.processName(risNames[2], 'RIS')).toEqual({ family: 'Lawrentschuk', given: 'Nathan' });
        expect(processor.processName(risNames[3], 'RIS')).toEqual({ family: 'Straus', given: 'Sharon E' });
        expect(processor.processName(risNames[4], 'RIS')).toEqual({ family: 'Chan', given: 'Teresa M' });
    });

    it('should process PubMed names correctly', () => {
        expect(processor.processName(pubmedNames[0], 'pubmed')).toEqual({ family: 'Giebel', given: 'W' });
        expect(processor.processName(pubmedNames[1], 'pubmed')).toEqual({ family: 'Reijula', given: 'A' });
        expect(processor.processName(pubmedNames[2], 'pubmed')).toEqual({ family: 'Breuninger', given: 'H' });
        expect(processor.processName(pubmedNames[3], 'pubmed')).toEqual({ family: 'Ullmann', given: 'U' });
        expect(processor.processName(pubmedNames[4], 'pubmed')).toEqual({ family: 'Doe', given: 'JM' });
    });

    it('should process RIS dates correctly', () => {
        expect(processor.processDate(risDates[0], 'RIS')).toEqual({ 'date-parts': [['1980', '05', '15']], season: 'Spring' }); // tslint:disable-line
        expect(processor.processDate(risDates[1], 'RIS')).toEqual({ 'date-parts': [['2015']] });
        expect(processor.processDate(risDates[2], 'RIS')).toEqual({ 'date-parts': [['1998', '12']] });
        expect(processor.processDate(risDates[3], 'RIS')).toEqual({ 'date-parts': [['1975', '01', '05']] });
        expect(processor.processDate(risDates[4], 'RIS')).toEqual({ 'date-parts': [[]], season: 'fall' });
        expect(processor.processDate(risDates[5], 'RIS')).toEqual({ 'date-parts': [[]] });
        expect(processor.processDate(risDates[6], 'RIS')).toEqual({ 'date-parts': [[]] });
    });

    it('should process PubMed dates correctly', () => {
        expect(processor.processDate(pubmedDates[0], 'pubmed')).toEqual({ 'date-parts': [['1979', '01', '01']] });
        expect(processor.processDate(pubmedDates[1], 'pubmed')).toEqual({ 'date-parts': [['1998', '12', '01']] });
        expect(processor.processDate(pubmedDates[2], 'pubmed')).toEqual({ 'date-parts': [['1975', '01', '05']] });
        expect(processor.processDate(pubmedDates[3], 'pubmed')).toEqual({ 'date-parts': [['2015', '11', '28']] });
        expect(processor.processDate(pubmedDates[4], 'pubmed')).toEqual({ 'date-parts': [['1980', '05', '15']] });
        expect(processor.processDate(pubmedDates[5], 'pubmed')).toEqual({ 'date-parts': [[]] });
    });
});
