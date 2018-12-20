import { DataContext } from 'gutenberg/context';
import { InputField } from 'utils/fieldmaps';

import styles from './style.scss';

namespace StringField {
    export interface Props {
        field: InputField;
    }
}

const StringField = ({
    field: { key, label, inputProps },
}: StringField.Props) => (
    <DataContext.Consumer>
        {({ data, update }) => (
            <label key={label} className={styles.field}>
                {label}
                <input
                    {...inputProps}
                    autoComplete="off"
                    data-lpignore="true"
                    key={key}
                    type="text"
                    value={data[key] as string}
                    onChange={e => update(key, e.currentTarget.value)}
                />
            </label>
        )}
    </DataContext.Consumer>
);

export default StringField;
