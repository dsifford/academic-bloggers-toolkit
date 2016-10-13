import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { Paginate } from '../Paginate';

const setup = (
    page: number,
    resultLength: number
) => {
    const spy = sinon.spy();
    const component = mount(
        <Paginate
            page={page}
            resultLength={resultLength}
            paginate={(num) => { // tslint:disable-line
                component.setProps(
                    Object.assign({}, component.props, { page: num })
                );
            }}
        />
    );
    return {
        component,
        next: component.find('#next'),
        prev: component.find('#prev'),
        spy,
    };
};

describe('<Paginate />', () => {
    it('should render with "next" enabled and "previous" disabled', () => {
        const { next, prev } = setup(1, 50);
        expect(next.props().className).toBe('abt-btn abt-btn_flat');
        expect(prev.props().className).toBe('abt-btn abt-btn_flat abt-btn_disabled');
    });
    it('should render with both "next" and "previous" disabled', () => {
        const { next, prev } = setup(1, 3);
        expect(next.props().className).toBe('abt-btn abt-btn_flat abt-btn_disabled');
        expect(prev.props().className).toBe('abt-btn abt-btn_flat abt-btn_disabled');
    });
    it('should paginate to the next page when "next" is clicked', () => {
        const { component, next } = setup(1, 25);
        next.simulate('click');
        expect(component.props().page).toBe(2);
    });
    it('should paginate to the previous page when "prev" is clicked', () => {
        const { component, prev } = setup(2, 25);
        expect(prev.props().className).toBe('abt-btn abt-btn_flat');
        expect(component.props().page).toBe(2);
        prev.simulate('click');
        expect(component.props().page).toBe(1);
    });
    it('should only be able to paginate to 4 pages', () => {
        const { component, next } = setup(1, 50);
        expect(component.props().page).toBe(1);
        expect(next.props().className).toBe('abt-btn abt-btn_flat');
        next.simulate('click');
        next.simulate('click');
        next.simulate('click');
        expect(next.props().className).toBe('abt-btn abt-btn_flat abt-btn_disabled');
        expect(component.props().page).toBe(4);
    });
});
