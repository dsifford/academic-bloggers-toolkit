import { action, computed, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { pubmedQuery } from 'utils/resolvers/';
import { shadows } from 'utils/styles';

import Button from 'components/button';
import Callout from 'components/callout';
import Spinner from 'components/spinner';

import { DialogProps } from 'dialogs/';
import { Paginate } from './paginate';
import { ResultList } from './result-list';

const ph = placeholderGenerator();

@observer
export default class PubmedDialog extends React.Component<DialogProps> {
    static readonly errors = top.ABT.i18n.errors;
    static readonly labels = top.ABT.i18n.dialogs.pubmed;

    /** Error message to be displayed in the callout, if applicable */
    errorMessage = observable('');

    /** Controls the loading state of the dialog */
    isLoading = observable(false);

    /** Current page of results */
    page = observable(0);

    /** Controls the state of the input field */
    query = observable('');

    /** Array of results returned from the pubmed search */
    results = observable<CSL.Data>([]);

    @computed
    get visibleResults(): CSL.Data[] {
        const end = this.page.get() * 5;
        const start = end - 6;
        return this.results.filter((_result, i) => {
            return start < i && i < end;
        });
    }

    @action
    setError = (msg: string | React.MouseEvent<HTMLDivElement> = ''): void => {
        this.errorMessage.set(typeof msg === 'string' ? msg : '');
    };

    @action
    toggleLoading = (state?: boolean): void => {
        return state === undefined
            ? this.isLoading.set(!this.isLoading.get())
            : this.isLoading.set(state);
    };

    @action
    updateQuery = (e?: React.FormEvent<HTMLInputElement>): void => {
        this.query.set(e ? e.currentTarget.value : '');
    };

    sendQuery = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        this.toggleLoading(true);
        try {
            const data = await pubmedQuery(this.query.get());
            if (data.length === 0) {
                this.setError(PubmedDialog.errors.noResults);
            } else {
                runInAction('update state after fetching data', () => {
                    this.page.set(1);
                    this.results.replace(data);
                });
            }
        } catch (e) {
            this.setError(e.message);
        }
        this.updateQuery();
        this.toggleLoading(false);
    };

    render(): JSX.Element {
        if (this.isLoading.get()) {
            return <Spinner size="40px" height="52px" bgColor="rgba(0, 0, 0, 0.05)" />;
        }
        const placeholder = ph.next().value;
        return (
            <div id="pubmed-dialog-root">
                <form id="query" onSubmit={this.sendQuery}>
                    <Callout onDismiss={this.setError} children={this.errorMessage.get()} />
                    <div className="pubmed-input-row">
                        <input
                            type="text"
                            onChange={this.updateQuery}
                            autoFocus={true}
                            required
                            placeholder={placeholder}
                            value={this.query.get()}
                        />
                        <Button
                            flat
                            disabled={!this.query.get()}
                            type="submit"
                            label={PubmedDialog.labels.search}
                        />
                    </div>
                </form>
                {this.results.length > 0 && (
                    <ResultList onSelect={this.props.onSubmit} results={this.visibleResults} />
                )}
                {this.results.length > 0 && (
                    <Paginate page={this.page} totalPages={Math.ceil(this.results.length / 5)} />
                )}
                <style jsx>{`
                    .pubmed-input-row {
                        display: flex;
                        align-items: center;
                        padding: 0 10px;
                    }
                    form {
                        background: rgba(0, 0, 0, 0.05);
                        padding: 10px 0;
                        box-shadow: ${shadows.depth_1};
                    }
                    input[type='text'] {
                        flex: auto;
                        margin-right: 10px;
                        height: 35px;
                        font-size: 16px;
                    }
                    #pubmed-dialog-root,
                    form {
                        border-radius: 0 0 2px 2px;
                    }
                `}</style>
            </div>
        );
    }
}

export function* placeholderGenerator(): IterableIterator<string> {
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
    let i = Math.floor(Math.random() * (options.length + 1));
    /* istanbul ignore next */
    while (true) {
        if (i === options.length) i = 0;
        yield options[i];
        i++;
    }
}
