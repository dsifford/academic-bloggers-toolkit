import * as React from 'react';
import { FieldMappings } from '../../utils/Constants';
import { ReferenceWindowEvents as LocalEvents } from '../../utils/Constants';


interface MetaFieldProps {
    citationType: CSL.CitationType
    meta: CSL.Data
    eventHandler: Function
}


export class MetaFields extends React.Component<MetaFieldProps,{}> {

    public fieldMappings: ABT.FieldMappings = FieldMappings;

    constructor(props) {
        super(props);
    }

    handleChange(e: InputEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.META_FIELD_CHANGE, { detail: {
                field: e.target.id,
                value: e.target.value,
            }})
        );
    }

    render() {
        let title = this.fieldMappings[this.props.citationType].title;
        let fields = this.fieldMappings[this.props.citationType].fields;
        return (
            <div>
                <div className='row'>
                    <strong>{title} Information</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', }}>
                    {fields.map((field: ABT.Field, i: number) =>
                        <div
                            key={`${title}-meta-${i}`}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center', }}>
                            <div style={{ padding: '0 5px', flex: 1, }}>
                                <label
                                    htmlFor={field.value}
                                    style={{ padding: '5px', }} children={field.label} />
                            </div>
                            <div style={{ padding: '0 5px', flex: 2, }}>
                                <input
                                    type='text'
                                    style={{width: '100%'}}
                                    id={field.value}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.props.meta[field.value]}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    pattern={field.pattern} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
