import { parseCSLDate } from '../parseCSLDate';

describe('parseCSLDate()', () => {
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
    it('should process RIS dates correctly', () => {
        expect(parseCSLDate(risDates[0], 'RIS')).toEqual({ 'date-parts': [['1980', '05', '15']], season: 'Spring' }); // tslint:disable-line
        expect(parseCSLDate(risDates[1], 'RIS')).toEqual({ 'date-parts': [['2015']] });
        expect(parseCSLDate(risDates[2], 'RIS')).toEqual({ 'date-parts': [['1998', '12']] });
        expect(parseCSLDate(risDates[3], 'RIS')).toEqual({ 'date-parts': [['1975', '01', '05']] });
        expect(parseCSLDate(risDates[4], 'RIS')).toEqual({ 'date-parts': [[]], season: 'fall' });
        expect(parseCSLDate(risDates[5], 'RIS')).toEqual({ 'date-parts': [[]] });
        expect(parseCSLDate(risDates[6], 'RIS')).toEqual({ 'date-parts': [[]] });
    });
    it('should process PubMed dates correctly', () => {
        expect(parseCSLDate(pubmedDates[0], 'pubmed')).toEqual({ 'date-parts': [['1979', '01', '01']] });
        expect(parseCSLDate(pubmedDates[1], 'pubmed')).toEqual({ 'date-parts': [['1998', '12', '01']] });
        expect(parseCSLDate(pubmedDates[2], 'pubmed')).toEqual({ 'date-parts': [['1975', '01', '05']] });
        expect(parseCSLDate(pubmedDates[3], 'pubmed')).toEqual({ 'date-parts': [['2015', '11', '28']] });
        expect(parseCSLDate(pubmedDates[4], 'pubmed')).toEqual({ 'date-parts': [['1980', '05', '15']] });
        expect(parseCSLDate(pubmedDates[5], 'pubmed')).toEqual({ 'date-parts': [[]] });
    });
});
