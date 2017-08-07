import { action, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { generateID } from 'utils/helpers/';
import { RISParser, TeXParser } from 'utils/parsers/';
import { colors } from 'utils/styles';

import Callout from 'components/callout';

import { DialogProps } from 'dialogs/';

@observer
export default class ImportDialog extends React.Component<DialogProps> {
    static readonly labels = top.ABT_i18n.dialogs.import;
    static readonly errors = top.ABT_i18n.errors;

    /** The error message to be displayed in the callout, if applicable */
    errorMessage = observable('');

    /** Array of `CSL.Data` obtained from the file import */
    payload = observable<CSL.Data>([]);

    /** Controls the state of the file input */
    file = {
        name: observable(''),
        value: observable(''),
    };

    @action
    setErrorMessage = (msg: any = '') => {
        this.errorMessage.set(typeof msg === 'string' ? msg : '');
    };

    @action
    setFile = ({ name = '', value = '' } = {}) => {
        this.file.name.set(name);
        this.file.value.set(value);
    };

    @action
    setPayload = (payload: CSL.Data[]) => {
        this.payload.replace(payload);
    };

    @action
    handleFileUpload = (e: React.FormEvent<HTMLInputElement>) => {
        return new Promise(resolve => {
            const reader = new FileReader();
            const file = e.currentTarget.files![0];
            const fileExtension = file.name.toLowerCase().match(/\.(\w+$)/)
                ? file.name.toLowerCase().match(/\.(\w+$)/)![1]
                : '';
            reader.addEventListener('load', () => {
                this.parseFile(reader, fileExtension);
                resolve();
            });
            reader.readAsText(file);
            this.setFile({ name: file.name, value: e.currentTarget.value });
        });
    };

    parseFile = (reader: FileReader, fileExtension: string) => {
        let parser: RISParser | TeXParser;
        try {
            switch (fileExtension) {
                case 'ris':
                    parser = new RISParser(reader.result);
                    break;
                case 'bib':
                case 'bibtex':
                    parser = new TeXParser(reader.result);
                    break;
                default:
                    this.setErrorMessage(ImportDialog.errors.fileExtensionError);
                    this.setFile();
                    return;
            }
        } catch (e) {
            this.setErrorMessage(ImportDialog.errors.filetypeError);
            this.setFile();
            return;
        }
        const parsed = parser.parse();

        if (parsed.length === 0) {
            this.setErrorMessage(ImportDialog.errors.filetypeError);
            this.setFile();
            return;
        }

        const payload = parsed.map(ref => ({ ...ref, id: generateID() }));
        const leftovers = parser.unsupportedRefs;

        if (leftovers.length > 0) {
            this.setErrorMessage(`${ImportDialog.errors.risLeftovers}: ${leftovers.join(', ')}`);
            this.setFile();
        }

        this.setPayload(payload);
    };

    handleSubmit = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.props.onSubmit(toJS(this.payload));
    };

    render() {
        return (
            <div>
                <div className="import-dialog">
                    <label>
                        <input
                            type="file"
                            id="uploadField"
                            value={this.file.value.get()}
                            required={true}
                            onChange={this.handleFileUpload}
                            accept=".ris,.bib,.bibtex,application/xresearch-info-systems,application/x-bibtex"
                        />
                        <span
                            className="abt-btn abt-btn_flat upload-btn"
                            children={ImportDialog.labels.upload}
                        />
                    </label>
                    <div className="well" children={this.file.name.get()} />
                    <input
                        type="button"
                        className={
                            this.payload.length === 0
                                ? 'abt-btn abt-btn_submit abt-btn_disabled'
                                : 'abt-btn abt-btn_submit'
                        }
                        value={ImportDialog.labels.importBtn}
                        onClick={this.handleSubmit}
                    />
                </div>
                <Callout title={`${ImportDialog.errors.prefix}!`} onDismiss={this.setErrorMessage}>
                    {this.errorMessage.get()}
                </Callout>
                <style jsx>{`
                    .import-dialog {
                        display: flex;
                        align-items: center;
                        padding: 0 10px 10px;
                    }
                    input[type='file'] {
                        position: fixed;
                        top: -1000px;
                    }
                    .upload-btn {
                        display: inline-block;
                        line-height: 36px;
                    }
                    .well {
                        background: ${colors.light_gray};
                        border: 1px solid ${colors.border};
                        border-radius: 2px;
                        flex: auto;
                        font-size: 16px;
                        line-height: 25px;
                        margin: 0 15px 0 5px;
                        min-height: 20px;
                        padding: 5px;
                    }
                `}</style>
            </div>
        );
    }
}
