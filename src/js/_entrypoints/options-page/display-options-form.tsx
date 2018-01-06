import { observer } from 'mobx-react';
import * as React from 'react';

import DisplayOptionsStore from 'stores/ui/display-options-form';

import RadioGroup from 'components/radio-group';
import Demo from './demo';

import * as styles from './_index.scss';

type InputEvent = React.FormEvent<HTMLInputElement>;

@observer
export default class DisplayOptionsForm extends React.Component {
    store: DisplayOptionsStore;

    constructor(props: {}) {
        super(props);
        this.store = new DisplayOptionsStore(top.ABT.options.display_options);
        this.store.rehydrate();
    }

    handleBibliographyStyleChange = (e: InputEvent): void => {
        this.store.options = {
            ...this.store.options,
            bibliography: e.currentTarget.value as 'fixed' | 'toggle',
        };
    };

    handleLinkStyleChange = (e: InputEvent): void => {
        this.store.options = {
            ...this.store.options,
            links: e.currentTarget.value as ABT.LinkStyle,
        };
    };

    handleHeadingChange = (e: InputEvent): void => {
        const bib_heading = e.currentTarget.value;
        const bibliography =
            bib_heading === '' ? 'fixed' : this.store.bibliography;
        this.store.options = {
            ...this.store.options,
            bibliography,
            bib_heading,
        };
    };

    handleHeadingLevelChange = (e: InputEvent): void => {
        this.store.options = {
            ...this.store.options,
            bib_heading_level: e.currentTarget.value as ABT.HeadingLevel,
        };
    };

    render(): JSX.Element {
        return (
            <>
                <label className={styles.label}>
                    Heading
                    <input
                        type="text"
                        name="bib_heading"
                        value={this.store.bib_heading}
                        className={`${styles.input} ${styles.fill}`}
                        onChange={this.handleHeadingChange}
                    />
                </label>
                <RadioGroup
                    // TODO: i18n here
                    label={`Heading Level`}
                    name="bib_heading_level"
                    value={this.store.bib_heading_level}
                    items={['1', '2', '3', '4', '5', '6'].map(level => ({
                        label: level,
                        value: `h${level}`,
                        disabled: this.store.bib_heading === '',
                    }))}
                    onChange={this.handleHeadingLevelChange}
                />
                <RadioGroup
                    // TODO: i18n here
                    label={`Bibliography Style`}
                    name="bibliography"
                    value={this.store.bibliography}
                    items={[
                        {
                            label: 'Fixed',
                            value: 'fixed',
                        },
                        {
                            label: 'Toggle',
                            value: 'toggle',
                            disabled: this.store.bib_heading === '',
                        },
                    ]}
                    onChange={this.handleBibliographyStyleChange}
                />
                <RadioGroup
                    // TODO: i18n here
                    label={`Link Format`}
                    name="links"
                    value={this.store.links}
                    items={[
                        // TODO: i18n here
                        {
                            label: 'whenever possible (subtle)',
                            value: 'always',
                        },
                        {
                            label: 'whenever possible (full surround)',
                            value: 'always-full-surround',
                        },
                        {
                            label: 'when the citation has a visible URL',
                            value: 'urls',
                        },
                        {
                            label: 'never',
                            value: 'never',
                        },
                    ]}
                    onChange={this.handleLinkStyleChange}
                />
                <Demo options={this.store.options} />
            </>
        );
    }
}
