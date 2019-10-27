import { DataContext } from 'gutenberg/context';
import { isCslNumberKey } from 'utils/constants';
import { InputField } from 'utils/fieldmaps';

import styles from './style.scss';

interface Props {
    field: InputField;
}

export default function NumberField({
    field: { inputProps, key, label },
}: Props) {
    if (!isCslNumberKey(key)) {
        return null;
    }
    return (
        <DataContext.Consumer>
            {({ data, update }) => (
                <label key={label} className={styles.field}>
                    {label}
                    <input
                        {...inputProps}
                        key={key}
                        autoComplete="off"
                        data-lpignore="true"
                        type="number"
                        value={data[key] || ''}
                        onChange={e =>
                            update(key, parseFloat(e.currentTarget.value))
                        }
                    />
                </label>
            )}
        </DataContext.Consumer>
    );
}
