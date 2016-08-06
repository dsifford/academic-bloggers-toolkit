import * as React from 'react';
import { fieldMappings } from '../../../utils/Constants';
import { referenceWindowEvents as LocalEvents } from '../../../utils/Constants';

interface MetaFieldProps {
    citationType: CSL.CitationType;
    meta: CSL.Data;
    eventHandler: Function;
}

export class MetaFields extends React.Component<MetaFieldProps, {}> {

    public fieldMappings: ABT.FieldMappings = fieldMappings;

    constructor(props) {
        super(props);
    }

    handleChange(e: InputEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.META_FIELD_CHANGE, {
                detail: {
                    field: e.target.id,
                    value: e.target.value,
                },
            })
        );
    }

    render() {
        let title = this.fieldMappings[this.props.citationType].title;
        let fields = this.fieldMappings[this.props.citationType].fields;
        return (
            <div>
                <div className="row">
                    <strong>{title} Information</strong>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {fields.map((field: ABT.Field, i: number) =>
                        <div
                            key={`${title}-meta-${i}`}
                            id={`${title}-meta-${i}`}
                            style={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            <div style={{flex: 1, padding: '0 5px'}}>
                                <label
                                    htmlFor={field.value}
                                    style={{padding: '5px'}}
                                    children={field.label}
                                />
                            </div>
                            <div style={{flex: 2, padding: '0 5px'}}>
                                <input
                                    type="text"
                                    style={{width: '100%'}}
                                    id={field.value}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.props.meta[field.value]}
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
