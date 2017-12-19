import { ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import * as styles from './field.scss';

interface Props {
    /** Field descriptor */
    field: ABT.Field;
    /** Observable map of `ABT.FieldMappings` */
    meta: ObservableMap<string>;
    /** onChange handler for input element */
    onChange(e: React.FormEvent<HTMLInputElement>): void;
}

@observer
export default class Field extends React.Component<Props> {
    render(): JSX.Element {
        const { onChange, field, meta } = this.props;
        const { label, value, ...attrs } = field;
        return (
            <div className={styles.row}>
                <label className={styles.label} htmlFor={value} children={label} />
                <input
                    type="text"
                    className={styles.input}
                    onChange={onChange}
                    id={value}
                    value={meta.get(value) || ''}
                    {...attrs}
                />
            </div>
        );
    }
}
