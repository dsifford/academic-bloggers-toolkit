import _ from 'lodash';

import { DataContext } from 'gutenberg/context';
import { InputField } from 'utils/fieldmaps';

import styles from './style.scss';

namespace DateField {
    export interface Props {
        field: InputField;
    }
}

function raw2parts(date: string): CSL.Date {
    const [year, month, day] = date.split('/');
    const parts: any = [
        ...(year !== undefined ? [year] : []),
        ...(month !== undefined ? [month] : []),
        ...(day !== undefined ? [day] : []),
    ];
    return {
        'date-parts': [parts],
    };
}

function date2raw(date?: CSL.Date): string {
    if (date && date.raw) {
        return date.raw;
    } else if (date && date['date-parts']) {
        return date['date-parts'][0].join('/');
    }
    return '';
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
                    value={date2raw(data[key] as CSL.Date)}
                    onChange={e =>
                        update(key, raw2parts(e.currentTarget.value))
                    }
                />
            </label>
        )}
    </DataContext.Consumer>
);

export default DateField;
