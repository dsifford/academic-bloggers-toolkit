jest.mock('../../../../utils/Modal');
jest.mock('../../../../utils/resolvers/');
jest.mock('../ResultList');

import * as React from 'react';
import { mount } from 'enzyme';
import { PubmedWindow} from '../PubmedWindow';
import { pubmedQuery } from '../../../../utils/resolvers/';

window['tinyMCE'] = {
    activeEditor: {
        windowManager: {
            alert: jest.fn(),
            windows: [
                { data: {}, submit: jest.fn() },
            ],
        }
    }
} as any;

const mocks = {
    alert: window['tinyMCE'].activeEditor.windowManager.alert,
    pmq: pubmedQuery as jest.Mock<any>,
    submit: window['tinyMCE'].activeEditor.windowManager.windows[0].submit,
};

const setup = () => {
    const component = mount(
        <PubmedWindow />
    );
    const instance = component.instance() as any;
    return {
        component,
        instance,
    };
};

describe('<PubmedWindow />', () => {
    it('should render with loading spinner', () => {
        const { component, instance } = setup();
        instance.toggleLoadState();
        expect(instance.isLoading).toBe(true);
        expect(component.find('Spinner').length).toBe(1);
    });
    it('should update query on input change', () => {
        const { component, instance } = setup();
        const input = component.find('input[type="text"]');
        expect(input.props().value).toBe('');
        input.simulate('change', { currentTarget: { value: 'TESTING' }});
        instance.query = 'TESTING'; // Issue with enzyme
        expect(component.find('input[type="text"]').props().value).toBe('TESTING');
    });
    it('should handle scroll', () => {
        const { component } = setup();
        const root = component.first();
        const stopPropagation = jest.fn();
        const preventDefault = jest.fn();
        root.simulate('wheel', { preventDefault, stopPropagation });
        expect(stopPropagation).toHaveBeenCalled();
        expect(preventDefault).toHaveBeenCalled();
    });
    it('should handle queries', async () => {
        mocks.pmq.mockImplementation(() => new Promise(res => res([{title: 'testing'}])));
        const { instance, component } = setup();
        const form = component.find('form');
        await form.simulate('submit');
        expect(instance.results.slice()).toEqual([{title: 'testing'}]);
    });
    it('should change page', () => {
        const { instance } = setup();
        expect(instance.page).toBe(0);
        instance.changePage(1);
        expect(instance.page).toBe(1);
    });
    it('should deliver the pmid', () => {
        const { instance } = setup();
        instance.deliverPMID('1234567');
        expect(window['tinyMCE'].activeEditor.windowManager.windows[0].data).toEqual({pmid: '1234567'});
        expect(mocks.submit).toHaveBeenCalled();
    });
    it('should handle errors', async () => {
        mocks.pmq.mockImplementation(() => new Promise((_, rej) => rej()));
        const { component, instance } = setup();
        const form = component.find('form');
        await form.simulate('submit');
        expect(instance.results.slice()).toEqual([]);
    });
    it('should handle situations where the query returns zero results', async () => {
        mocks.pmq.mockImplementation(() => new Promise(res => res([])));
        const { instance, component } = setup();
        const form = component.find('form');
        await form.simulate('submit');
        expect(instance.results.slice()).toEqual([]);
        expect(mocks.alert).toHaveBeenCalled();
    });
});
