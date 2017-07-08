import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Spinner } from '../Spinner';

describe('<Spinner />', () => {
    it('should match snapshots', () => {
        let component = renderer.create(<Spinner size="50px" />);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component = renderer.create(
            <Spinner size="100px" bgColor="magenta" height={100} overlay />
        );
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
