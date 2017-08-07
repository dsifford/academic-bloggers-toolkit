import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
    /** Controls the value of the input field */
    identifierList: IObservableValue<string>;
    /** Handler to capture reference to input field */
    fieldRef(el: HTMLInputElement | null): void;
    /** onChange handler for input field */
    onChange(e: React.FormEvent<HTMLInputElement>): void;
}

@observer
export default class IdentifierInput extends React.PureComponent<Props> {
    static readonly labels = top.ABT_i18n.dialogs.add.identifierInput;

    render() {
        return (
            <div>
                <label htmlFor="identifierList" children={IdentifierInput.labels.label} />
                <input
                    type="text"
                    id="identifierList"
                    onChange={this.props.onChange}
                    ref={this.props.fieldRef}
                    required={true}
                    value={this.props.identifierList.get()}
                />
                <style jsx>{`
                    div {
                        padding: 10px;
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
