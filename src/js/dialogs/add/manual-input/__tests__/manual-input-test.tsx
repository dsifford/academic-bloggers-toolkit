jest.mock('utils/resolvers/url');
jest.mock('utils/resolvers/isbn');
import { mount, ReactWrapper, ShallowWrapper, shallow } from 'enzyme';
import toJSON, { OutputMapper } from 'enzyme-to-json';
import React from 'react';

import Store from 'stores/ui/add-dialog';
import ManualInput from '..';

const setup = (citationType: CSL.ItemType = 'webpage', fullMount = true) => {
    const store = new Store(citationType);
    const component = fullMount
        ? mount(<ManualInput store={store} />)
        : shallow(<ManualInput store={store} />);
    return {
        component,
        instance: component.instance() as ManualInput,
    };
};

const mapper: OutputMapper = json => {
    if (json.props.meta) {
        json.props.meta = '__SKIPPED__';
    }
    if (json.props.store) {
        json.props.store = '__SKIPPED__';
    }
    if (json.props.id) {
        json.props.id = '__SKIPPED__';
    }
    return json;
};

const J = (component: ReactWrapper | ShallowWrapper) =>
    toJSON(component, { noKey: true, map: mapper });

describe('<ManualInput />', () => {
    const BASELINE = J(setup().component);
    it('should match baseline snapshot', () => {
        expect(BASELINE).toMatchSnapshot();
    });
    it('should render autocite fields for books', () => {
        const { component } = setup('book');
        expect(J(component)).toMatchDiffSnapshot(BASELINE);
    });
    it('should not render autocite for anything but websites or books', () => {
        const { component } = setup('article');
        expect(J(component)).toMatchDiffSnapshot(BASELINE);
    });
    it('should handle url autocites', async () => {
        expect.assertions(1);
        const { instance } = setup();
        const before = instance.props.store.data.CSL;
        await instance.handleAutocite('https://google.com');
        const after = instance.props.store.data.CSL;
        delete before.id;
        delete after.id;
        expect(before).toMatchDiffSnapshot(after);
    });
    it('should handle isbn autocites', async () => {
        expect.assertions(1);
        const { instance } = setup('book');
        const before = instance.props.store.data.CSL;
        await instance.handleAutocite('1234567890');
        const after = instance.props.store.data.CSL;
        delete before.id;
        delete after.id;
        expect(before).toMatchDiffSnapshot(after);
    });
    it('should gracefully handle errors', async () => {
        expect.assertions(4);
        const { instance } = setup();
        const before = instance.props.store.data.CSL;
        expect(instance.props.store.errorMessage).toBe('');
        await instance.handleAutocite('ERROR');
        const after = instance.props.store.data.CSL;
        expect(before).toEqual(after);
        expect(instance.props.store.errorMessage).toBe('Testing errors');
        instance.setErrorMessage();
        instance.focusTypeSelect(null);
        expect(instance.props.store.errorMessage).toBe('');
    });
    it('should handle type changes', () => {
        const { instance } = setup();
        expect(instance.props.store.data.citationType).toBe('webpage');
        instance.handleTypeChange({ currentTarget: { value: 'book' } } as any);
        expect(instance.props.store.data.citationType).toBe('book');
    });
    describe('wheel event tests', () => {
        const { component } = setup('webpage', false);
        const wheelDiv = component.find('.scrollBoundaryAutocite');
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

// const setup = ({ itemType = 'webpage', fullMount = true } = {}) => {
//     manualData.replace(new Map([['type', itemType]]));
//     const component = fullMount
//         ? mount(
//               <ManualEntryContainer
//                   manualData={manualData}
//                   errorMessage={errorMessage}
//                   people={people}
//                   {...mocks}
//               />,
//           )
//         : shallow(
//               <ManualEntryContainer
//                   manualData={manualData}
//                   errorMessage={errorMessage}
//                   people={people}
//                   {...mocks}
//               />,
//           );
//     return {
//         component,
//         instance: component.instance() as ManualEntryContainer,
//     };
// };

// describe('<ManualEntryContainer />', () => {
//     beforeEach(() => {
//         people.replace([{ ...manualPersonObj }]);
//         errorMessage.set('');
//         jest.resetAllMocks();
//     });
//     it('should match snapshots', () => {
//         let { component } = setup();
//         expect(toJSON(component, { noKey: true })).toMatchSnapshot();

//         ({ component } = setup({ itemType: 'book' }));
//         expect(toJSON(component, { noKey: true })).toMatchSnapshot();

//         ({ component } = setup({ itemType: 'article' }));
//         expect(toJSON(component, { noKey: true })).toMatchSnapshot();
//     });
//     it('should show and hide error callout', () => {
//         errorMessage.set('Hello World');
//         const { component, instance } = setup();
//         expect(component.find('Callout').children().length).toBeGreaterThan(0);
//         instance.dismissError();
//         component.update();
//         expect(component.find('Callout').children().length).toBe(0);
//     });
//     it('should handle type change', () => {
//         const { component } = setup();
//         const select = component.find('#type-select');
//         select.simulate('change', { currentTarget: { value: 'book' } });
//         expect(mocks.onTypeChange).toHaveBeenCalledTimes(1);
//     });
//     it('should not break when ref callback receives null', () => {
//         const { instance } = setup();
//         expect(() => instance.focusTypeSelect(null)).not.toThrow();
//     });
// });
