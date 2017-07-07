jest.mock('../../../../utils/Modal');

import { mount } from 'enzyme';
import * as React from 'react';
import { RISParser } from '../../../../utils/parsers/';
import { ImportWindow } from '../ImportWindow';

const setup = () => {
    const alert = jest.fn();
    const close = jest.fn();
    const setParams = jest.fn();
    const wm: Partial<TinyMCE.WindowManager> = {
        alert,
        confirm,
        close,
        setParams,
        windows: [
            {
                settings: {},
            },
        ],
    };
    const component = mount(<ImportWindow wm={wm as TinyMCE.WindowManager} />);
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
        expect(ImportWindow.prototype.componentDidMount).toHaveBeenCalledTimes(
            1
        );
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
    it('should handle extensionless uploads', () => {
        spyOn(window, 'FileReader').and.returnValue({
            addEventListener: () => null,
            readAsText: () => null,
        });
        const { instance } = setup();
        expect(instance.filename).toBe('');
        instance.handleFileUpload({
            currentTarget: { files: [{ name: 'testing' }] },
            preventDefault: () => null,
        });
        expect(instance.filename).toBe('testing');
    });
    it('should handle form submit correctly', () => {
        const { instance, submit, setParams } = setup();
        const filename = 'test.ris';
        const payload = [{}];

        expect(submit.props().className).toBe(
            'abt-btn abt-btn_submit abt-btn_disabled'
        );
        instance.setFilename(filename);
        instance.setPayload(payload);
        expect(submit.props().className).toBe('abt-btn abt-btn_submit');
        submit.simulate('click');
        expect(setParams).toHaveBeenCalledTimes(1);
        expect(setParams.mock.calls[0]).toEqual([{ data: payload }]);
    });
    it('should trigger an alert when the upload returns a length of 0 (bad file)', () => {
        spyOn(RISParser.prototype, 'parse').and.returnValue([]);
        const { instance, alert } = setup();
        instance.parseFile({ currentTarget: { result: '' } });
        expect(alert).toHaveBeenCalledTimes(1);
    });
    it('should handle a RIS file', () => {
        const { instance } = setup();
        spyOn(instance, 'setPayload');
        const mockFile = {
            result:
                `TY  - ICOMM\n` +
                `T1  - Faked peer reviews prompt 64 retractions\n` +
                `A1  - Callaway, Ewen\n` +
                `Y1  - 2015///\n` +
                `JF  - Nature: News Section2\n` +
                `VL  - 785\n` +
                `SP  - 23\n` +
                `EP  - 25\n` +
                `DO  - 10.1038/nature.2015.18202\n` +
                `ER  - `,
        };
        instance.parseFile(mockFile, 'ris');
        expect(instance.setPayload.calls.mostRecent().args[0].length).toBe(1);
        expect(instance.setPayload.calls.mostRecent().args[0][0].title).toBe(
            'Faked peer reviews prompt 64 retractions'
        );
    });
    it('should handle a BibTeX file', () => {
        const { instance } = setup();
        spyOn(instance, 'setPayload');
        const mockFile = {
            result: '@article{test_file,title = {This is a test}}',
        };
        instance.parseFile(mockFile, 'bib');
        expect(instance.setPayload.calls.mostRecent().args[0].length).toBe(1);
        expect(instance.setPayload.calls.mostRecent().args[0][0].title).toBe(
            'This is a test'
        );
    });
    it('should alert and set filename to empty string on error', () => {
        const { instance, alert } = setup();
        spyOn(instance, 'setFilename');
        const mockFile = {
            result: '',
        };
        instance.parseFile(mockFile, 'gibberish');
        expect(alert).toHaveBeenCalled();
        expect(instance.setFilename.calls.mostRecent().args[0]).toBe('');
    });
    it('should alert and set filename to empty string when result is empty', () => {
        const { instance, alert } = setup();
        spyOn(instance, 'setFilename');
        const mockFile = {
            result: '',
        };
        instance.parseFile(mockFile, 'ris');
        expect(alert).toHaveBeenCalled();
        expect(instance.setFilename.calls.mostRecent().args[0]).toBe('');
    });
    it('should alert with leftovers when they exist', () => {
        const { instance, alert } = setup();
        spyOn(instance, 'setPayload');
        const mockFile = {
            result:
                `TY  - ICOMM\n` +
                `T1  - Faked peer reviews prompt 64 retractions\n` +
                `A1  - Callaway, Ewen\n` +
                `Y1  - 2015///\n` +
                `JF  - Nature: News Section2\n` +
                `VL  - 785\n` +
                `SP  - 23\n` +
                `EP  - 25\n` +
                `DO  - 10.1038/nature.2015.18202\n` +
                `ER  - ` +
                `TY  - GIBBERISH\n` +
                `T1  - Faked peer reviews prompt 64 retractions\n` +
                `A1  - Callaway, Ewen\n` +
                `Y1  - 2015///\n` +
                `ER  -`,
        };
        instance.parseFile(mockFile, 'ris');
        expect(alert).toHaveBeenCalled();
        expect(instance.setPayload.calls.mostRecent().args[0].length).toBe(1);
        expect(instance.setPayload.calls.mostRecent().args[0][0].title).toBe(
            'Faked peer reviews prompt 64 retractions'
        );
    });
    it('should alert and set filename to empty string on parse errors', () => {
        const { instance, alert } = setup();
        spyOn(instance, 'setFilename');
        const mockFile = {
            result: `@Preamble{"\\def\\germ{\\frak} \\def\\scr{\\cal}\\ifx\\documentclass\\undefinedcs`,
        };
        instance.parseFile(mockFile, 'bib');
        expect(alert).toHaveBeenCalled();
        expect(instance.setFilename.calls.mostRecent().args[0]).toBe('');
    });
});
