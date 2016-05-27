import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Modal } from '../../../utils/Modal';
import { RISParser } from '../../../utils/RISParser';
import { generateID } from '../../../utils/HelperFunctions';

interface DOMEvent extends React.UIEvent {
    target: HTMLInputElement;
}

interface State {
    filename: string;
    payload: CSL.Data[];
    links: boolean;
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
            links: true,
        };
    }

    componentDidMount() {
        this.modal.resize();
    }

    componentDidUpdate() {
        this.modal.resize();
    }

    handleFileUpload(e: DOMEvent) {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];
        const filename = e.target.files[0].name;

        reader.onload = (upload: any) => {
            const parser = new RISParser(upload.target.result);

            const payload: CSL.Data[] = parser.parse();
            if (payload.length === 0) {
                this.wm.alert(`The file could not be processed. Are you sure it's a .RIS (Refman) file?`);
                return;
            }

            payload.forEach((ref, i) => {
                payload[i].id = generateID();
            });

            const leftovers = parser.unsupportedRefs;

            if (leftovers.length > 0) {
                this.wm.alert(`The following references were unable to be processed: ${leftovers.join(', ')}`);
            }

            this.setState(Object.assign({}, this.state, { payload, filename }));
        };

        reader.readAsText(file);
    }

    handleChange(e: DOMEvent) {
        this.setState(
            Object.assign({}, this.state, {
                format: e.target.value,
            })
        );
    }

    handleClick(e: DOMEvent) {
        this.setState(
            Object.assign({}, this.state, {
                links: !this.state.links,
            })
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        this.wm.setParams({ data: this.state });
        this.wm.close();
    }


    render() {
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <div>
                        <label
                            htmlFor='includeLink'
                            style={{ whiteSpace: 'nowrap', margin: '0 10px', }}
                            children='Links'/>
                        <input
                            type='checkbox'
                            id='includeLink'
                            checked={this.state.links}
                            onChange={this.handleClick.bind(this)} />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, }}>
                        <label className='uploadLabel'>
                            <input
                                type='file'
                                id='uploadField'
                                required={true}
                                onChange={this.handleFileUpload.bind(this)}
                                accept='application/xresearch-info-systems'/>
                            <span children={`Choose File`} />
                        </label>
                        <div
                            style={{
                                margin: '0 10px',
                                background: '#f1f1f1',
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                padding: 3,
                                color: '#444',
                                flex: 1,
                                minHeight: 20,
                            }}
                            children={this.state.filename} />
                    </div>
                    <div>
                        <input
                            type='button'
                            className='submit-btn'
                            id='submitbtn'
                            value='Import'
                            disabled={this.state.payload.length === 0}
                            onClick={this.handleSubmit.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
}
