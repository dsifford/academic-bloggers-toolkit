import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Callout from '../callout';

describe('<Callout />', () => {
    it('should match snapshots', () => {
        let component = renderer.create(<Callout children="Hello world" />);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component = renderer.create(<Callout title="Hello!" children="Hello world" />);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component = renderer.create(<Callout isVisible={false} children="Hello world" />);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component = renderer.create(<Callout isVisible={false} children="Hello world" />);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component = renderer.create(<Callout intent="warning" children="Hello world" />);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        const dismiss = () => void 0;
        component = renderer.create(<Callout dismiss={dismiss}  children="Hello world" />);
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
