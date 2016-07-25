jest.unmock('../ResultList');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { ResultList } from '../ResultList';

let testData: PubMed.SingleReference[] = [
    {
        uid: 11111,
        title: 'Test Title 1',
        authors: [
            { name: 'Author 1' },
            { name: 'Author 2' },
            { name: 'Author 3' },
            { name: 'NOT VISIBLE' },
        ],
        source: 'J Test 1',
        pubdate: '2016 May 1',
    },
    {
        uid: 22222,
        title: 'Test Title 2',
        authors: [
            { name: 'First A' },
            { name: 'Second A' },
            { name: 'Third A' },
            { name: 'NOT VISIBLE' },
        ],
        source: 'J Test 2',
        pubdate: '2016 May 2',
    },
];

const setup = () => {
    const spy = sinon.spy();
    const container = mount(
        <ResultList results={testData} eventHandler={spy} />
    );
    return {
        spy,
        container,
        results: container.find('.result-item'),
    };
};

describe('<ResultList />', () => {
    it('should render with two children', () => {
        const { results } = setup();
        expect(results.length).toBe(2);
    });
    it('should bind the PMID to the event on button click', () => {
        const { results, spy } = setup();

        let button = results.children().find('input.btn').first();
        button.simulate('click');
        expect(spy.callCount).toBe(1);
        expect(spy.firstCall.args[0]).toBe(11111);

        button = results.children().find('input.btn').at(1);
        button.simulate('click');
        expect(spy.callCount).toBe(2);
        expect(spy.secondCall.args[0]).toBe(22222);
    });
});
