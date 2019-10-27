import { DataContext } from 'gutenberg/context';
import { isCslStringKey } from 'utils/constants';
import { InputField } from 'utils/fieldmaps';

import styles from './style.scss';

interface Props {
    field: InputField;
}

export default function StringField({
    field: { inputProps, key, label },
}: Props) {
    if (!isCslStringKey(key)) {
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
                        type="text"
                        value={data[key] || ''}
                        onChange={e => update(key, e.currentTarget.value)}
                    />
                </label>
            )}
        </DataContext.Consumer>
    );
}
