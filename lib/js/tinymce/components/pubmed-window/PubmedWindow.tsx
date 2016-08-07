import * as React from 'react';
import { Modal } from '../../../utils/Modal';
import { PubmedQuery } from '../../../utils/PubmedAPI';
import { ResultList } from './ResultList';
import { Paginate } from './Paginate';

interface DOMEvent extends UIEvent {
    target: HTMLInputElement;
}

interface State {
    query: string;
    results: PubMed.SingleReference[];
    page: number;
}

export class PubmedWindow extends React.Component<{}, State> {

    labels = (top as any).ABT_i18n.tinymce.pubmedWindow;
    modal: Modal = new Modal(this.labels.title);
    wm: TinyMCE.WindowManager = top.window.tinyMCE.activeEditor.windowManager
        .windows[top.window.tinyMCE.activeEditor.windowManager.windows.length - 1];
    placeholder: string;

    constructor() {
        super();
        this.state = {
            page: 0,
            query: '',
            results: [],
        };
        this.placeholder = this.generatePlaceholder();
    }

    generatePlaceholder(): string {
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

    componentDidMount() {
        this.modal.resize();
    }

    handleQuery(e: Event) {
        e.preventDefault();
        PubmedQuery(this.state.query, true)
        .then(data => {
            this.setState({
                page: 1,
                query: '',
                results: data,
            });
            this.modal.resize();
        })
        .catch(err => top.tinyMCE.activeEditor.windowManager.alert(err.message));
    }

    handleChange(e: DOMEvent) {
        this.setState(
            Object.assign({}, this.state, { query: e.target.value })
        );
    }

    handlePagination(page: number, e: Event) {
        e.preventDefault();
        this.setState(
            Object.assign({}, this.state, { page })
        );
        this.modal.resize();
    }

    deliverPMID(pmid: string) {
        this.wm.data['pmid'] = pmid;
        this.wm.submit();
    }

    render() {
        return (
            <div>
                <form id="query" onSubmit={this.handleQuery.bind(this)} style={{margin: 0}}>
                    <div className="row" style={{display: 'flex'}}>
                        <input
                            type="text"
                            style={{flexGrow: 1}}
                            onChange={this.handleChange.bind(this)}
                            autoFocus={true}
                            placeholder={this.placeholder}
                            value={this.state.query}
                        />
                        <input
                            type="submit"
                            value={this.labels.search}
                            className="submit-btn"
                            disabled={!this.state.query}
                        />
                    </div>
                </form>
                { this.state.results.length !== 0 &&
                    <ResultList
                        eventHandler={this.deliverPMID.bind(this)}
                        results={
                            this.state.results.filter((_result, i) => { // tslint:disable-line
                                if ( i < (this.state.page * 5) && ((this.state.page * 5) - 6) < i ) {
                                    return true;
                                }
                            })
                        }
                    />
                }
                { this.state.results.length !== 0 &&
                    <Paginate
                        page={this.state.page}
                        onClick={this.handlePagination.bind(this)}
                        resultLength={this.state.results.length}
                    />
                }
            </div>
        );
    }
}
