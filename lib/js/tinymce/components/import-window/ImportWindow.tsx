import * as React from 'react';
import { Modal } from '../../../utils/Modal';
import { RISParser } from '../../../utils/RISParser';
import { generateID } from '../../../utils/HelperFunctions';

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
}

interface FileReaderEventTarget extends EventTarget {
    result: string;
}

interface State {
    readonly filename: string;
    readonly payload: [string, CSL.Data][];
}

interface Props {
    wm: TinyMCE.WindowManager;
}

export class ImportWindow extends React.Component<Props, State> {

    private modal: Modal = new Modal('Import References from RIS File');
    private wm: TinyMCE.WindowManager = this.props.wm;

    constructor(props) {
        super(props);
        this.state = {
            filename: '',
            payload: [],
        };
    }

    componentDidMount() {
        this.modal.resize();
    }

    handleFileUpload(e: InputEvent) {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];
        const filename = e.target.files[0].name;

        reader.onload = (upload: FileReaderEvent) => {
            const parser = new RISParser(upload.target.result);

            let payload = parser.parse();
            if (payload.length === 0) {
                this.wm.alert(`The file could not be processed. Are you sure it's a .RIS (Refman) file?`);
                return;
            }

            payload = payload.map(ref => {
                const id = generateID();
                ref.id = id;
                return [id, ref];
            });

            const leftovers = parser.unsupportedRefs;

            if (leftovers.length > 0) {
                this.wm.alert(`The following references were unable to be processed: ${leftovers.join(', ')}`);
            }

            this.setState(Object.assign({}, this.state, { payload, filename }));
        };

        reader.readAsText(file);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.wm.setParams({ data: this.state });
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
                                onChange={this.handleFileUpload.bind(this)}
                                accept="application/xresearch-info-systems"
                            />
                            <span children={`Choose File`} />
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
                            value="Import"
                            disabled={this.state.payload.length === 0}
                            onClick={this.handleSubmit.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
