import { action, computed, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Spinner } from 'components/Spinner';
import { colors, shadows } from 'utils/styles';

import { pubmedQuery } from 'utils/resolvers/';
import { Paginate } from './paginate';
import { ResultList } from './result-list';

interface Props {
    onSubmit(data: any): void;
}

const ph = placeholderGenerator();

@observer
export default class PubmedDialog extends React.Component<Props> {
    static readonly labels = top.ABT_i18n.tinymce.pubmedWindow;
    static readonly errors = top.ABT_i18n.errors;

    isLoading = observable(false);

    page = observable(0);

    query = observable('');

    results = observable<PubMed.Response>([]);

    @computed
    get visibleResults() {
        return this.results.filter((_result, i) => {
            if (i < this.page.get() * 5 && this.page.get() * 5 - 6 < i) {
                return true;
            }
            return false;
        });
    }

    @action
    updateQuery = (e: React.FormEvent<HTMLInputElement>) => {
        this.query.set(e.currentTarget.value);
    };

    @action
    toggleLoading = (state?: boolean) => {
        return state === undefined
            ? this.isLoading.set(!this.isLoading.get())
            : this.isLoading.set(state);
    };

    sendQuery = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.toggleLoading(true);
        try {
            const data = await pubmedQuery(this.query.get());
            if (data.length === 0) {
                // top.tinyMCE.activeEditor.windowManager.alert(Dialog.errors.noResults);
            }
            runInAction('update state after fetching data', () => {
                this.page.set(1);
                this.query.set('');
                this.results.replace(data);
            });
        } catch (e) {
            // FIXME:
            // top.tinyMCE.activeEditor.windowManager.alert(e.message);
        }
        this.toggleLoading(false);
    };

    render() {
        if (this.isLoading.get()) {
            return <Spinner size="40px" height="52px" bgColor="#f5f5f5" />;
        }
        const placeholder = ph.next().value;
        return (
            <div>
                <form id="query" onSubmit={this.sendQuery}>
                    <input
                        type="text"
                        onChange={this.updateQuery}
                        autoFocus={true}
                        required
                        placeholder={placeholder}
                        value={this.query.get()}
                    />
                    <input
                        type="submit"
                        value={PubmedDialog.labels.search}
                        className={
                            this.query.get()
                                ? 'abt-btn abt-btn_flat'
                                : 'abt-btn abt-btn_flat abt-btn_disabled'
                        }
                    />
                </form>
                {this.results.length > 0 &&
                    <ResultList onSelect={this.props.onSubmit} results={this.visibleResults} />}
                {this.results.length > 0 &&
                    <Paginate page={this.page} totalPages={Math.ceil(this.results.length / 5)} />}
                <style jsx>{`
                    form {
                        display: flex;
                        padding: 10px;
                        align-items: center;
                        background: ${colors.light_gray};
                        box-shadow: ${shadows.depth_1}, ${shadows.top_border};
                    }
                    input[type="text"] {
                        flex: auto;
                        margin-right: 10px;
                        height: 35px;
                        font-size: 16px;
                    }
                    div, form {
                        border-radius: 0 0 2px 2px;
                    }
                `}</style>
            </div>
        );
    }
}

function* placeholderGenerator() {
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
    let i = 0;
    while (true) {
        if (i === options.length) i = 0;
        yield options[i];
        i++;
    }
}
