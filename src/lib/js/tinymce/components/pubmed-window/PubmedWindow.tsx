import * as React from 'react';
import { observable, computed, reaction, action } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from '../../../utils/DevTools';

import { Modal } from '../../../utils/Modal';
import { pubmedQuery } from '../../../utils/resolvers/';
import { ResultList } from './ResultList';
import { Paginate } from './Paginate';
import { Spinner } from '../../../components/Spinner';

const DevTool = DevTools();

@observer
export class PubmedWindow extends React.Component<{}, {}> {

    labels = top.ABT_i18n.tinymce.pubmedWindow;
    errors = top.ABT_i18n.errors;
    modal: Modal = new Modal(this.labels.title);
    wm: TinyMCE.WindowManager = top.window.tinyMCE.activeEditor.windowManager
        .windows[top.window.tinyMCE.activeEditor.windowManager.windows.length - 1];
    placeholder = this.generatePlaceholder();

    @observable
    isLoading = false;

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

    @action
    changePage = (page: number) => {
        this.page = page;
    }

    @action
    consumeQueryData = (data: PubMed.SingleReference[]) => {
        if (data.length === 0) {
            top.tinyMCE.activeEditor.windowManager.alert(this.errors.noResults);
        }
        this.page = 1;
        this.query = '';
        this.isLoading = false;
        this.results.replace(data);
    }

    @action
    toggleLoadState = () => this.isLoading = !this.isLoading;

    @action
    updateQuery = (e: React.FormEvent<HTMLInputElement>) => {
        this.query = e.currentTarget.value;
    }

    deliverPMID = (pmid: string) => {
        this.wm.data['pmid'] = pmid;
        this.wm.submit();
    }

    sendQuery = (e) => {
        this.toggleLoadState();
        e.preventDefault();
        pubmedQuery(this.query, true)
        .then(this.consumeQueryData)
        .catch(err => top.tinyMCE.activeEditor.windowManager.alert(err.message));
    }

    preventScrollPropagation = (e: React.WheelEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
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

        return options[Math.ceil(Math.random() * 10) - 1]; // tslint:disable-line
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

    render() {

        if (this.isLoading) {
            return (
                <Spinner size="40px" height="52px" bgColor="#f5f5f5" />
            );
        }

        return (
            <div onWheel={this.preventScrollPropagation}>
                <DevTool />
                <form id="query" onSubmit={this.sendQuery}>
                    <div className="row" id="pubmed-query">
                        <div className="flex">
                            <input
                                type="text"
                                onChange={this.updateQuery}
                                autoFocus={true}
                                placeholder={this.placeholder}
                                value={this.query}
                            />
                        </div>
                        <div>
                            <input
                                type="submit"
                                value={this.labels.search}
                                className={
                                    this.query
                                    ? 'abt-btn abt-btn_flat'
                                    : 'abt-btn abt-btn_flat abt-btn_disabled'
                                }
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
                        paginate={this.changePage}
                        resultLength={this.results.length}
                    />
                }
            </div>
        );
    }
}
