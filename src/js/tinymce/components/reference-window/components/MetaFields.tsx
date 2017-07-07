import { action, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface MetaFieldProps {
    meta: ObservableMap<string>;
}

@observer
export class MetaFields extends React.Component<MetaFieldProps, {}> {
    fieldmaps = top.ABT_i18n.fieldmaps;

    @action
    updateField = (e: React.FormEvent<HTMLInputElement>) => {
        this.props.meta.set(e.currentTarget.id, e.currentTarget.value);
    };

    render() {
        const citationType = this.props.meta.get('type')!;
        const title = this.fieldmaps[citationType].title;
        const fields = this.fieldmaps[citationType].fields;
        return (
            <div>
                <div className="row" style={{ paddingBottom: 0 }}>
                    <div>
                        <span
                            id={`meta-${citationType}`}
                            style={{ fontWeight: 400 }}
                            children={title}
                        />
                    </div>
                </div>
                <div className="table">
                    {fields.map((field: ABT.Field, i: number) =>
                        <Field
                            key={`${title}-meta-${i}`}
                            change={this.updateField}
                            field={field}
                            meta={this.props.meta}
                        />
                    )}
                </div>
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
                <div className="table__cell" style={{ paddingRight: 10 }}>
                    <label
                        className="sublabel"
                        htmlFor={field.value}
                        children={field.label}
                    />
                </div>
                <div className="table__cell" style={{ width: '100%' }}>
                    <input
                        type="text"
                        onChange={change}
                        style={{ margin: '1px 0' }}
                        id={field.value}
                        value={meta.get(field.value) || ''}
                        required={field.required}
                        placeholder={field.placeholder}
                        pattern={field.pattern}
                    />
                </div>
            </div>
        );
    }
}
