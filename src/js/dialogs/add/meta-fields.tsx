import { action, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface MetaFieldProps {
    /** Observable map of `ABT.FieldMappings` */
    meta: ObservableMap<string>;
}

@observer
export default class MetaFields extends React.Component<MetaFieldProps, {}> {
    static readonly fieldmaps = top.ABT.i18n.fieldmaps;

    @action
    updateField = (e: React.FormEvent<HTMLInputElement>): void => {
        this.props.meta.set(e.currentTarget.id, e.currentTarget.value);
    };

    render(): JSX.Element {
        const citationType = this.props.meta.get('type')! as keyof ABT.FieldMappings;
        const title = MetaFields.fieldmaps[citationType].title;
        const fields = MetaFields.fieldmaps[citationType].fields;
        return (
            <div>
                <h2>{title}</h2>
                <div className="table">
                    {fields.map((field: ABT.Field, i: number) => (
                        <Field
                            key={`${title}-meta-${i}`}
                            onChange={this.updateField}
                            field={field}
                            meta={this.props.meta}
                        />
                    ))}
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
    /** Field descriptor */
    field: ABT.Field;
    /** Observable map of `ABT.FieldMappings` */
    meta: ObservableMap<string>;
    /** onChange handler for input element */
    onChange(e: React.FormEvent<HTMLInputElement>): void;
}

@observer
class Field extends React.Component<FieldProps, {}> {
    render(): JSX.Element {
        const { onChange, field, meta } = this.props;
        return (
            <div className="table__row">
                <label htmlFor={field.value} children={field.label} />
                <input
                    type="text"
                    onChange={onChange}
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
