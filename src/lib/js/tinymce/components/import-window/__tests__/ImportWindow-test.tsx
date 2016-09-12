jest.unmock('../ImportWindow');
jest.mock('../../../../utils/Modal');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import * as parser from '../../../../utils/RISParser';
import { ImportWindow } from '../ImportWindow';

const setup = () => {
    const alert = sinon.spy();
    const close = sinon.spy();
    const setParams = sinon.spy();
    const wm: TinyMCE.WindowManager = {
        alert,
        close,
        setParams,
        windows: [
            {
                settings: {},
            },
        ],
    };
    const component = mount(
        <ImportWindow wm={wm} />
    );
    return {
        alert,
        close,
        setParams,
        component,
        submit: component.find('#submitbtn'),
        upload: component.find('#uploadField'),
    };
};

describe('<ImportWindow />', () => {

    it('calls componentDidMount', () => {
        sinon.spy(ImportWindow.prototype, 'componentDidMount');
        setup();
        expect((ImportWindow.prototype.componentDidMount as sinon.SinonSpy).calledOnce).toEqual(true);
    });

    it('should trigger handleFileUpload when upload field changed', () => {
        const { upload, component } = setup();
        const handleFileUpload = sinon.spy(component.instance(), 'handleFileUpload');
        component.update();
        upload.simulate('change', { target: { files: [new File(['testdata'], 'test')], value: 'test.ris' } });
        expect(handleFileUpload.calledOnce).toEqual(true);
    });

    it('should handle form submit correctly', () => {
        const { component, submit, setParams } = setup();
        const filename = 'test';
        const payload = [{}];
        const instance = (component.instance() as any);

        expect(submit.props().disabled).toBe(true);
        instance.setFilename(filename);
        instance.setPayload(payload);
        expect(submit.props().disabled).toBe(false);
        submit.simulate('click');
        expect(setParams.callCount).toBe(1);
        expect(setParams.firstCall.args[0]).toEqual({ data: payload });
    });

    it('should trigger an alert when the upload returns a length of 0 (bad file)', () => {
        const stub = sinon.stub(parser, 'RISParser', function() { // tslint:disable-line
            this.parse = () => [];
        });
        const { component, alert } = setup();
        (component as any).instance().parseFile({target: {result: ''}});
        expect(alert.called).toBe(true);
        stub.restore();
    });

    it('should trigger an alert when some references can\'t be parsed', () => {
        const stub = sinon.stub(parser, 'RISParser', function() { // tslint:disable-line
            this.parse = () => [{}, {}, {}];
            this.unsupportedRefs = ['one', 'two', 'three'];
        });
        const { component, alert } = setup();
        (component as any).instance().parseFile({target: {result: ''}});
        expect(alert.callCount).toBe(1);
        expect(alert.args[0][0]).toBe(
            '𝗘𝗿𝗿𝗼𝗿: The following references were unable to be processed: one, two, three'
        );
        stub.restore();
    });
});
