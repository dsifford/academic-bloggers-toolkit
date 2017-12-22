import { action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Store from 'stores/ui/add-dialog';
import * as styles from './identifier-input.scss';

interface Props {
    store: Store;
    /** Handler to capture reference to input field */
    fieldRef(el: HTMLInputElement | null): void;
}

@observer
export default class IdentifierInput extends React.Component<Props> {
    static readonly labels = top.ABT.i18n.dialogs.add.identifierInput;

    @action
    handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.props.store.identifierList = e.currentTarget.value;
    };

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
                    onChange={this.handleChange}
                    ref={this.props.fieldRef}
                    required={true}
                    value={this.props.store.identifierList}
                />
            </div>
        );
    }
}
