import * as React from 'react';
import { referenceWindowEvents as LocalEvents } from '../../../utils/Constants';

import { People } from './People';
import { MetaFields } from './MetaFields';

interface ManualEntryProps {
    manualData: CSL.Data;
    people: CSL.TypedPerson[];
    eventHandler: Function;
}

export class ManualEntryContainer extends React.Component<ManualEntryProps, {}> {

    consumeChildEvents = (e: CustomEvent) => {
        this.props.eventHandler(e);
    }

    typeChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.CHANGE_CITATION_TYPE, {
                detail: (e.target as HTMLInputElement).value,
            })
        );
    }

    render() {
        return (
            <div>
                <ManualSelection
                    value={this.props.manualData.type}
                    onChange={this.typeChange}
                />
                <People
                    people={this.props.people}
                    eventHandler={this.consumeChildEvents}
                    citationType={this.props.manualData.type}
                />
                <MetaFields
                    citationType={this.props.manualData.type}
                    meta={this.props.manualData}
                    eventHandler={this.consumeChildEvents}
                />
            </div>
        );
    }
}

export const ManualSelection = ({
    value,
    onChange,
}) => {
    const commonStyle = {padding: '5px'};
    const citationTypes = (top as any).ABT_i18n.citationTypes as ABT.CitationTypes;
    const label = (top as any).ABT_i18n.tinymce.referenceWindow.manualEntryContainer.type;
    return (
        <div style={{alignItems: 'center', display: 'flex'}}>
            <div style={commonStyle}>
                <label
                    htmlFor="type"
                    style={{whiteSpace: 'nowrap'}}
                    children={label}
                />
            </div>
            <div style={Object.assign({}, commonStyle, {flex: 1})}>
                <select
                    id="type"
                    style={{ width: '100%' }}
                    onChange={onChange}
                    value={value}
                >
                    {
                        citationTypes.map((item, i) =>
                            item.inUse ?
                            <option
                                key={i}
                                value={item.value}
                                children={item.label}
                            />
                            : null
                        )
                    }
                </select>
            </div>
        </div>
    );
};
