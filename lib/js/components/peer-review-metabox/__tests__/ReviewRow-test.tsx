jest.unmock('../ReviewRow');

import * as React from 'react';
import { mount, } from 'enzyme';
import * as sinon from 'sinon';
import { ReviewRow, } from '../ReviewRow';

const setup = () => {
    const spy = sinon.spy();
    const testData = {
        rowData: {
            heading: {
                value: '',
            },
            response: {
                background: '',
                content: '',
                image: '',
                name: '',
                twitter: '',
            },
            review: {
                background: '',
                content: '',
                image: '',
                name: '',
                twitter: '',
            },
        },
        hidden: false,
        onChange: spy,
        toggleHidden: spy,
        uploadHandler: spy,
    };
    const component = mount(
        <ReviewRow {...testData} num={'1'} />
    );
    return {
        spy,
        component,
        button: component.find('input[type="button"]'),
        heading: component.find('input[name="peer_review_box_heading_1"]'),
    };
};

describe('<ReviewRow />', () => {
    it('should dispatch "onChange" with the correct data', () => {
        const { spy, heading, } = setup();
        heading.simulate('change');
        expect(spy.callCount).toBe(1);
        expect(spy.firstCall.args.length).toBe(4);
        expect(spy.firstCall.args[0]).toEqual('heading');
        expect(spy.firstCall.args[1]).toEqual('value');
        expect(spy.firstCall.args[2]).toEqual('1');
    });
    it('should dispatch "onClick" with the correct data', () => {
        const { spy, button, } = setup();
        button.simulate('click');
        expect(spy.callCount).toBe(1);
        expect(spy.firstCall.args[0]).toEqual('1');
    });
});
