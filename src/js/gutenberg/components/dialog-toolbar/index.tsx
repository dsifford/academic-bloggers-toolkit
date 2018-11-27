import { ReactNode } from 'react';

import styles from './style.scss';

interface IProps {
    children: ReactNode;
}

const DialogToolbar = ({ children }: IProps): JSX.Element => (
    <div className={styles.toolbar}>{children}</div>
);

export default DialogToolbar;
