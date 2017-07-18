import { shallow } from 'enzyme';
import { observable } from 'mobx';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ButtonRow from '../button-row';

const observables = {
    addManually: observable(true),
    attachInline: observable(false),
};

const spies = {
    attachInlineToggle: jest.fn(),
    toggleManual: jest.fn(),
    pubmedCallback: jest.fn(),
};

const setup = (addManually: boolean = true, attachInline: boolean = false) => {
    observables.addManually.set(addManually);
    observables.attachInline.set(attachInline);
    const component = shallow(<ButtonRow {...observables} {...spies} />);
    return {
        component
    };
};

describe('<ButtonRow />', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })
    it('should match snapshots', () => {
        const component = renderer.create(
            <ButtonRow {...observables} {...spies} />
        )
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('should toggle the pubmed dialog', () => {
        const { component } = setup(false, true);
        const pubmedBtn = component.find('#searchPubmed');
        expect(component.find('Container').length).toBe(0);
        pubmedBtn.simulate('click');
        expect(component.find('Container').length).toBe(1);
    });
    it('should handle pubmed dialog submit', () => {
        const { component } = setup();
        const pubmedBtn = component.find('#searchPubmed');
        pubmedBtn.simulate('click');
        const submitBtn = component.find('PubmedDialog');
        submitBtn.simulate('submit');
        expect(spies.pubmedCallback).toHaveBeenCalledTimes(1);
    });
});
