import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
    identifierList: IObservableValue<string>;
    onChange(e: React.FormEvent<HTMLInputElement>): void;
}

@observer
export class IdentifierInput extends React.PureComponent<Props> {
    labels = top.ABT_i18n.tinymce.referenceWindow.identifierInput;

    focusInputField = (el: HTMLInputElement | null) => (el ? el.focus() : void 0);

    render() {
        return (
            <div>
                <label htmlFor="identifierList" children={this.labels.label} />
                <input
                    type="text"
                    id="identifierList"
                    onChange={this.props.onChange}
                    ref={this.focusInputField}
                    required={true}
                    value={this.props.identifierList.get()}
                />
                <style jsx>{`
                    div {
                        padding: 0 10px 10px;
                        display: flex;
                        align-items: center;
                    }
                    label {
                        margin-right: 10px;
                    }
                    input {
                        flex: auto;
                        height: 35px;
                        font-size: 16px;
                    }
                `}</style>
            </div>
        );
    }
}
