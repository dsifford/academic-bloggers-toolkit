/// <reference path="../../../../../lib/types/CSL.d.ts" />

import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { observable } from 'mobx';
import * as React from 'react';
import ManualEntryContainer from '../manual-entry-container';

const people = observable<CSL.TypedPerson>([]);
const manualData = observable.map<string>();
const errorMessage = observable('');
const mocks = {
    autoCite: jest.fn(),
    typeChange: jest.fn(),
};

const setup = ({ loading = false, itemType = 'webpage' } = {}) => {
    manualData.replace(new Map([['type', itemType]]));
    const component = shallow(
        <ManualEntryContainer
            loading={loading}
            manualData={manualData}
            errorMessage={errorMessage}
            people={people}
            {...mocks}
        />,
    );
    return {
        component,
    };
};

describe('<ManualEntryContainer />', () => {
    beforeEach(() => {
        people.replace([{ family: '', given: '', type: 'author' }]);
        errorMessage.set('');
        jest.resetAllMocks();
    });
    it('should match snapshots', () => {
        let { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();

        ({ component } = setup({ loading: true }));
        expect(toJSON(component)).toMatchSnapshot();

        ({ component } = setup({ itemType: 'book' }));
        expect(toJSON(component)).toMatchSnapshot();

        ({ component } = setup({ itemType: 'article' }));
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should handle type change', () => {
        const { component } = setup();
        const select = component.find('select');
        select.simulate('change', { currentTarget: { value: 'book' } });
        expect(mocks.typeChange).toHaveBeenCalledTimes(1);
    });
    describe('wheel event tests', () => {
        const { component } = setup();
        const wheelDiv = component.find('.bounded-rect');
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
