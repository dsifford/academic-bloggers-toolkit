import * as React from 'react';
import { Modal } from '../../../utils/Modal';
import { RISParser } from '../../../utils/RISParser';
import { generateID } from '../../../utils/HelperFunctions';

interface State {
    readonly filename: string;
    readonly payload: [string, CSL.Data][];
}

interface Props {
    wm: TinyMCE.WindowManager;
}

export class ImportWindow extends React.Component<Props, State> {

    labels = (top as any).ABT_i18n.tinymce.importWindow;
    modal: Modal = new Modal(this.labels.title);
    wm: TinyMCE.WindowManager = this.props.wm;

    constructor(props) {
        super(props);
        this.state = {
            filename: '',
            payload: [],
        };
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    componentDidMount() {
        this.modal.resize();
    }

    handleFileUpload(e: React.FormEvent<HTMLInputElement>) {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];
        const filename = e.target.files[0].name;

        reader.addEventListener('load', this.parseFile);

        reader.readAsText(file);
        this.setState(Object.assign({}, this.state, { filename }));
    }

    parseFile = (upload) => {
        const parser = new RISParser(upload.target.result);

        let payload = parser.parse();
        if (payload.length === 0) {
            this.wm.alert(this.labels.filetypeError);
            return;
        }

        payload = payload.map(ref => {
            const id = generateID();
            ref.id = id;
            return [id, ref];
        });

        const leftovers = parser.unsupportedRefs;

        if (leftovers.length > 0) {
            this.wm.alert(`${this.labels.leftovers}: ${leftovers.join(', ')}`);
        }

        this.setState(Object.assign({}, this.state, { payload }));
    }

    handleSubmit = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.wm.setParams({data: this.state});
        this.wm.close();
    }

    render() {
        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{alignItems: 'center', display: 'flex', flex: 1}}>
                        <label className="uploadLabel">
                            <input
                                type="file"
                                id="uploadField"
                                required={true}
                                onChange={this.handleFileUpload}
                                accept="application/xresearch-info-systems"
                            />
                            <span children={this.labels.upload} />
                        </label>
                        <div
                            style={{
                                background: '#f1f1f1',
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                color: '#444',
                                flex: 1,
                                margin: '0 10px',
                                minHeight: 20,
                                padding: 3,
                            }}
                            children={this.state.filename}
                        />
                    </div>
                    <div>
                        <input
                            type="button"
                            className="submit-btn"
                            id="submitbtn"
                            value={this.labels.import}
                            disabled={this.state.payload.length === 0}
                            onClick={this.handleSubmit}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
