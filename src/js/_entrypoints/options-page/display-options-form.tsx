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
        const labels = top.ABT.i18n.options_page;
        return (
            <>
                <label className={styles.label}>
                    {labels.heading}
                    <input
                        type="text"
                        name="bib_heading"
                        value={this.store.bib_heading}
                        className={`${styles.input} ${styles.fill}`}
                        onChange={this.handleHeadingChange}
                    />
                </label>
                <RadioGroup
                    label={labels.heading_level}
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
                    label={labels.bibliography_style}
                    name="bibliography"
                    value={this.store.bibliography}
                    items={[
                        {
                            label: labels.fixed,
                            value: 'fixed',
                        },
                        {
                            label: labels.toggle,
                            value: 'toggle',
                            disabled: this.store.bib_heading === '',
                        },
                    ]}
                    onChange={this.handleBibliographyStyleChange}
                />
                <RadioGroup
                    label={labels.link_format.title}
                    name="links"
                    value={this.store.links}
                    items={[
                        {
                            label: labels.link_format.always,
                            value: 'always',
                        },
                        {
                            label: labels.link_format.always_full_surround,
                            value: 'always-full-surround',
                        },
                        {
                            label: labels.link_format.urls,
                            value: 'urls',
                        },
                        {
                            label: labels.link_format.never,
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
