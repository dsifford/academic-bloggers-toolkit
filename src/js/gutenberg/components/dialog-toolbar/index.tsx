import { ReactNode } from 'react';

import styles from './style.scss';

interface Props {
    children: ReactNode;
}

const DialogToolbar = ({ children }: Props): JSX.Element => (
    <div className={styles.toolbar}>{children}</div>
);

export default DialogToolbar;
