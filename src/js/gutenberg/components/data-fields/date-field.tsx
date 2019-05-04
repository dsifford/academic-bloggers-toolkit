import { DataContext } from 'gutenberg/context';
import { isCslDateKey } from 'utils/constants';
import { CSLDate } from 'utils/csl';
import { InputField } from 'utils/fieldmaps';

import styles from './style.scss';

interface Props {
    field: InputField;
}

export default function DateField({
    field: { inputProps, key, label },
}: Props) {
    if (!isCslDateKey(key)) {
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
                        value={CSLDate.date2raw(data[key])}
                        onChange={e =>
                            update(
                                key,
                                CSLDate.raw2parts(e.currentTarget.value),
                            )
                        }
                    />
                </label>
            )}
        </DataContext.Consumer>
    );
}
