import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { observable } from 'mobx';
import * as React from 'react';
import { manualPersonObj } from 'utils/constants';
import ManualEntryContainer from '../manual-entry-container';

const people = observable<ABT.Contributor>([]);
const manualData = observable.map<string>();
const errorMessage = observable('');
const mocks = {
    onAutoCite: jest.fn(),
    onTypeChange: jest.fn(),
};

const setup = ({ itemType = 'webpage', fullMount = true } = {}) => {
    manualData.replace(new Map([['type', itemType]]));
    const component = fullMount
        ? mount(
              <ManualEntryContainer
                  manualData={manualData}
                  errorMessage={errorMessage}
                  people={people}
                  {...mocks}
              />,
          )
        : shallow(
              <ManualEntryContainer
                  manualData={manualData}
                  errorMessage={errorMessage}
                  people={people}
                  {...mocks}
              />,
          );
    return {
        component,
        instance: component.instance() as ManualEntryContainer,
    };
};

describe('<ManualEntryContainer />', () => {
    beforeEach(() => {
        people.replace([{ ...manualPersonObj }]);
        errorMessage.set('');
        jest.resetAllMocks();
    });
    it('should match snapshots', () => {
        let { component } = setup();
        expect(toJSON(component, { noKey: true })).toMatchSnapshot();

        ({ component } = setup({ itemType: 'book' }));
        expect(toJSON(component, { noKey: true })).toMatchSnapshot();

        ({ component } = setup({ itemType: 'article' }));
        expect(toJSON(component, { noKey: true })).toMatchSnapshot();
    });
    it('should show and hide error callout', () => {
        errorMessage.set('Hello World');
        const { component, instance } = setup();
        expect(component.find('Callout').children().length).toBeGreaterThan(0);
        instance.dismissError();
        component.update();
        expect(component.find('Callout').children().length).toBe(0);
    });
    it('should handle type change', () => {
        const { component } = setup();
        const select = component.find('#type-select');
        select.simulate('change', { currentTarget: { value: 'book' } });
        expect(mocks.onTypeChange).toHaveBeenCalledTimes(1);
    });
    it('should not break when ref callback receives null', () => {
        const { instance } = setup();
        expect(() => instance.focusTypeSelect(null)).not.toThrow();
    });
    describe('wheel event tests', () => {
        const { component } = setup({ fullMount: false });
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
