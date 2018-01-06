import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './_index.scss';

interface Props {
    options: ABT.DisplayOptions;
}

interface State {
    isToggled: boolean;
}

type HeadingMap = { [k in ABT.HeadingLevel]: string };

export default class Demo extends React.Component<Props, State> {
    static headings: HeadingMap = {
        h1: '2.5em',
        h2: '2.2em',
        h3: '1.8em',
        h4: '1.4em',
        h5: '1.2em',
        h6: '1.0em',
    };

    state = {
        isToggled: false,
    };

    componentWillReceiveProps({ options }: Props): void {
        if (options.bibliography !== this.props.options.bibliography) {
            this.setState(state => ({ ...state, isToggled: false }));
        }
    }

    handleClick = (): void => {
        this.setState(state => ({ ...state, isToggled: !state.isToggled }));
    };

    render(): JSX.Element {
        const {
            options: { bib_heading, links, bib_heading_level, bibliography },
        } = this.props;
        const headingStyle = {
            fontSize: Demo.headings[bib_heading_level],
            lineHeight: Demo.headings[bib_heading_level],
        };
        const headingClass = classNames(styles.demoHeading, {
            [styles.demoHeadingToggle]: bibliography === 'toggle',
            [styles.demoHeadingToggleClosed]: this.state.isToggled,
        });
        return (
            <div className={styles.demo}>
                {bib_heading !== '' && (
                    <h3
                        role="button"
                        onClick={this.handleClick}
                        aria-controls="bibliography-content"
                        className={headingClass}
                        style={headingStyle}
                    >
                        {bib_heading}
                    </h3>
                )}
                <div
                    id="bibliography-content"
                    aria-hidden={this.state.isToggled}
                    style={{
                        display: this.state.isToggled ? 'none' : 'initial',
                    }}
                >
                    <span className={styles.demoNumber}>1.</span>
                    {links === 'always' && (
                        <span>
                            Sifford D P. Academic Blogger’s Toolkit:{' '}
                            <a
                                href="https://wordpress.org/plugins/academic-bloggers-toolkit/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://wordpress.org/plugins/academic-bloggers-toolkit/
                            </a>.
                            <i> J WordPress</i>. 2015;12(5):12-24. [
                            <a
                                href="https://dx.doi.org/#1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Source
                            </a>]
                        </span>
                    )}
                    {links === 'always-full-surround' && (
                        <span>
                            <a
                                href="https://dx.doi.org/#2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Sifford D P. Academic Blogger’s Toolkit:{' '}
                                https://wordpress.org/plugins/academic-bloggers-toolkit/.
                                <i> J WordPress</i>. 2015;12(5):12-24.
                            </a>
                        </span>
                    )}
                    {links === 'urls' && (
                        <span>
                            {'Sifford D P. Academic Blogger’s Toolkit: '}
                            <a
                                href="https://wordpress.org/plugins/academic-bloggers-toolkit/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://wordpress.org/plugins/academic-bloggers-toolkit/
                            </a>. <i>J WordPress</i>. 2015;12(5):12-24.
                        </span>
                    )}
                    {links === 'never' && (
                        <span>
                            Sifford D P. Academic Blogger’s Toolkit:{' '}
                            {
                                'https://wordpress.org/plugins/academic-bloggers-toolkit/'
                            }
                            {'. '}
                            <i>J WordPress</i>. 2015;12(5):12-24.
                        </span>
                    )}
                </div>
            </div>
        );
    }
}
