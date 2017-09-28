jest.useFakeTimers();
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';
import * as diff from 'snapshot-diff';
import Card from '../card';

const testData: { [id: string]: any } = {
    fourAuthors: {
        author: [
            {
                family: 'Smith',
                given: 'John',
            },
            {
                given: 'Bob',
                literal: 'Some literal name',
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
        id: 'aaaaa',
        issued: {
            'date-parts': [['2016', '01', '01']],
        },
        title: 'Two valid authors',
        type: 'article',
    },
    noAuthorField: {
        id: 'aaaaa',
        title: 'No author field, No date field',
        type: 'article',
    },
    noAuthors: {
        author: [],
        id: 'aaaaa',
        issued: {
            'date-parts': [['2016', '01', '01']],
        },
        title: 'No authors',
        type: 'article',
    },
    singleAuthorInvalidField: {
        author: [
            {
                suffix: 'asdf',
            },
        ],
        id: 'aaaaa',
        issued: {
            year: 2010,
        },
        title: 'Single author with invalid field',
        type: 'article',
    },
    singleLiteralAuthorEdgeCase: {
        author: [
            {
                family: 'Smith',
                literal: 'I have no given name',
            },
        ],
        id: 'aaaaa',
        issued: {
            'date-parts': [[]],
        },
        title: 'Single author, literal name',
        type: 'article',
    },
    sixAuthors: {
        author: [
            {
                family: 'Smith',
                given: 'John',
            },
            {
                given: 'Bob',
                literal: 'Some literal name',
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
        id: 'aaaaa',
        issued: {
            'date-parts': [['2016', '01', '01']],
        },
        title: 'Two valid authors',
        type: 'article',
    },
    threeAuthors: {
        author: [
            {
                family: 'Smith',
                given: 'John',
            },
            {
                given: 'Bob',
                literal: 'Some literal name',
            },
            {
                family: 'Doe',
                given: 'Jane',
            },
        ],
        id: 'aaaaa',
        issued: {
            'date-parts': [['2016', '01', '01']],
        },
        title: 'Two valid authors',
        type: 'article',
    },
    twoAuthors: {
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
        id: 'aaaaa',
        issued: {
            'date-parts': [['2016', '01', '01']],
        },
        title: 'Two valid authors',
        type: 'article',
    },
};

const setup = (data: CSL.Data, selected: boolean = false, indexOnHover: boolean = true) => {
    const spy = jest.fn();
    const component = shallow(
        <Card
            isSelected={selected}
            CSL={data}
            onClick={spy}
            id={'id'}
            index={1}
            indexOnHover={indexOnHover}
        />,
    );
    return {
        component,
        date: component.find('.abt-card__date'),
        people: component.find('.abt-card__people'),
        spy,
    };
};

describe('<Card/>', () => {
    test('should render selected', () => {
        const { component } = setup(testData.noAuthors, true);
        expect(component.first().props().className).toBe('abt-card abt-card--selected');
    });
    test('should render unselected', () => {
        const { component } = setup(testData.noAuthors);
        expect(component.first().props().className).toBe('abt-card');
    });
    test('should call onClick when clicked', () => {
        const { component, spy } = setup(testData.noAuthors);
        component.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
    });
    test('should render with no authors', () => {
        const { people } = setup(testData.noAuthors);
        expect(people.children().length).toBe(0);
    });
    test('should handle a situation where there are no authors, and no author field', () => {
        const { people } = setup(testData.noAuthorField);
        expect(people.children().length).toBe(0);
    });
    test('should handle a single author with invalid fields', () => {
        const { people } = setup(testData.singleAuthorInvalidField);
        expect(people.children().length).toBe(0);
    });
    test('should render with a single literal author', () => {
        const { people } = setup(testData.singleLiteralAuthorEdgeCase);
        expect(people.children().length).toBe(1);
        expect(people.text()).toBe('I have no given name.');
    });
    test('should format two authors correctly', () => {
        const { people } = setup(testData.twoAuthors);
        expect(people.children().length).toBe(1);
        expect(people.text()).toBe('Smith, J, Doe, J.');
    });
    test('should format three authors correctly', () => {
        const { people } = setup(testData.threeAuthors);
        expect(people.children().length).toBe(1);
        expect(people.text()).toBe('Smith, J, Some literal name, Doe, J.');
    });
    test('should format > 3 authors correctly', () => {
        const { people: people1 } = setup(testData.fourAuthors);
        expect(people1.children().length).toBe(1);
        expect(people1.text()).toBe('Smith, J, Some literal name, Doe, J...');
        const { people: people2 } = setup(testData.sixAuthors);
        expect(people2.children().length).toBe(1);
        expect(people2.text()).toBe('Smith, J, Some literal name, Doe, J...');
    });
    test('should parse an item without a date correctly', () => {
        const { date } = setup(testData.noAuthorField);
        expect(date.text()).toBe('(n.d.)');
    });
    test('should parse a "date-parts" date correctly', () => {
        const { date } = setup(testData.noAuthors);
        expect(date.text()).toBe('(2016)');
    });
    test('should parse a "year" date correctly', () => {
        const { date } = setup(testData.singleAuthorInvalidField);
        expect(date.text()).toBe('(2010)');
    });
    test('should handle strange edge-cases that result from upgrading from an older version', () => {
        const { date } = setup(testData.singleLiteralAuthorEdgeCase);
        expect(date.text()).toBe('(n.d.)');
    });
    test('should show and hide indices on hover when indexOnHover is set', () => {
        const { component } = setup(testData.fourAuthors, false, true);
        const initialRender = toJSON(component);
        const card = component.first();

        expect(initialRender).toMatchSnapshot();

        card.simulate('mouseenter');
        jest.runAllTimers();
        component.update();

        expect(diff(initialRender, toJSON(component))).toMatchSnapshot();

        card.simulate('mouseleave');
        expect(diff(initialRender, toJSON(component))).toMatchSnapshot();
    });
    test('should render appropriately with optional props unset', () => {
        const component = shallow(
            <Card
                isSelected={true}
                CSL={testData.fourAuthors}
                id="id"
                index={1}
                indexOnHover={false}
            />,
        );
        expect(toJSON(component)).toMatchSnapshot();
    });
});
