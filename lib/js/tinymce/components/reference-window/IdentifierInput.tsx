import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { referenceWindowEvents } from '../../../utils/Constants';
const { IDENTIFIER_FIELD_CHANGE } = referenceWindowEvents;

interface IdentifierInputProps {
    identifierList: string;
    eventHandler: Function;
}

export class IdentifierInput extends React.Component<IdentifierInputProps, {}> {

    refs: {
        [key: string]: Element
        identifierField: HTMLInputElement
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        (ReactDOM.findDOMNode(this.refs.identifierField) as HTMLInputElement).focus();
    }

    handleChange(e: InputEvent) {
        this.props.eventHandler(
            new CustomEvent(IDENTIFIER_FIELD_CHANGE, { detail: e.target.value, })
        );
    }

    render() {
        return(
            <div className='row' style={{ display: 'flex', alignItems: 'center', }}>
                <div style={{ padding: '5px', }}>
                    <label
                        htmlFor='identifierList'
                        children='PMID/DOI' />
                </div>
                <input
                    type='text'
                    id='identifierList'
                    style={{ width: '100%', }}
                    onChange={this.handleChange.bind(this)}
                    ref='identifierField'
                    required={true}
                    value={this.props.identifierList} />
            </div>
        );
    }
}
