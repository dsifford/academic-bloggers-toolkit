import { action } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import ManualDataStore from '_legacy/stores/data/manual-data-store';
import Field from './field';

import styles from './meta-fields.scss';

interface Props {
    meta: ManualDataStore;
}

@observer
export default class MetaFields extends React.Component<Props> {
    static readonly fieldmaps = top.ABT.i18n.fieldmaps;

    @action
    updateField = (e: React.FormEvent<HTMLInputElement>): void => {
        const key = e.currentTarget.dataset.field as
            | CSL.StandardFieldKey
            | CSL.DateFieldKey
            | undefined;
        if (!key) {
            throw new ReferenceError(
                'ID of field must be set to the field key.',
            );
        }
        this.props.meta.updateField(key, e.currentTarget.value);
    };

    render(): JSX.Element {
        const citationType = this.props.meta.citationType;
        const title = MetaFields.fieldmaps[citationType].title;
        const fields = MetaFields.fieldmaps[citationType].fields;
        let key = Date.now();
        return (
            <>
                <h2 className={styles.heading}>{title}</h2>
                <div className={styles.table}>
                    {fields.map((field: any) => (
                        <Field
                            key={key++}
                            onChange={this.updateField}
                            field={field}
                            meta={this.props.meta}
                        />
                    ))}
                </div>
            </>
        );
    }
}
