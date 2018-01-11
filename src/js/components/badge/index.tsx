import * as React from 'react';
import * as styles from './badge.scss';

interface Props {
    /**
     * Badge background color
     */
    color?: string;
    /**
     * Number to be displayed on badge
     */
    count: number;
}

export default class Badge extends React.PureComponent<Props> {
    render(): JSX.Element {
        const { count, color: background } = this.props;
        return (
            <div className={styles.badge} style={{ background }}>
                {count < 99 ? count : '99+'}
            </div>
        );
    }
}
