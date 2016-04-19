import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Modal from '../utils/Modal';
import { RISParser } from '../utils/RISParser';

// declare var tinyMCE: tinyMCE;

interface DOMEvent extends React.UIEvent {
    target: HTMLInputElement
}

interface Props {

}

interface State {
    filename: string,
    payload: ReferenceObj[],
    format: 'ama'|'apa',
}

class ImportWindow extends React.Component<Props, State> {

    private modal: Modal = new Modal('Import References');

    constructor() {
        super();
        this.state = {
            filename: '',
            payload: [],
            format: 'ama',
        }
    }

    componentDidMount() {
        this.modal.resize();
    }

    componentDidUpdate() {
        this.modal.resize();
    }

    handleFileUpload(e: DOMEvent) {

        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onload = (upload: any) => {
            let parser = new RISParser(upload.target.result);
            let payload = parser.parse();
            let leftovers = parser.unsupportedRefs;
            top.window.tinyMCE.activeEditor.windowManager.alert(`The following references were unable to be processed: ${leftovers.join(', ')}`);
            this.setState(
                Object.assign({}, this.state, { payload })
            );
        }

        reader.readAsText(file);
        this.setState(
            Object.assign({}, this.state, { filename: e.target.value })
        );
    }

    handleChange(e: DOMEvent) {
        this.setState(
            Object.assign({}, this.state, {
                format: e.target.value,
            })
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        let wm = top.tinyMCE.activeEditor.windowManager;
        wm.setParams({ data: this.state });
        wm.close();
    }


    render() {
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <label
                        htmlFor='citeformat'
                        style={{ fontWeight: 900, whiteSpace: 'nowrap', marginRight: 10 }}
                        children='Citation Format:'/>
                    <select
                        id='citeformat'
                        style={{width: '100%'}}
                        onChange={this.handleChange.bind(this)}
                        value={this.state.format} >
                            <option value='ama'>American Medical Association (AMA)</option>
                            <option value='apa'>American Psychological Association (APA)</option>
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, }}>
                        <label className='uploadLabel'>
                            <input
                                type="file"
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
                            value='Import'
                            disabled={this.state.payload.length === 0}
                            onClick={this.handleSubmit.bind(this)} />
                    </div>
                </div>
            </div>
        )
    }
}


ReactDOM.render(
    <ImportWindow />,
    document.getElementById('main-container')
);
