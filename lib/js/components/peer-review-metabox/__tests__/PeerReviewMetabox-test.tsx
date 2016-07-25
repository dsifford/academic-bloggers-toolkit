jest.unmock('../PeerReviewMetabox');
jest.unmock('../ReviewRow');
jest.unmock('../CommonRowContent');

import * as React from 'react';
import { mount } from 'enzyme';
import { PeerReviewMetabox } from '../PeerReviewMetabox';

const generateData = (
    heading: string = '',
    response: string[] = ['', '', '', '', '', ],
    review: string[] = ['', '', '', '', '', ]
) => {
    return {
        heading: {
            value: heading,
        },
        response: {
            name: response[0],
            background: response[1],
            content: response[2],
            image: response[3],
            twitter: response[4],
        },
        review: {
            name: review[0],
            background: review[1],
            content: review[2],
            image: review[3],
            twitter: review[4],
        },
    };
};

const setup = (
    selection: '0'|'1'|'2'|'3' = '0',
    one = generateData(),
    two = generateData(),
    three = generateData()
) => {
    const testData: ABT.PRMetaPayload = {
        1: one,
        2: two,
        3: three,
        selection: selection,
    };
    const component = mount(
        <PeerReviewMetabox data={testData} />
    );
    return {
        component,
        wrapper: component.find('div').at(0),
        select: component.find('select[name="reviewer_selector"]'),
    };
};



let wpMock = {
    media: class media {
        constructor() {
            let x = document.createElement('DIV');
            x['open'] = function() {
                return;
            };
            x['on'] = function() {
                return;
            };
            return x;
        }
        public static frames = {
            'abt_reviewer_photos': {
                1: {
                    response: null,
                    review: null,
                },
                2: {
                    response: null,
                    review: null,
                },
                3: {
                    response: null,
                    review: null,
                },
            },
        };
    },
};

window['wp'] = wpMock;

describe('<PeerReviewMetabox />', () => {
    it('should mount showing no rows', () => {
        const { wrapper } = setup();
        expect(wrapper.children().length).toBe(1);
    });
    it('should mount showing 1 row', () => {
        const { wrapper } = setup('1');
        expect(wrapper.children().length).toBe(2);
    });
    it('should mount showing 2 rows', () => {
        const { wrapper } = setup('2');
        expect(wrapper.children().length).toBe(3);
    });
    it('should mount showing all 3 rows', () => {
        const { wrapper } = setup('3');
        expect(wrapper.children().length).toBe(4);
    });
    it('should mount with "state.hidden[1]" false', () => {
        const { component } = setup(
            '3',
            generateData(undefined, ['name', '', '', '', '', ])
        );
        const expected = {
            1: false,
            2: true,
            3: true,
        };
        expect(component.state().hidden).toEqual(expected);
    });
    it('should mount with "state.hidden[1]" & "state.hidden[2]" false', () => {
        const { component } = setup(
            '3',
            generateData(undefined, ['name', '', '', '', '', ]),
            generateData(undefined, ['name', '', '', '', '', ])
        );
        const expected = {
            1: false,
            2: false,
            3: true,
        };
        expect(component.state().hidden).toEqual(expected);
    });
    it('should mount with all "state.hidden" false', () => {
        const { component } = setup(
            '3',
            generateData(undefined, ['name', '', '', '', '', ]),
            generateData(undefined, ['name', '', '', '', '', ]),
            generateData(undefined, ['name', '', '', '', '', ])
        );
        const expected = {
            1: false,
            2: false,
            3: false,
        };
        expect(component.state().hidden).toEqual(expected);
    });
    it('should dispatch "handleSelectChange" correctly', () => {
        const { select, component } = setup();
        expect(component.state().selection).toBe('0');
        select.simulate('change', { target: { value: '2' } });
        expect(component.state().selection).toBe('2');
        select.simulate('change', { target: { value: '3' } });
        expect(component.state().selection).toBe('3');
    });
    it('should consume "handleInputChange" correctly', () => {
        const { component } = setup('1');
        const headingField = component.find('input[name="peer_review_box_heading_1"]');
        headingField.simulate('change', { target: { value: 'NEW HEADING' } });
        let state = component.state();
        expect(state['1'].heading.value).toBe('NEW HEADING');
    });
    it('should consume "toggleHidden" correctly', () => {
        const { component } = setup('1');
        const toggleButton = component.find('input[type="button"].button-primary');
        const before = {
            1: true,
            2: true,
            3: true,
        };
        const after = {
            1: false,
            2: true,
            3: true,
        };
        expect(component.state().hidden).toEqual(before);
        toggleButton.simulate('click');
        expect(component.state().hidden).toEqual(after);
    });
    it('should open mocked media manager', () => {
        const { component } = setup('1');
        const button = component.find('#reviewer-upload-button-1');
        button.simulate('click');
        button.simulate('click');
    });
});
