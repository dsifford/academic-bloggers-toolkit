import { action, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { generateID } from 'utils/helpers/';
import { RISParser, TeXParser } from 'utils/parsers/';
import { colors } from 'utils/Styles';

interface Props {
    onSubmit(data: any): void;
}

@observer
export default class extends React.Component<Props, {}> {
    labels = top.ABT_i18n.tinymce.importWindow;
    errors = top.ABT_i18n.errors;

    @observable filename = '';

    payload = observable<CSL.Data>([]);

    @action setFilename = (filename: string) => (this.filename = filename);

    @action setPayload = (payload: CSL.Data[]) => this.payload.replace(payload);

    handleFileUpload = (e: React.FormEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        const file = e.currentTarget.files![0];
        const fileExtension = file.name.toLowerCase().match(/\.(\w+$)/)
            ? file.name.toLowerCase().match(/\.(\w+$)/)![1]
            : '';
        reader.addEventListener('load', () => {
            this.parseFile(reader, fileExtension);
        });
        reader.readAsText(file);
        this.setFilename(file.name);
    };

    parseFile = (reader: FileReader, fileExtension: string) => {
        let parser;
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
                    // this.wm.alert(
                    //     `${this.errors.prefix}: ${this.errors
                    //         .fileExtensionError}`
                    // );
                    this.setFilename('');
                    return;
            }
        } catch (e) {
            // this.wm.alert(
            //     `${this.errors.prefix}: ${this.errors.filetypeError}`
            // );
            this.setFilename('');
            return;
        }
        const parsed = parser.parse();

        if (parsed.length === 0) {
            // this.wm.alert(
            //     `${this.errors.prefix}: ${this.errors.filetypeError}`
            // );
            this.setFilename('');
            return;
        }

        const payload = parsed.map(ref => ({ ...ref, id: generateID() }));
        const leftovers = parser.unsupportedRefs;

        if (leftovers.length > 0) {
            // this.wm.alert(
            //     `${this.errors.prefix}: ${this.errors
            //         .risLeftovers}: ${leftovers.join(', ')}`
            // );
        }

        this.setPayload(payload);
    };

    handleSubmit = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.props.onSubmit(toJS(this.payload));
    };

    render() {
        return (
            <div className="import-dialog">
                <label>
                    <input
                        type="file"
                        id="uploadField"
                        required={true}
                        onChange={this.handleFileUpload}
                        accept="application/xresearch-info-systems,application/x-bibtex"
                    />
                    <span
                        className="abt-btn abt-btn_flat upload-btn"
                        children={this.labels.upload}
                    />
                </label>
                <div className="well" children={this.filename} />
                <input
                    type="button"
                    className={
                        this.payload.length === 0
                            ? 'abt-btn abt-btn_submit abt-btn_disabled'
                            : 'abt-btn abt-btn_submit'
                    }
                    value={this.labels.importBtn}
                    onClick={this.handleSubmit}
                />
                <style jsx>{`
                    .import-dialog {
                        display: flex;
                        align-items: center;
                        padding: 10px;
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
