jest.unmock('../CommonRowContent');

import * as React from 'react';
import { mount, } from 'enzyme';
import * as sinon from 'sinon';
import { CommonRowContent, } from '../CommonRowContent';

const setup = (
    reviewer: boolean = true
) => {
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
        num: '1',
        reviewer,
        onChange: spy,
        uploadHandler: spy,
    };
    const component = mount(
        <CommonRowContent {...testData} />
    );
    return {
        component,
        spy,
        reviewerName: component.find('input[name="reviewer_name_1"]'),
        authorName: component.find('input[name="author_name_1"]'),
        button: component.find('input[type="button"]'),
    };
};

describe('<CommonRowContent />', () => {
    it('should render as a reviewer', () => {
        const { reviewerName, authorName, } = setup();
        expect(reviewerName.length).toBe(1);
        expect(authorName.length).toBe(0);
    });
    it('should render as an author', () => {
        const { reviewerName, authorName, } = setup(false);
        expect(authorName.length).toBe(1);
        expect(reviewerName.length).toBe(0);
    });
    it('should dispatch "onChange" with the correct data', () => {
        const { reviewerName, spy, } = setup();
        reviewerName.simulate('change');
        expect(spy.callCount).toBe(1);
        expect(spy.firstCall.args.length).toBe(4);
        expect(spy.firstCall.args[0]).toEqual('review');
        expect(spy.firstCall.args[1]).toEqual('name');
        expect(spy.firstCall.args[2]).toEqual('1');
    });
    it('should dispatch "uploadHandler" with the correct data', () => {
        const { button, spy, } = setup();
        button.simulate('click');
        expect(spy.callCount).toBe(1);
        expect(spy.firstCall.args.length).toBe(4);
        expect(spy.firstCall.args[0]).toEqual('review');
        expect(spy.firstCall.args[1]).toEqual('1');
    });
});
