import * as React from 'react';
import { mount } from 'enzyme';
import { ResultList } from '../ResultList';

const testData: PubMed.DataPMID[] = [
    {
        authors: [
            { authtype: 'Author', name: 'Author 1' },
            { authtype: 'Author', name: 'Author 2' },
            { authtype: 'Author', name: 'Author 3' },
            { authtype: 'Author', name: 'NOT VISIBLE' },
        ],
        pubdate: '2016 May 1',
        source: 'J Test 1',
        title: 'Test Title 1',
        uid: '11111',
    },
    {
        authors: [
            { authtype: 'Author', name: 'First A' },
            { authtype: 'Author', name: 'Second A' },
            { authtype: 'Author', name: 'Third A' },
            { authtype: 'Author', name: 'NOT VISIBLE' },
        ],
        pubdate: '2016 May 2',
        source: 'J Test 2',
        title: 'Test Title 2',
        uid: '22222',
    },
];

const setup = () => {
    const spy = jest.fn();
    const component = mount((
        <ResultList
            results={testData}
            select={spy}
        />
    ));
    return {
        spy,
        component,
        instance: component.instance() as any,
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
        expect(spy).toHaveBeenCalledTimes(0);
        const button = results.children().find('input.abt-btn.abt-btn_submit.abt-btn_flat').first();
        button.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toEqual(['11111']);
    });
    it('should scroll to the top on update', () => {
        const { instance } = setup();
        instance.element.scrollTop = 150;
        instance.componentDidUpdate();
        expect(instance.element.scrollTop).toBe(0);
    });
    it('should handle scroll', () => {
        const { component } = setup();
        const div = component.find('.abt-scroll-y');
        div.simulate('wheel');
    });
});
