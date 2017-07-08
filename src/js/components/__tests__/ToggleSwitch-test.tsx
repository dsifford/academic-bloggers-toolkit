import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { ToggleSwitch } from '../ToggleSwitch';

const changeFn = () => void 0;

describe('<ToggleSwitch />', () => {
    it('should match snapshots', () => {
        let component = renderer.create(
            <ToggleSwitch checked={false} label="Test 1" onChange={changeFn} />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component = renderer.create(
            <ToggleSwitch checked={true} label="Test 2" onChange={changeFn} />
        );
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
