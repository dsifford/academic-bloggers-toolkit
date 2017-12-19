import { action, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Field from './field';

interface Props {
    /** Observable map of `ABT.FieldMappings` */
    meta: ObservableMap<string>;
}

@observer
export default class MetaFields extends React.Component<Props> {
    static readonly fieldmaps = top.ABT.i18n.fieldmaps;

    @action
    updateField = (e: React.FormEvent<HTMLInputElement>): void => {
        this.props.meta.set(e.currentTarget.id, e.currentTarget.value as keyof ABT.FieldMappings);
    };

    render(): JSX.Element {
        const citationType = this.props.meta.get('type')! as keyof ABT.FieldMappings;
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
