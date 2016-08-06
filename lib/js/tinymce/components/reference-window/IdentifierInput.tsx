import * as React from 'react';
import { referenceWindowEvents } from '../../../utils/Constants';
const { IDENTIFIER_FIELD_CHANGE } = referenceWindowEvents;

interface IdentifierInputProps {
    identifierList: string;
    eventHandler: Function;
}

export class IdentifierInput extends React.Component<IdentifierInputProps, {}> {

    input;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.input.focus();
    }

    handleChange(e: InputEvent) {
        this.props.eventHandler(
            new CustomEvent(IDENTIFIER_FIELD_CHANGE, { detail: e.target.value })
        );
    }

    render() {
        return(
            <div className="row" style={{alignItems: 'center', display: 'flex'}}>
                <div style={{padding: '5px'}}>
                    <label htmlFor="identifierList" children="PMID/DOI" />
                </div>
                <input
                    type="text"
                    id="identifierList"
                    style={{ width: '100%' }}
                    onChange={this.handleChange.bind(this)}
                    // ref="identifierField"
                    ref={(c) => this.input = c /* tslint:disable-line */}
                    required={true}
                    value={this.props.identifierList}
                />
            </div>
        );
    }
}
