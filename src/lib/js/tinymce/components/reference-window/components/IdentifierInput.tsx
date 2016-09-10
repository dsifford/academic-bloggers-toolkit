import * as React from 'react';
import { observer } from 'mobx-react';

interface Props {
    identifierList: string;
    change: Function;
}

@observer
export class IdentifierInput extends React.Component<Props, {}> {

    input: HTMLInputElement;
    labels = (top as any).ABT_i18n.tinymce.referenceWindow.identifierInput;

    componentDidMount() {
        this.input.focus();
    }

    focusInputField = (c) => {
        this.input = c;
    }

    handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.props.change((e.target as HTMLInputElement).value);
    }

    render() {
        return(
            <div className="row">
                <div>
                    <label htmlFor="identifierList" children={this.labels.label} />
                </div>
                <div className="flex">
                    <input
                        type="text"
                        id="identifierList"
                        onChange={this.handleChange}
                        ref={this.focusInputField}
                        required={true}
                        value={this.props.identifierList}
                    />
                </div>
            </div>
        );
    }
}
