import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './radio-group.scss';

type ItemProps = {
    label: string;
    value: string | number | string[];
} & React.HTMLProps<HTMLInputElement>;

interface Props extends React.HTMLAttributes<HTMLElement> {
    name: string;
    label: string;
    value: string | number | string[];
    items: ItemProps[];
    onChange(e: React.FormEvent<HTMLInputElement>): void;
}

export default class RadioGroup extends React.Component<Props> {
    render(): JSX.Element {
        let key: number = Date.now();
        const { items, label, name, onChange, value, ...props } = this.props;
        const groupId = `${key}-group`;
        return (
            <div
                role="radiogroup"
                className={styles.fieldset}
                aria-labelledby={groupId}
                {...props}
            >
                <label className={styles.legend} id={groupId}>
                    {label}
                </label>
                <div className={styles.itemContainer}>
                    {items.map(({ label: itemLabel, ...item }) => (
                        <label
                            key={key++}
                            className={classNames(styles.item, {
                                [styles.itemDisabled]: item.disabled,
                            })}
                        >
                            <input
                                {...item}
                                type="radio"
                                name={name}
                                onChange={onChange}
                                checked={item.value === value}
                                aria-checked={item.value === value}
                            />
                            <span>{itemLabel}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
    }
}
