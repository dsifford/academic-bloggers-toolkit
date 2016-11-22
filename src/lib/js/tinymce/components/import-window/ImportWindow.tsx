import * as React from 'react';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from '../../../utils/DevTools';

import { Modal } from '../../../utils/Modal';
import { RISParser } from '../../../utils/RISParser';
import { TeXParser } from '../../../utils/TeXParser';
import { generateID } from '../../../utils/HelperFunctions';

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
        const filetype = file.name.toLowerCase().match(/\.(\w+$)/)[1] || '';
        reader.addEventListener('load', () => {
            this.parseFile(reader, filetype);
        });
        reader.readAsText(file);
        this.setFilename(file.name);
    }

    parseFile = (reader: FileReader, filetype: string) => {
        let parser;
        switch (filetype) {
            case 'ris':
                parser = new RISParser(reader.result);
                break;
            case 'bib':
                parser = new TeXParser(reader.result);
                break;
            default:
                this.wm.alert(`${this.errors.prefix}: ${this.errors.filetypeError}`);
                return;
        }

        const parsed = parser.parse();

        if (parsed.length === 0) {
            this.wm.alert(`${this.errors.prefix}: ${this.errors.filetypeError}`);
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
            <div className="row">
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
                <div className="well flex" children={this.filename} />
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
