import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import * as styles from './identifier-input.scss';

interface Props {
    /** Controls the value of the input field */
    identifierList: IObservableValue<string>;
    /** Handler to capture reference to input field */
    fieldRef(el: HTMLInputElement | null): void;
    /** onChange handler for input field */
    onChange(e: React.FormEvent<HTMLInputElement>): void;
}

@observer
export default class IdentifierInput extends React.Component<Props> {
    static readonly labels = top.ABT.i18n.dialogs.add.identifierInput;

    render(): JSX.Element {
        return (
            <div className={styles.main}>
                <label
                    className={styles.label}
                    htmlFor="identifierList"
                    children={IdentifierInput.labels.label}
                />
                <input
                    className={styles.input}
                    type="text"
                    id="identifierList"
                    onChange={this.props.onChange}
                    ref={this.props.fieldRef}
                    required={true}
                    value={this.props.identifierList.get()}
                />
            </div>
        );
    }
}
