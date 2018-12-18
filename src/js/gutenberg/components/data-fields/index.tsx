import { Field } from 'utils/fieldmaps';

import styles from './style.scss';

interface Props {
    title: string;
    fields: Field[];
}

const DataFields = ({ fields, title }: Props) => (
    <>
        <h2>{title}</h2>
        <div className={styles.container}>
            {fields.map(({ label, value, ...inputProps }) => (
                <label key={label} className={styles.field}>
                    {label}
                    <input type="text" name={value} {...inputProps} />
                </label>
            ))}
        </div>
    </>
);

export default DataFields;
