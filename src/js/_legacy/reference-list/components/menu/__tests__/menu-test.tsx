import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import UIStore from '_legacy/stores/ui/reference-list';
import Menu from '..';

const setup = () => {
    const citationStyle: ABT.CitationStyle = top.ABT.styles.styles[0];
    const data = { citationStyle };
    const store = new UIStore(false);
    const onSubmit = jest.fn();
    const component = shallow(
        <Menu data={data} ui={store} onSubmit={onSubmit} />,
    );
    return {
        component,
        onSubmit,
    };
};

describe('<Menu />', () => {
    it('should match snapshots', () => {
        const { component } = setup();
        expect(toJSON(component)).toMatchSnapshot();
    });
    it('should handle clicks', () => {
        const { component, onSubmit } = setup();
        const button = component.find('Button').first();
        const submitData = {
            kind: 'OPEN_IMPORT_DIALOG',
        };
        button.simulate('click', {
            currentTarget: { id: 'OPEN_IMPORT_DIALOG' },
        });
        expect(onSubmit).toHaveBeenCalledWith(submitData);
    });
    it('should handle style change', () => {
        const { component, onSubmit } = setup();
        const styleInput = component.find('StyleInput');
        const suggestion: ABT.CitationStyle = {
            kind: 'predefined',
            label: 'American Medical Association',
            value: 'american-medical-association',
        };
        const data = { suggestion };
        const submitData = { kind: 'CHANGE_STYLE', data: data.suggestion };
        styleInput.simulate('selected', {}, data);
        expect(onSubmit).toHaveBeenCalledWith(submitData);
    });
});
