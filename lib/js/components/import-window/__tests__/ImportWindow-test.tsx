jest.unmock('../ImportWindow');
jest.mock('../../../utils/Modal');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { spy } from 'sinon';
import { ImportWindow } from '../ImportWindow';


const setup = (
    style: string|boolean = false
) => {
    const spy = sinon.spy();
    const wm: TinyMCE.WindowManager = {
        windows: [
            {
                settings: {
                    params: {
                        preferredStyle: style,
                    }
                }
            }
        ],
        setParams: spy,
        close: spy,
        alert: spy,
    }
    const component = mount(
        <ImportWindow wm={wm} />
    );
    return {
        spy,
        component,
        linkCheckbox: component.find('#includeLink'),
        select: component.find('#citeformat'),
        submit: component.find('#submitbtn'),
        upload: component.find('#uploadField'),
    }
}

describe('<ImportWindow />', () => {

    it('calls componentDidMount', () => {
        spy(ImportWindow.prototype, 'componentDidMount');
        const { component } = setup();
        expect((ImportWindow.prototype.componentDidMount as any).calledOnce).toEqual(true);
    });

    it('calls componentDidUpdate', () => {
        spy(ImportWindow.prototype, 'componentDidUpdate');
        const { select } = setup();
        select.simulate('change');
        expect((ImportWindow.prototype.componentDidUpdate as any).calledOnce).toEqual(true);
    });

    it('should properly toggle "links" when checkbox is toggled', () => {
        const { component, linkCheckbox } = setup();

        expect(linkCheckbox.props().checked).toBe(true);
        expect(component.state().links).toBe(true);

        linkCheckbox.simulate('change');

        expect(linkCheckbox.props().checked).toBe(false);
        expect(component.state().links).toBe(false);
    });

    it('should render citation selection properly when default is set', () => {
        const { select } = setup('bibtex');
        expect(select.props().value).toEqual('bibtex');
    });

    it('should default to "american-medical-association" when no default style is set', () => {
        const { select } = setup();
        expect(select.props().value).toEqual('american-medical-association');
    });

    it('should render selected option properly and set state correctly on change', () => {
        const { select, component } = setup();
        select.simulate('change', { target: { value: 'bibtex' } });
        expect(select.props().value).toBe('bibtex');
        expect(component.state().format).toBe('bibtex');
    });

    it('should trigger handleFileUpload when upload field changed', () => {
        const handleFileUpload = spy(ImportWindow.prototype, 'handleFileUpload');
        const { upload } = setup();
        upload.simulate('change', { target: { files: [ new File(['testdata'], 'test') ], value: 'test.ris' } });
        expect(handleFileUpload.calledOnce).toEqual(true);
    });

    it('should handle form submit correctly', () => {
        const { component, submit, spy } = setup();
        const stateData = {
            filename: 'test',
            payload: [{}],
            format: 'american-medical-association',
            links: true,
        };

        expect(submit.props().disabled).toBe(true);
        component.setState(stateData);
        expect(submit.props().disabled).toBe(false);
        submit.simulate('click');
        expect(spy.callCount).toBe(2);
        expect(spy.firstCall.args[0]).toEqual({ data: stateData });
    });

});
