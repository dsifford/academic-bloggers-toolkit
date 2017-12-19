import * as React from 'react';

import * as styles from './action-bar.scss';

interface Props {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export default class ActionBar extends React.PureComponent<Props> {
    static Separator = (): JSX.Element => <span className={styles.separator} />;
    render(): JSX.Element {
        return <div className={styles.actionBar} {...this.props} />;
    }
}
