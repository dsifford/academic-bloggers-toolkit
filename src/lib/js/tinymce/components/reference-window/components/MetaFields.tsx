import * as React from 'react';
import { ObservableMap, action } from 'mobx';
import { observer } from 'mobx-react';

interface MetaFieldProps {
    meta: ObservableMap<string>;
}

@observer
export class MetaFields extends React.Component<MetaFieldProps, {}> {

    fieldmaps: ABT.FieldMappings = ((top as any).ABT_i18n as BackendGlobals.ABT_i18n).fieldmaps;
    title: string;
    fields;

    @action
    updateField = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        this.props.meta.set(target.id, target.value);
    }

    render() {
        const citationType = this.props.meta.get('type');
        this.title = this.fieldmaps[citationType].title;
        this.fields = this.fieldmaps[citationType].fields;
        return (
            <div>
                <div className="row" style={{paddingBottom: 0}}>
                    <div>
                        <span id={`meta-${citationType}`} style={{fontWeight: 400}} children={this.title} />
                    </div>
                </div>
                <div className="row column">
                    {this.fields.map((field: ABT.Field, i: number) =>
                        <Field
                            key={`${this.title}-meta-${i}`}
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
            <div className="row flex">
                <div style={{minWidth: 150}}>
                    <label className="sublabel" htmlFor={field.value} children={field.label}/>
                </div>
                <div className="flex">
                    <input
                        type="text"
                        onChange={change}
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
