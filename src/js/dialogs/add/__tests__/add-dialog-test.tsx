import { shallow, ShallowWrapper } from 'enzyme';
import toJSON, { OutputMapper } from 'enzyme-to-json';
import * as React from 'react';

import AddDialog from '..';

const setup = () => {
    const toggleFocusTrap = jest.fn();
    const onSubmit = jest.fn();
    const component = shallow(<AddDialog onSubmit={onSubmit} toggleFocusTrap={toggleFocusTrap} />);
    return {
        component,
        instance: component.instance() as AddDialog,
        toggleFocusTrap,
        onSubmit,
    };
};

const mapper: OutputMapper = json => {
    if (json.props.store) {
        delete json.props.store;
    }
    return json;
};

const J = (component: ShallowWrapper) => toJSON(component, { noKey: true, map: mapper });

describe('<AddDialog />', () => {
    const BASELINE = J(setup().component);
    it('should match baseline snapshot', () => {
        expect(BASELINE).toMatchSnapshot();
    });
    it('should toggle loading', () => {
        const { component, instance } = setup();
        instance.store.isLoading = true;
        component.update();
        expect(J(component)).toMatchDiffSnapshot(BASELINE);
    });
    it('should render pubmed dialog', () => {
        const { component, instance, toggleFocusTrap } = setup();
        instance.openPubmedDialog();
        component.update();
        expect(J(component)).toMatchDiffSnapshot(BASELINE);
        instance.closePubmedDialog();
        component.update();
        expect(J(component)).toMatchDiffSnapshot(BASELINE);
        expect(toggleFocusTrap).toHaveBeenCalledTimes(2);
    });
    it('should toggle ManualInput', () => {
        const { component, instance } = setup();
        expect(component.find('ManualInput').length).toBe(0);
        instance.store.addManually = true;
        component.update();
        expect(component.find('ManualInput').length).toBe(1);
    });
    it('should append PMIDs', () => {
        const { instance } = setup();
        expect(instance.store.identifierList).toBe('');
        instance.appendPMID('12345');
        expect(instance.store.identifierList).toBe('12345');
        const identiferFieldMock = {
            focus: jest.fn(),
        };
        (instance as any).identifierInputField = identiferFieldMock;
        instance.appendPMID('67890');
        expect(instance.store.identifierList).toBe('12345, 67890');
        expect(identiferFieldMock.focus).toHaveBeenCalled();
    });
    it('should handle submit', () => {
        const { instance, onSubmit } = setup();
        const formElementMock = {
            preventDefault: jest.fn(),
        };
        (instance as any).handleSubmit(formElementMock);
        expect(onSubmit).toHaveBeenCalled();
        expect(formElementMock.preventDefault).toHaveBeenCalled();
    });
});
