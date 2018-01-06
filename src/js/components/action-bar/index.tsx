import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './action-bar.scss';

interface Props {
    children: React.ReactNode;
    align?: 'left' | 'right';
}

export default class ActionBar extends React.PureComponent<Props> {
    static Separator = (): JSX.Element => <span className={styles.separator} />;
    render(): JSX.Element {
        const { align, ...props } = this.props;
        const className = classNames(styles.actionBar, {
            [styles.alignRight]: align === 'right',
        });
        return <div className={className} {...props} />;
    }
}
