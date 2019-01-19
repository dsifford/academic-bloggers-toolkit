import styles from './style.scss';

interface Props {
    count: number;
}

export default function CountIcon({ count }: Props) {
    return <span className={styles.icon}>{count}</span>;
}
