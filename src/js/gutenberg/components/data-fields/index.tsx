import {
    CSL_DATE_KEYS,
    CSL_NUMBER_KEYS,
    CSL_STRING_KEYS,
} from 'utils/constants';
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
                if (CSL_DATE_KEYS.includes(field.key as CSL.DateFieldKey)) {
                    return <DateField key={field.key} field={field} />;
                }
                if (CSL_NUMBER_KEYS.includes(field.key as CSL.NumberFieldKey)) {
                    return <NumberField key={field.key} field={field} />;
                }
                if (CSL_STRING_KEYS.includes(field.key as CSL.StringFieldKey)) {
                    return <StringField key={field.key} field={field} />;
                }
                return null;
            })}
        </div>
    </>
);

export default DataFields;
