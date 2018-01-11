import { observer } from 'mobx-react';
import * as React from 'react';

import Store from 'stores/ui/add-dialog';
import * as styles from './meta-fields.scss';

interface Props {
    /**
     * Field descriptor
     */
    field: ABT.Field;
    meta: Store['data'];
    /**
     * onChange handler for input element
     */
    onChange(e: React.FormEvent<HTMLInputElement>): void;
}

@observer
export default class Field extends React.Component<Props> {
    render(): JSX.Element {
        const { onChange, field, meta } = this.props;
        const { label, value, ...attrs } = field;
        const id = `field-${value}`;
        return (
            <div className={styles.row}>
                <label className={styles.label} htmlFor={id} children={label} />
                <input
                    type="text"
                    className={styles.input}
                    onChange={onChange}
                    id={id}
                    value={meta.fields[value]}
                    {...attrs}
                />
            </div>
        );
    }
}
