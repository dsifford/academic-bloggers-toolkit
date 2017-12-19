import { parse as parseBibtex } from 'astrocite-bibtex';
import { parse as parseRis } from 'astrocite-ris';
import { action, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Button from 'components/button';
import Callout from 'components/callout';
import Well from 'components/well';

import { DialogProps } from 'dialogs';

@observer
export default class ImportDialog extends React.Component<DialogProps> {
    static readonly errors = top.ABT.i18n.errors;
    static readonly labels = top.ABT.i18n.dialogs.import;

    /** The error message to be displayed in the callout, if applicable */
    errorMessage = observable('');

    /** Controls the state of the file input */
    file = {
        name: observable(''),
        value: observable(''),
    };

    inputField: HTMLInputElement;

    /** Array of `CSL.Data` obtained from the file import */
    payload = observable<CSL.Data>([]);

    @action
    handleFileUpload = async (e: React.FormEvent<HTMLInputElement>): Promise<void> => {
        return new Promise<void>((resolve): void => {
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

    @action
    setErrorMessage = (msg: any = ''): void => {
        this.errorMessage.set(typeof msg === 'string' ? msg : '');
    };

    @action
    setFile = ({ name = '', value = '' } = {}): void => {
        this.file.name.set(name);
        this.file.value.set(value);
    };

    @action
    setPayload = (payload: CSL.Data[]): void => {
        this.payload.replace(payload);
    };

    bindRefs = (c: HTMLInputElement): void => {
        this.inputField = c;
    };

    handleClick = (): void => {
        this.inputField.click();
    };

    handleSubmit = (e: React.MouseEvent<HTMLInputElement>): void => {
        e.preventDefault();
        this.props.onSubmit(toJS(this.payload));
    };

    parseFile = (reader: FileReader, fileExtension: string): void => {
        let payload: CSL.Data[];
        try {
            switch (fileExtension) {
                case 'ris':
                    payload = parseRis(reader.result);
                    break;
                case 'bib':
                case 'bibtex':
                    payload = parseBibtex(reader.result);
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

        if (payload.length === 0) {
            this.setErrorMessage(ImportDialog.errors.filetypeError);
            this.setFile();
            return;
        }

        this.setPayload(payload);
    };

    render(): JSX.Element {
        return (
            <div style={{ padding: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        style={{ display: 'none' }}
                        required
                        aria-labelledby="upload-file-btn"
                        ref={this.bindRefs}
                        type="file"
                        id="uploadField"
                        value={this.file.value.get()}
                        onChange={this.handleFileUpload}
                        accept=".ris,.bib,.bibtex,application/xresearch-info-systems,application/x-bibtex"
                    />
                    <Button
                        flat
                        focusable
                        id="upload-file-btn"
                        aria-controls="uploadField"
                        label={ImportDialog.labels.upload}
                        onClick={this.handleClick}
                    />
                    <Well>{this.file.name.get()}</Well>
                    <Button
                        primary
                        focusable
                        disabled={this.payload.length === 0}
                        label={ImportDialog.labels.importBtn}
                        onClick={this.handleSubmit}
                    />
                </div>
                <Callout
                    title={`${ImportDialog.errors.prefix}!`}
                    onDismiss={this.setErrorMessage}
                    style={{ margin: '10px 0 0 0' }}
                >
                    {this.errorMessage.get()}
                </Callout>
            </div>
        );
    }
}
