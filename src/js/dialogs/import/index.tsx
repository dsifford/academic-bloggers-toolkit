import { parse as parseBibtex } from 'astrocite-bibtex';
import { parse as parseRis } from 'astrocite-ris';
import { action, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import ActionBar from 'components/action-bar';
import Button from 'components/button';
import Callout from 'components/callout';
import FileInput from 'components/file-input';

import { DialogProps } from 'dialogs';

@observer
export default class ImportDialog extends React.Component<DialogProps> {
    static readonly errors = top.ABT.i18n.errors;
    static readonly labels = top.ABT.i18n.dialogs.import;

    /**
     * The error message to be displayed in the callout, if applicable
     */
    @observable errorMessage = '';

    /**
     * Controls the state of the file input
     */
    @observable
    file = {
        name: '',
        value: '',
    };

    inputField: HTMLInputElement;

    /**
     * Array of `CSL.Data` obtained from the file import
     */
    payload = observable<CSL.Data>([]);

    @action
    handleFileUpload = async (
        e: React.FormEvent<HTMLInputElement>,
    ): Promise<void> => {
        return new Promise<void>((resolve): void => {
            const reader = new FileReader();
            if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
                return resolve();
            }
            const file = e.currentTarget.files[0];
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
        this.errorMessage = typeof msg === 'string' ? msg : '';
    };

    @action
    setFile = ({ name = '', value = '' } = {}): void => {
        this.file.name = name;
        this.file.value = value;
    };

    @action
    setPayload = (payload: CSL.Data[]): void => {
        this.payload.replace(payload);
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
                    throw new Error('Invalid FileType');
            }
        } catch (e) {
            this.setErrorMessage(ImportDialog.errors.filetype_error);
            this.setFile();
            this.setPayload([]);
            return;
        }

        if (payload.length === 0) {
            this.setErrorMessage(ImportDialog.errors.filetype_error);
            this.setFile();
        }

        this.setPayload(payload);
    };

    render(): JSX.Element {
        return (
            <>
                <div style={{ padding: 10 }}>
                    <Callout
                        title={`${ImportDialog.errors.prefix}`}
                        onDismiss={this.setErrorMessage}
                    >
                        {this.errorMessage}
                    </Callout>
                    <FileInput
                        fill
                        large
                        text={
                            this.file.name
                                ? this.file.name
                                : `${ImportDialog.labels.upload}...`
                        }
                        inputProps={{
                            required: true,
                            onChange: this.handleFileUpload,
                            accept:
                                '.ris,.bib,.bibtex,application/xresearch-info-systems,application/x-bibtex',
                        }}
                    />
                </div>
                <ActionBar align="right">
                    <Button
                        primary
                        focusable
                        disabled={this.payload.length === 0}
                        label={ImportDialog.labels.import_button}
                        onClick={this.handleSubmit}
                    >
                        {ImportDialog.labels.import_button}
                    </Button>
                </ActionBar>
            </>
        );
    }
}
