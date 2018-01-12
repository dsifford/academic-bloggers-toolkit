import * as React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import Demo from '../demo';

const setup = ({
    bib_heading = 'Bibliography',
    bib_heading_level = 'h3',
    bibliography = 'fixed',
    links = 'always',
}: Partial<ABT.DisplayOptions> = {}) => {
    const options = {
        bib_heading,
        bib_heading_level,
        bibliography,
        links,
    };
    const component = shallow(<Demo options={options} />);
    return {
        component,
    };
};

describe('<Demo />', () => {
    describe('Snapshots', () => {
        it('should render headings', () => {
            const { component } = setup();
            const BASE = toJSON(component);
            expect(BASE).toMatchSnapshot();

            const { component: headingChanged } = setup({
                bib_heading: 'Testing',
            });
            expect(toJSON(headingChanged)).toMatchDiffSnapshot(BASE);

            const { component: withoutHeading } = setup({ bib_heading: '' });
            expect(toJSON(withoutHeading)).toMatchDiffSnapshot(BASE);
        });
        it('should render correct heading level', () => {
            const { component } = setup();
            const BASE = toJSON(component);
            expect(BASE).toMatchSnapshot();

            for (const bib_heading_level of [
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
            ] as ABT.HeadingLevel[]) {
                const { component: levelChanged } = setup({
                    bib_heading_level,
                });
                expect(toJSON(levelChanged)).toMatchDiffSnapshot(BASE);
            }
        });
        it('should render correct link format', () => {
            const { component } = setup();
            const BASE = toJSON(component);
            expect(BASE).toMatchSnapshot();

            const { component: alwaysFullSurround } = setup({
                links: 'always-full-surround',
            });
            expect(toJSON(alwaysFullSurround)).toMatchDiffSnapshot(BASE);

            const { component: urls } = setup({ links: 'urls' });
            expect(toJSON(urls)).toMatchDiffSnapshot(BASE);

            const { component: never } = setup({ links: 'never' });
            expect(toJSON(never)).toMatchDiffSnapshot(BASE);
        });
    });
    it('should handle click', () => {
        const { component } = setup();
        const heading = component.find('h3').first();
        expect(component.state().isToggled).toBe(false);
        heading.simulate('click');
        expect(component.state().isToggled).toBe(true);
    });
    it('should handle prop change', () => {
        const options: ABT.DisplayOptions = {
            bib_heading: 'Bibliography',
            bib_heading_level: 'h3',
            links: 'always',
            bibliography: 'toggle',
        };
        const { component } = setup(options);
        component.setState({ isToggled: true });

        // `bibliography` prop idential. No state change
        component.setProps({ options });
        expect(component.state().isToggled).toBe(true);

        // `bibliography` prop different. State change.
        component.setProps({ options: { ...options, bibliography: 'fixed' } });
        expect(component.state().isToggled).toBe(false);
    });
});
