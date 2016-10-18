import * as React from 'react';
import { mount } from 'enzyme';
import { spy as s } from 'sinon';
import { ResultList } from '../ResultList';

const testData: PubMed.SingleReference[] = [
    {
        authors: [
            { name: 'Author 1' },
            { name: 'Author 2' },
            { name: 'Author 3' },
            { name: 'NOT VISIBLE' },
        ],
        pubdate: '2016 May 1',
        source: 'J Test 1',
        title: 'Test Title 1',
        uid: '11111',
    },
    {
        authors: [
            { name: 'First A' },
            { name: 'Second A' },
            { name: 'Third A' },
            { name: 'NOT VISIBLE' },
        ],
        pubdate: '2016 May 2',
        source: 'J Test 2',
        title: 'Test Title 2',
        uid: '22222',
    },
];

const setup = () => {
    const spy = s();
    const component = mount(
        <ResultList
            results={testData}
            select={spy}
        />
    );
    return {
        spy,
        component,
        results: component.find('.result-item'),
    };
};

describe('<ResultList />', () => {
    it('should render with two children', () => {
        const { results } = setup();
        expect(results.length).toBe(2);
    });
    it('should call handleClick on addReference click', () => {
        const { results, spy } = setup();

        expect(spy.callCount).toBe(0);
        const button = results.children().find('input.abt-btn.abt-btn_submit.abt-btn_flat').first();
        button.simulate('click');
        expect(spy.callCount).toBe(1);
        expect(spy.firstCall.args[0]).toBe('11111');
    });
    it('should scroll to the top on update', () => {
        const spy = s(ResultList.prototype, 'componentDidUpdate');
        const { component } = setup();
        component.update();
        expect(spy.callCount).toBe(1);
        spy.restore();
    });
    it('should handle scroll', () => {
        const { component } = setup();
        const div = component.find('.abt-scroll-y');
        div.simulate('wheel');
    });
});
