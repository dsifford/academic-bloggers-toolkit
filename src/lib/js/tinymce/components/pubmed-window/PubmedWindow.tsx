import * as React from 'react';
import { observable, computed, reaction } from 'mobx';
import { observer } from 'mobx-react';

import { Modal } from '../../../utils/Modal';
import { PubmedQuery } from '../../../utils/Externals';
import { ResultList } from './ResultList';
import { Paginate } from './Paginate';

@observer
export class PubmedWindow extends React.Component<{}, {}> {

    labels = (top as any).ABT_i18n.tinymce.pubmedWindow;
    modal: Modal = new Modal(this.labels.title);
    wm: TinyMCE.WindowManager = top.window.tinyMCE.activeEditor.windowManager
        .windows[top.window.tinyMCE.activeEditor.windowManager.windows.length - 1];
    placeholder = this.generatePlaceholder();

    @observable
    page = 0;

    @observable
    query = '';

    @observable
    results = observable([]);

    @computed
    get visibleResults() {
        return this.results.filter((_result, i) => {
            if ( i < (this.page * 5) && ((this.page * 5) - 6) < i ) {
                return true;
            }
        });
    }

    generatePlaceholder(): string {
        const options = [
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
        reaction(
            () => [this.page, this.results.length],
            () => this.modal.resize(),
            false,
            300,
        );
    }

    deliverPMID = (pmid: string) => {
        this.wm.data['pmid'] = pmid;
        this.wm.submit();
    }

    handleQuery = (e) => {
        e.preventDefault();
        PubmedQuery(this.query, true)
        .then(data => {
            this.page = 1;
            this.query = '';
            this.results.replace(data);
        })
        .catch(err => top.tinyMCE.activeEditor.windowManager.alert(err.message));
    }

    handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.query = (e.target as HTMLInputElement).value;
    }

    handlePagination = (page: number) => {
        this.page = page;
    }

    render() {
        return (
            <div>
                <form id="query" onSubmit={this.handleQuery}>
                    <div className="row" id="pubmed-query">
                        <div className="flex">
                            <input
                                type="text"
                                onChange={this.handleChange}
                                autoFocus={true}
                                placeholder={this.placeholder}
                                value={this.query}
                            />
                        </div>
                        <div>
                            <input
                                type="submit"
                                value={this.labels.search}
                                className="btn"
                                disabled={!this.query}
                            />
                        </div>
                    </div>
                </form>
                { this.results.length > 0 &&
                    <ResultList
                        select={this.deliverPMID}
                        results={this.visibleResults}
                    />
                }
                { this.results.length > 0 &&
                    <Paginate
                        page={this.page}
                        paginate={this.handlePagination}
                        resultLength={this.results.length}
                    />
                }
            </div>
        );
    }
}
