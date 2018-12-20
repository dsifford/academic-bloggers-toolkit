import _ from 'lodash';

import { DataContext } from 'gutenberg/context';
import { InputField } from 'utils/fieldmaps';

import styles from './style.scss';

namespace DateField {
    export interface Props {
        field: InputField;
    }
}

const DateField = ({ field: { key, label, inputProps } }: DateField.Props) => (
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
                    value={_.get(data, [key, 'raw'], '')}
                    onChange={e => update(key, { raw: e.currentTarget.value })}
                />
            </label>
        )}
    </DataContext.Consumer>
);

export default DateField;
