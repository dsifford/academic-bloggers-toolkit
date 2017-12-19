import * as React from 'react';

import * as styles from './well.scss';

export default class Well extends React.PureComponent {
    render(): JSX.Element {
        return <div className={styles.well} {...this.props} />;
    }
}
