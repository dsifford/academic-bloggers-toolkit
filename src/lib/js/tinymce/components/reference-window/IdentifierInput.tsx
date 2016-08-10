import * as React from 'react';
import { referenceWindowEvents } from '../../../utils/Constants';
const { IDENTIFIER_FIELD_CHANGE } = referenceWindowEvents;

interface Props {
    identifierList: string;
    eventHandler: Function;
}

export class IdentifierInput extends React.Component<Props, {}> {

    input: HTMLInputElement;
    labels = (top as any).ABT_i18n.tinymce.referenceWindow.identifierInput;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.input.focus();
    }

    focusInputField = (c) => {
        this.input = c;
    }

    handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.props.eventHandler(
            new CustomEvent(IDENTIFIER_FIELD_CHANGE, { detail: e.target.value })
        );
    }

    render() {
        return(
            <div className="row" style={{alignItems: 'center', display: 'flex'}}>
                <div style={{padding: '5px'}}>
                    <label htmlFor="identifierList" children={this.labels.label} />
                </div>
                <input
                    type="text"
                    id="identifierList"
                    style={{ width: '100%' }}
                    onChange={this.handleChange}
                    ref={this.focusInputField}
                    required={true}
                    value={this.props.identifierList}
                />
            </div>
        );
    }
}
