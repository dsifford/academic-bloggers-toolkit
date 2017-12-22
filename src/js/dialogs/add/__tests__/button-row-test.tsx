// import { shallow } from 'enzyme';
// import toJSON from 'enzyme-to-json';
// import { observable } from 'mobx';
// import * as React from 'react';
// import ButtonRow from '../button-row';

// const observables = {
//     addManually: observable(true),
//     attachInline: observable(false),
// };

// const spies = {
//     onAttachInlineToggle: jest.fn(),
//     onToggleManual: jest.fn(),
//     onSearchPubmedClick: jest.fn(),
// };

// const setup = (
//     addManually: boolean = true,
//     attachInline: boolean = false,
//     isLoading: boolean = false,
// ) => {
//     observables.addManually.set(addManually);
//     observables.attachInline.set(attachInline);
//     const component = shallow(<ButtonRow {...observables} {...spies} isLoading={isLoading} />);
//     return {
//         component,
//     };
// };

// describe('<ButtonRow />', () => {
//     beforeEach(() => {
//         jest.resetAllMocks();
//     });
//     it('should match snapshots', () => {
//         let { component } = setup();
//         expect(toJSON(component)).toMatchSnapshot();

//         ({ component } = setup(false));
//         expect(toJSON(component)).toMatchSnapshot();
//     });
// });
