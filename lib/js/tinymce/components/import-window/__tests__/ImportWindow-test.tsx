jest.unmock('../ImportWindow');
jest.mock('../../../../utils/Modal');
jest.unmock('../../../../utils/RISParser');

import * as React from 'react';
import { mount, } from 'enzyme';
import * as sinon from 'sinon';
import { spy, } from 'sinon';
import { ImportWindow, } from '../ImportWindow';


const setup = () => {
    const spy = sinon.spy();
    const wm: TinyMCE.WindowManager = {
        windows: [
            {
                settings: {},
            },
        ],
        setParams: spy,
        close: spy,
        alert: spy,
    };
    const component = mount(
        <ImportWindow wm={wm} />
    );
    return {
        spy,
        component,
        linkCheckbox: component.find('#includeLink'),
        submit: component.find('#submitbtn'),
        upload: component.find('#uploadField'),
    };
};

describe('<ImportWindow />', () => {

    it('calls componentDidMount', () => {
        spy(ImportWindow.prototype, 'componentDidMount');
        const { component, } = setup();
        expect((ImportWindow.prototype.componentDidMount as Sinon.SinonSpy).calledOnce).toEqual(true);
    });

    it('should properly toggle "links" when checkbox is toggled', () => {
        const { component, linkCheckbox, } = setup();

        expect(linkCheckbox.props().checked).toBe(true);
        expect(component.state().links).toBe(true);

        linkCheckbox.simulate('change');

        expect(linkCheckbox.props().checked).toBe(false);
        expect(component.state().links).toBe(false);
    });

    it('should trigger handleFileUpload when upload field changed', () => {
        const handleFileUpload = spy(ImportWindow.prototype, 'handleFileUpload');
        const { upload, } = setup();
        upload.simulate('change', { target: { files: [ new File(['testdata', ], 'test'), ], value: 'test.ris', }, });
        expect(handleFileUpload.calledOnce).toEqual(true);
    });

    it('should handle form submit correctly', () => {
        const { component, submit, spy, } = setup();
        const stateData = {
            filename: 'test',
            payload: [{}, ],
            format: 'american-medical-association',
            links: true,
        };

        expect(submit.props().disabled).toBe(true);
        component.setState(stateData);
        expect(submit.props().disabled).toBe(false);
        submit.simulate('click');
        expect(spy.callCount).toBe(2);
        expect(spy.firstCall.args[0]).toEqual({ data: stateData, });
    });

});
