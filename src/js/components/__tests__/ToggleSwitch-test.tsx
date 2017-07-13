import { observable } from 'mobx';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { ToggleSwitch } from '../ToggleSwitch';

const changeFn = () => void 0;

describe('<ToggleSwitch />', () => {
    it('should match snapshots', () => {
        const checked = observable(false);
        let component = renderer.create(
            <ToggleSwitch checked={checked} label="Test 1" onChange={changeFn} />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        checked.set(true);
        component = renderer.create(
            <ToggleSwitch checked={checked} label="Test 2" onChange={changeFn} />
        );
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
