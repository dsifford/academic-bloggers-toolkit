import * as React from 'react';
import { ObservableMap } from 'mobx';
import { observer } from 'mobx-react';

interface MetaFieldProps {
    meta: ObservableMap<string>;
}

@observer
export class MetaFields extends React.Component<MetaFieldProps, {}> {

    fieldmaps: ABT.FieldMappings = (top as any).ABT_i18n.fieldmaps;
    title: string;
    fields;

    constructor(props) {
        super(props);
    }

    handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        this.props.meta.set(target.id, target.value);
    }

    render() {
        this.title = this.fieldmaps[this.props.meta.get('type')].title;
        this.fields = this.fieldmaps[this.props.meta.get('type')].fields;
        return (
            <div>
                <div className="row" style={{paddingBottom: 0}}>
                    <div>
                        <span style={{fontWeight: 400}} children={this.title} />
                    </div>
                </div>
                <div className="row column">
                    {this.fields.map((field: ABT.Field, i: number) =>
                        <div
                            key={`${this.title}-meta-${i}`}
                            className="row flex"
                        >
                            <div style={{minWidth: 150}}>
                                <label htmlFor={field.value} children={field.label}/>
                            </div>
                            <div className="flex">
                                <input
                                    type="text"
                                    onChange={this.handleChange}
                                    id={field.value}
                                    value={this.props.meta.get(field.value) || ''}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    pattern={field.pattern}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
