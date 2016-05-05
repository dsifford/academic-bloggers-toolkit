import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Modal, } from '../../utils/Modal';
import { PubmedQuery, } from '../../utils/PubmedAPI';
import { ResultList, } from './ResultList';
import { Paginate, } from './Paginate';

declare var wm;

interface DOMEvent extends UIEvent {
    target: HTMLInputElement;
}

interface State {
    query: string;
    results: Object[];
    page: number;
}

export class PubmedWindow extends React.Component<{}, State> {

    private modal: Modal = new Modal('Search PubMed for Reference');
    private wm: TinyMCE.WindowManager = top.window.tinyMCE.activeEditor.windowManager
        .windows[top.window.tinyMCE.activeEditor.windowManager.windows.length - 1];
    private placeholder: string;

    private generatePlaceholder(): string {
        let options = [
            'Ioannidis JP[Author - First] AND meta research',
            'Brohi K[Author - First] AND "acute traumatic coagulopathy"',
            'Dunning[Author] AND Kruger[Author] AND incompetence',
            'parachute use AND death prevention AND BMJ[Journal]',
            'obediance AND Milgram S[Author - First]',
            'tranexamic acid AND trauma NOT arthroscopy AND Lancet[Journal]',
            'Watson JD[Author] AND Crick FH[Author] AND "nucleic acid"',
            'innovation OR ("machine learning" OR "deep learning") AND healthcare',
            'injuries NOT orthopedic AND hemorrhage[MeSH]',
            'resident OR student AND retention',
        ];

        return options[Math.ceil(Math.random() * 10) - 1];
    }

    constructor() {
        super();
        this.state = {
            query: '',
            results: [],
            page: 0,
        };
        this.placeholder = this.generatePlaceholder();
    }

    componentDidMount() {
        this.modal.resize();
    }

    handleQuery(e: Event) {
        e.preventDefault();
        PubmedQuery(this.state.query, (data: Object[]|Error) => {
            if (data instanceof Error) {
                top.tinyMCE.activeEditor.windowManager.alert(data.message);
                return;
            }
            this.setState({
                query: '',
                results: data,
                page: 1,
            });
            this.modal.resize();
        }, true);
    }

    handleChange(e: DOMEvent) {
        this.setState(
            Object.assign({}, this.state, { query: e.target.value, })
        );
    }

    handlePagination(page: number, e: Event) {
        e.preventDefault();
        this.setState(
            Object.assign({}, this.state, { page, })
        );
        this.modal.resize();
    }

    deliverPMID(pmid: string, e: Event) {
        this.wm.data['pmid'] = pmid;
        this.wm.submit();
    }

    render() {
        return (
            <div>
                <form id='query' onSubmit={this.handleQuery.bind(this)} style={{ margin: 0, }}>
                    <div className='row' style={{ display: 'flex', }}>
                        <input
                            type='text'
                            style={{ flexGrow: '1', }}
                            onChange={this.handleChange.bind(this)}
                            autoFocus={true}
                            placeholder={this.placeholder}
                            value={this.state.query} />
                        <input
                            type='submit'
                            value='Search'
                            className='submit-btn'
                            disabled={!this.state.query} />
                    </div>
                </form>
                { this.state.results.length !== 0 &&
                    <ResultList
                        eventHandler={this.deliverPMID.bind(this)}
                        results={
                            this.state.results.filter((result, i) => {
                                if ( i < (this.state.page * 5) && ((this.state.page * 5) - 6) < i ) {
                                    return true;
                                }
                            })
                        } />
                }
                { this.state.results.length !== 0 &&
                    <Paginate
                        page={this.state.page}
                        onClick={this.handlePagination.bind(this)}
                        resultLength={this.state.results.length } />
                }
            </div>
        );
    }
}
