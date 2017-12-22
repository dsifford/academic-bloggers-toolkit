import { action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import ManualDataStore from 'stores/data/manual-data-store';
import Field from './field';

interface Props {
    meta: ManualDataStore;
}

@observer
export default class MetaFields extends React.Component<Props> {
    static readonly fieldmaps = top.ABT.i18n.fieldmaps;

    @action
    updateField = (e: React.FormEvent<HTMLInputElement>): void => {
        const key = e.currentTarget.id as CSL.StandardFieldKey | CSL.DateFieldKey | undefined;
        if (!key) {
            throw new ReferenceError('ID of field must be set to the field key.');
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
                <h2 style={{ fontSize: 16 }}>{title}</h2>
                <div
                    style={{
                        display: 'table',
                        padding: 10,
                        width: '100%',
                    }}
                >
                    {fields.map(field => (
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
