jest.mock('../../../../utils/Modal');

import * as React from 'react';
import { mount } from 'enzyme';
import { RISParser } from '../../../../utils/parsers/';
import { ImportWindow } from '../ImportWindow';

const setup = () => {
    const alert = jest.fn();
    const close = jest.fn();
    const setParams = jest.fn();
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
        component,
        instance: component.instance() as any,
        setParams,
        submit: component.find('#submitbtn'),
        upload: component.find('#uploadField'),
    };
};

describe('<ImportWindow />', () => {
    it('calls componentDidMount', () => {
        spyOn(ImportWindow.prototype, 'componentDidMount');
        setup();
        expect(ImportWindow.prototype.componentDidMount).toHaveBeenCalledTimes(1);
    });
    it('should set filename', () => {
        spyOn(window, 'FileReader').and.returnValue({
            addEventListener: () => null,
            readAsText: () => null,
        });
        const { instance } = setup();
        expect(instance.filename).toBe('');
        instance.handleFileUpload({
            currentTarget: { files: [{ name: 'testing.ris' }] },
            preventDefault: () => null,
        });
        expect(instance.filename).toBe('testing.ris');
    });
    it('should handle form submit correctly', () => {
        const { instance, submit, setParams } = setup();
        const filename = 'test';
        const payload = [{}];

        expect(submit.props().className).toBe('abt-btn abt-btn_submit abt-btn_disabled');
        instance.setFilename(filename);
        instance.setPayload(payload);
        expect(submit.props().className).toBe('abt-btn abt-btn_submit');
        submit.simulate('click');
        expect(setParams).toHaveBeenCalledTimes(1);
        expect(setParams.mock.calls[0]).toEqual([{ data: payload }]);
    });
    it('should trigger an alert when the upload returns a length of 0 (bad file)', () => {
        spyOn(RISParser.prototype, 'parse').and.returnValue([]);
        const { component, alert } = setup();
        (component as any).instance().parseFile({currentTarget: {result: ''}});
        expect(alert).toHaveBeenCalledTimes(1);
    });
});
