import * as React from 'react';
import { citationTypeArray, referenceWindowEvents as LocalEvents, } from '../../../utils/Constants';

import { People, } from './People';
import { MetaFields, } from './MetaFields';


interface ManualEntryProps {
    manualData: CSL.Data;
    people: CSL.TypedPerson[];
    eventHandler: Function;
}

export class ManualEntryContainer extends React.Component<ManualEntryProps, {}> {

    constructor(props) {
        super(props);
    }

    consumeChildEvents(e: CustomEvent) {
        this.props.eventHandler(e);
    }

    typeChange(e: InputEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.CHANGE_CITATION_TYPE, {
                detail: e.target.value,
            })
        );
    }

    render() {
        return (
            <div>
                <ManualSelection
                    value={this.props.manualData.type}
                    onChange={this.typeChange.bind(this)} />
                <People
                    people={this.props.people}
                    eventHandler={this.consumeChildEvents.bind(this)}
                    citationType={this.props.manualData.type}/>
                <MetaFields
                    citationType={this.props.manualData.type}
                    meta={this.props.manualData}
                    eventHandler={this.consumeChildEvents.bind(this)} />
            </div>
        );
    }
}

export const ManualSelection = ({
    value,
    onChange,
}) => {
    const commonStyle = { padding: '5px', };
    return (
        <div style={{display: 'flex', alignItems: 'center', }}>
            <div style={commonStyle}>
                <label
                    htmlFor='type'
                    style={{ whiteSpace: 'nowrap', }}
                    children='Select Citation Type' />
            </div>
            <div style={Object.assign({}, commonStyle, { flex: 1, })}>
                <select
                    id='type'
                    style={{ width: '100%', }}
                    onChange={onChange}
                    value={value} >
                    {
                        citationTypeArray.map((item, i) =>
                            item.inUse ?
                            <option
                                key={i}
                                value={item.value}
                                children={item.label} />
                            : null
                        )
                    }
                </select>
            </div>
        </div>
    );
};
