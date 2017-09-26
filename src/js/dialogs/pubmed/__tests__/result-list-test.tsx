import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';
import { ResultList } from '../result-list';

const generateData = (n: number) => {
    let data: Array<Partial<CSL.Data>> = [];
    for (let i = 0; i < n; i++) {
        data = [
            ...data,
            {
                author: [
                    { family: 'Doe', given: 'John' },
                    { family: 'Smith', given: 'Jan' },
                    { family: 'Brown', given: 'Pamela' },
                    { family: 'Clark', given: 'Steve' },
                ],
                issued: {
                    'date-parts': [['2016', '05', '01']],
                },
                'container-title-short': `J Test ${i + 1}`,
                title: `Test Title ${i + 1}`,
                id: `${i + 1}`,
            },
        ];
    }
    return data;
};

const defaultData = generateData(2);

const setup = (data: any = defaultData, fullMount = true) => {
    const spy = jest.fn();
    const component = fullMount
        ? mount(<ResultList results={data} onSelect={spy} />)
        : shallow(<ResultList results={data} onSelect={spy} />);
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
        const button = results
            .children()
            .find('Button')
            .at(1)
            .find('button');
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
    describe('wheel event tests', () => {
        const { component } = setup(undefined, false);
        const wheelDiv = component.find('.result-list');
        let atTop: any = {};
        let inMiddle: any = {};
        let atBottom: any = {};
        beforeEach(() => {
            atTop = {
                cancelable: true,
                deltaY: 0,
                currentTarget: {
                    clientHeight: 50,
                    scrollHeight: 100,
                    scrollTop: 0,
                },
            };
            inMiddle = {
                cancelable: true,
                deltaY: 0,
                currentTarget: {
                    clientHeight: 50,
                    scrollHeight: 100,
                    scrollTop: 25,
                },
            };
            atBottom = {
                cancelable: true,
                deltaY: 0,
                currentTarget: {
                    clientHeight: 50,
                    scrollHeight: 100,
                    scrollTop: 50,
                },
            };
        });
        it('should cancel at top scrolling up', () => {
            atTop.deltaY = -5;
            wheelDiv.simulate('wheel', atTop);
            expect(atTop.cancelable).toBe(true);
        });
        it('should cancel at bottom scrolling down', () => {
            atBottom.deltaY = 5;
            wheelDiv.simulate('wheel', atBottom);
            expect(atBottom.cancelable).toBe(true);
        });
        it('should NOT cancel in middle scrolling up', () => {
            inMiddle.deltaY = -5;
            wheelDiv.simulate('wheel', inMiddle);
            expect(inMiddle.cancelable).toBe(false);
        });
        it('should NOT cancel in middle scrolling down', () => {
            inMiddle.deltaY = 5;
            wheelDiv.simulate('wheel', inMiddle);
            expect(inMiddle.cancelable).toBe(false);
        });
    });
});
