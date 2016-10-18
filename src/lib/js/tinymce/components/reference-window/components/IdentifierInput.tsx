import * as React from 'react';
import { observer } from 'mobx-react';

interface Props {
    identifierList: string;
    change: Function;
}

@observer
export class IdentifierInput extends React.PureComponent<Props, {}> {

    labels = top.ABT_i18n.tinymce.referenceWindow.identifierInput;

    focusInputField = (c) => {
        if (c) c.focus();
    }

    handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.props.change(e.currentTarget.value);
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
