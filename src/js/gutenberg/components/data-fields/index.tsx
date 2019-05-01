import { isCslDateKey, isCslNumberKey, isCslStringKey } from 'utils/constants';
import { FieldMapping } from 'utils/fieldmaps';

import DateField from './date-field';
import NumberField from './number-field';
import StringField from './string-field';
import styles from './style.scss';

interface Props {
    fieldmap: FieldMapping;
}

const DataFields = ({ fieldmap: { title, fields } }: Props) => (
    <>
        <h2>{title}</h2>
        <div className={styles.container}>
            {fields.map(field => {
                if (isCslDateKey(field.key)) {
                    return <DateField key={field.key} field={field} />;
                }
                if (isCslNumberKey(field.key)) {
                    return <NumberField key={field.key} field={field} />;
                }
                if (isCslStringKey(field.key)) {
                    return <StringField key={field.key} field={field} />;
                }
                return null;
            })}
        </div>
    </>
);

export default DataFields;
