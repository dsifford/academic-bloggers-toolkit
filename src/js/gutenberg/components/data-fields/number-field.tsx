import { DataContext } from 'gutenberg/context';
import { InputField } from 'utils/fieldmaps';

import styles from './style.scss';

namespace NumberField {
    export interface Props {
        field: InputField;
    }
}

const NumberField = ({
    field: { key, label, inputProps },
}: NumberField.Props) => (
    <DataContext.Consumer>
        {({ data, update }) => (
            <label key={label} className={styles.field}>
                {label}
                <input
                    {...inputProps}
                    autoComplete="off"
                    data-lpignore="true"
                    key={key}
                    type="number"
                    value={data[key] as number}
                    onChange={e =>
                        update(key, parseFloat(e.currentTarget.value))
                    }
                />
            </label>
        )}
    </DataContext.Consumer>
);

export default NumberField;
