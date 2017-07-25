import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';
import { ResultList } from '../result-list';

const generateData = (n: number) => {
    let data = [];
    for (let i = 0; i < n; i++) {
        data = [
            ...data,
            {
                authors: [
                    { authtype: 'Author', name: 'Author 1' },
                    { authtype: 'Author', name: 'Author 2' },
                    { authtype: 'Author', name: 'Author 3' },
                    { authtype: 'Author', name: 'NOT VISIBLE' },
                ],
                pubdate: '2016 May 1',
                source: `J Test ${i + 1}`,
                title: `Test Title ${i + 1}`,
                uid: `${i + 1}`,
            },
        ];
    }
    return data;
};

const defaltData = generateData(2);

const setup = (data: any = defaltData) => {
    const spy = jest.fn();
    const component = mount(<ResultList results={data} onSelect={spy} />);
    return {
        spy,
        component,
        instance: component.instance() as any,
        results: component.find('.result-item'),
    };
};

describe('<ResultList />', () => {
    it('should render with two children', () => {
        const { component, results } = setup();
        expect(results.length).toBe(2);
    });
    it('should call handleClick on addReference click', () => {
        const { results, spy } = setup();
        expect(spy).toHaveBeenCalledTimes(0);
        const button = results.children().find('input.abt-btn.abt-btn_submit.abt-btn_flat').first();
        button.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toEqual(['1']);
    });
    it('should scroll to the top on update', () => {
        const { instance } = setup();
        instance.element.scrollTop = 150;
        instance.componentDidUpdate();
        expect(instance.element.scrollTop).toBe(0);
    });
    it('should handle scroll', () => {
        const { component } = setup();
        component.simulate('wheel');
    });
    it('should match snapshots', () => {
        let { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();

        ({ component } = setup([]));
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should show only 5 results at a time', () => {
        const { component } = setup(generateData(50));
        expect(component).toBeTruthy();
    });
});
