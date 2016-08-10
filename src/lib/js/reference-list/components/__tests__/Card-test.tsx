jest.unmock('../Card');

import * as React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { Card } from '../Card';

const testData: {[id: string]: CSL.Data} = {
    noAuthors: {
        id: 'aaaaa',
        type: 'article',
        issued: {
            'date-parts': [
                [
                    '2016',
                    '01',
                    '01',
                ],
            ],
        },
        title: 'No authors',
        author: [],
    },
    noAuthorField: {
        id: 'aaaaa',
        type: 'article',
        title: 'No author field, No date field',
    },
    singleAuthorInvalidField: {
        id: 'aaaaa',
        type: 'article',
        issued: {
            'year': 2010,
        },
        title: 'Single author with invalid field',
        author: [
            {
                suffix: 'asdf',
            },
        ],
    },
    singleLiteralAuthor: {
        id: 'aaaaa',
        type: 'article',
        issued: {
            'date-parts': [
                [
                    '2016',
                    '01',
                    '01',
                ],
            ],
        },
        title: 'Single author, literal name',
        author: [
            {
                family: 'Smith',
                literal: 'I have no given name',
            },
        ],
    },
    twoAuthors: {
        id: 'aaaaa',
        type: 'article',
        issued: {
            'date-parts': [
                [
                    '2016',
                    '01',
                    '01',
                ],
            ],
        },
        title: 'Two valid authors',
        author: [
            {
                family: 'Smith',
                given: 'John',
            },
            {
                family: 'Doe',
                given: 'Jane',
            },
        ],
    },
    threeAuthors: {
        id: 'aaaaa',
        type: 'article',
        issued: {
            'date-parts': [
                [
                    '2016',
                    '01',
                    '01',
                ],
            ],
        },
        title: 'Two valid authors',
        author: [
            {
                family: 'Smith',
                given: 'John',
            },
            {
                literal: 'Some literal name',
                given: 'Bob',
            },
            {
                family: 'Doe',
                given: 'Jane',
            },
        ],
    },
    fourAuthors: {
        id: 'aaaaa',
        type: 'article',
        issued: {
            'date-parts': [
                [
                    '2016',
                    '01',
                    '01',
                ],
            ],
        },
        title: 'Two valid authors',
        author: [
            {
                family: 'Smith',
                given: 'John',
            },
            {
                literal: 'Some literal name',
                given: 'Bob',
            },
            {
                family: 'Doe',
                given: 'Jane',
            },
            {
                family: 'Brown',
                given: 'Susan',
            },
        ],
    },
    sixAuthors: {
        id: 'aaaaa',
        type: 'article',
        issued: {
            'date-parts': [
                [
                    '2016',
                    '01',
                    '01',
                ],
            ],
        },
        title: 'Two valid authors',
        author: [
            {
                family: 'Smith',
                given: 'John',
            },
            {
                literal: 'Some literal name',
                given: 'Bob',
            },
            {
                family: 'Doe',
                given: 'Jane',
            },
            {
                family: 'Brown',
                given: 'Susan',
            },
            {
                family: 'Doe',
                given: 'Jane',
            },
            {
                family: 'Brown',
                given: 'Susan',
            },
        ],
    }
}


const setup = (data: CSL.Data, selected: boolean = false) => {
    const s = spy();
    const component = shallow(
        <Card isSelected={selected} CSL={data} click={s} id={'id'}/>
    );
    return {
        s,
        component,
        people: component.find('.abt-card-people'),
        date: component.find('.abt-card-date'),
    };
};

describe('<Card/>', () => {
    it('should render selected', () => {
        const { component } = setup(testData['noAuthors'], true);
        expect(component.first().props().className).toBe('abt-card selected');
    });

    it('should render unselected', () => {
        const { component } = setup(testData['noAuthors']);
        expect(component.first().props().className).toBe('abt-card');
    });

    it('should call onClick when clicked', () => {
        const { component, s } = setup(testData['noAuthors']);
        component.simulate('click');
        expect(s.callCount).toBe(1);
    });

    it('should render with no authors', () => {
        const { people } = setup(testData['noAuthors']);
        expect(people.children().length).toBe(0);
    });

    it('should handle a situation where there are no authors, and no author field', () => {
        const { people } = setup(testData['noAuthorField']);
        expect(people.children().length).toBe(0);
    });

    it('should handle a single author with invalid fields', () => {
        const { people } = setup(testData['singleAuthorInvalidField']);
        expect(people.children().length).toBe(0);
    });

    it('should render with a single literal author', () => {
        const { people } = setup(testData['singleLiteralAuthor']);
        expect(people.children().length).toBe(1);
        expect(people.text()).toBe('I have no given name.');
    });

    it('should format two authors correctly', () => {
        const { people } = setup(testData['twoAuthors']);
        expect(people.children().length).toBe(1);
        expect(people.text()).toBe('Smith, J, Doe, J.');
    });

    it('should format three authors correctly', () => {
        const { people } = setup(testData['threeAuthors']);
        expect(people.children().length).toBe(1);
        expect(people.text()).toBe('Smith, J, Some literal name, Doe, J.');
    });

    it('should format > 3 authors correctly', () => {
        const { people: people1 } = setup(testData['fourAuthors']);
        expect(people1.children().length).toBe(1);
        expect(people1.text()).toBe('Smith, J, Some literal name, Doe, J...');
        const { people: people2 } = setup(testData['sixAuthors']);
        expect(people2.children().length).toBe(1);
        expect(people2.text()).toBe('Smith, J, Some literal name, Doe, J...');
    });

    it('should parse an item without a date correctly', () => {
        const { date } = setup(testData['noAuthorField']);
        expect(date.text()).toBe('(n.d.)');
    });

    it('should parse a "date-parts" date correctly', () => {
        const { date } = setup(testData['noAuthors']);
        expect(date.text()).toBe('(2016)');
    });

    it('should parse a "year" date correctly', () => {
        const { date } = setup(testData['singleAuthorInvalidField']);
        expect(date.text()).toBe('(2010)');
    });

});
