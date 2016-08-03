// jest.unmock('../Card');
//
// import * as React from 'react';
// import { shallow } from 'enzyme';
// import { spy } from 'sinon';
// import { Card } from '../Card';
//
// const setup = (selected: boolean) => {
//     const s = spy();
//     const component = shallow(
//         <Card isSelected={selected} click={s} id={'id'} html={'<h3>Test</h3>'}/>
//     );
//     return {
//         s,
//         component,
//     };
// };
//
// describe('<Card/>', () => {
//     it('should render selected', () => {
//         const { component } = setup(true);
//         expect(component.first().props().className).toBe('abt-card selected');
//     });
//     it('should render unselected', () => {
//         const { component } = setup(false);
//         expect(component.first().props().className).toBe('abt-card');
//     });
//     it('should call onClick when clicked', () => {
//         const { component, s } = setup(false);
//         component.simulate('click');
//         expect(s.callCount).toBe(1);
//     });
// });
