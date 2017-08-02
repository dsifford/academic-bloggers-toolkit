import { action, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface MetaFieldProps {
    meta: ObservableMap<string>;
}

@observer
export class MetaFields extends React.Component<MetaFieldProps, {}> {
    static readonly fieldmaps = top.ABT_i18n.fieldmaps;

    @action
    updateField = (e: React.FormEvent<HTMLInputElement>) => {
        this.props.meta.set(e.currentTarget.id, e.currentTarget.value);
    };

    render() {
        const citationType = this.props.meta.get('type')! as keyof ABT.FieldMappings;
        const title = MetaFields.fieldmaps[citationType].title;
        const fields = MetaFields.fieldmaps[citationType].fields;
        return (
            <div>
                <h2>
                    {title}
                </h2>
                <div className="table">
                    {fields.map((field: ABT.Field, i: number) =>
                        <Field
                            key={`${title}-meta-${i}`}
                            change={this.updateField}
                            field={field}
                            meta={this.props.meta}
                        />,
                    )}
                </div>
                <style jsx>{`
                    .table {
                        display: table;
                        padding: 10px;
                        width: 100%;
                    }
                    h2 {
                        font-size: 16px !important;
                    }
                `}</style>
            </div>
        );
    }
}

interface FieldProps {
    change: any;
    field: ABT.Field;
    meta: ObservableMap<string>;
}

@observer
class Field extends React.PureComponent<FieldProps, {}> {
    render() {
        const { change, field, meta } = this.props;
        return (
            <div className="table__row">
                <label htmlFor={field.value} children={field.label} />
                <input
                    type="text"
                    onChange={change}
                    id={field.value}
                    value={meta.get(field.value) || ''}
                    required={field.required}
                    placeholder={field.placeholder}
                    pattern={field.pattern}
                />
                <style jsx>{`
                    div {
                        display: table-row;
                        width: 100%;
                    }
                    label {
                        display: table-cell;
                        width: auto;
                    }
                    input {
                        width: 95%;
                        height: 28px;
                        line-height: 28px;
                        font-size: 14px;
                    }
                `}</style>
            </div>
        );
    }
}
