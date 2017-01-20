import * as React from 'react';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from '../../../utils/DevTools';

import { Modal } from '../../../utils/Modal';
import { RISParser, TeXParser } from '../../../utils/parsers/';
import { generateID } from '../../../utils/helpers/';

const DevTool = DevTools();

interface Props {
    wm: TinyMCE.WindowManager;
}

@observer
export class ImportWindow extends React.Component<Props, {}> {

    labels = top.ABT_i18n.tinymce.importWindow;
    errors = top.ABT_i18n.errors;
    modal: Modal = new Modal(this.labels.title);
    wm: TinyMCE.WindowManager = this.props.wm;

    @observable
    filename = '';

    @observable
    payload = observable([]);

    @action
    setFilename = (filename: string) => this.filename = filename;

    @action
    setPayload = (payload: CSL.Data[]) => this.payload.replace(payload);

    handleFileUpload = (e: React.FormEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        const file = e.currentTarget.files[0];
        const fileExtension = file.name.toLowerCase().match(/\.(\w+$)/)
            ? file.name.toLowerCase().match(/\.(\w+$)/)[1]
            : '';
        reader.addEventListener('load', () => {
            this.parseFile(reader, fileExtension);
        });
        reader.readAsText(file);
        this.setFilename(file.name);
    }

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
                    this.wm.alert(`${this.errors.prefix}: ${this.errors.fileExtensionError}`);
                    this.setFilename('');
                    return;
            }
        } catch (e) {
            this.wm.alert(`${this.errors.prefix}: ${this.errors.filetypeError}`);
            this.setFilename('');
            return;
        }
        const parsed = parser.parse();

        if (parsed.length === 0) {
            this.wm.alert(`${this.errors.prefix}: ${this.errors.filetypeError}`);
            this.setFilename('');
            return;
        }

        const payload = parsed.map(ref => {
            const id = generateID();
            ref.id = id;
            return ref;
        });

        const leftovers = parser.unsupportedRefs;
        if (leftovers.length > 0) {
            this.wm.alert(`${this.errors.prefix}: ${this.errors.risLeftovers}: ${leftovers.join(', ')}`);
        }

        this.setPayload(payload);
    }

    handleSubmit = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.wm.setParams({data: toJS(this.payload)});
        this.wm.close();
    }

    componentDidMount() {
        this.modal.resize();
    }

    render() {
        return (
            <div className="row" style={{padding: '5px 0'}}>
                <DevTool />
                <div>
                    <label className="uploadLabel">
                        <input
                            type="file"
                            className="abt-btn abt-btn_flat"
                            id="uploadField"
                            required={true}
                            onChange={this.handleFileUpload}
                            accept="application/xresearch-info-systems,application/x-bibtex"
                        />
                        <span children={this.labels.upload} />
                    </label>
                </div>
                <div className="flex">
                    <div className="well" children={this.filename} />
                    <div style={{fontSize: 10, padding: '5px 0 0 10px'}}>
                        <span style={{fontWeight: 500}}>Supported filetypes: </span>
                        <code>RIS</code>,&nbsp;
                        <code>BibTeX</code>
                    </div>
                </div>
                <div>
                    <input
                        type="button"
                        className={
                            this.payload.length === 0
                            ? 'abt-btn abt-btn_submit abt-btn_disabled'
                            : 'abt-btn abt-btn_submit'
                        }
                        id="submitbtn"
                        value={this.labels.importBtn}
                        onClick={this.handleSubmit}
                    />
                </div>
            </div>
        );
    }
}
