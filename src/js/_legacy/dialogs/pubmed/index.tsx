import { action, computed, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { deprecatedPubmedQuery } from 'utils/resolvers';

import AdminNotice from 'components/admin-notice';

import ActionBar from '_legacy/components/action-bar';
import Button from '_legacy/components/button';
import Spinner from '_legacy/components/spinner';
import { DialogProps } from '_legacy/dialogs';

import Paginate from './paginate';
import ResultList from './result-list';

const ph = placeholderGenerator();

@observer
export default class PubmedDialog extends React.Component<DialogProps> {
    static readonly errors = top.ABT.i18n.errors;
    static readonly labels = top.ABT.i18n.dialogs.pubmed;

    /**
     * Error message to be displayed in the callout, if applicable
     */
    @observable errorMessage = '';

    /**
     * Controls the loading state of the dialog
     */
    @observable isLoading = false;

    /**
     * Controls the state of the input field
     */
    @observable query = '';

    /**
     * Current page of results
     */
    page = observable.box(0);

    /**
     * Array of results returned from the pubmed search
     */
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
    setError = (msg: string = ''): void => {
        this.errorMessage = msg;
    };

    @action
    toggleLoading = (state?: boolean): void => {
        this.isLoading = state === undefined ? !this.isLoading : state;
    };

    @action
    updateQuery = (e?: React.FormEvent<HTMLInputElement>): void => {
        this.query = e ? e.currentTarget.value : '';
    };

    sendQuery = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        this.toggleLoading(true);
        try {
            const data = await deprecatedPubmedQuery(this.query);
            if (data.length === 0) {
                this.setError(PubmedDialog.errors.no_results);
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
        if (this.isLoading) {
            return (
                <Spinner
                    size="40px"
                    height="52px"
                    bgColor="rgba(0, 0, 0, 0.05)"
                />
            );
        }
        const placeholder = ph.next().value;
        return (
            <>
                <form id="query" onSubmit={this.sendQuery}>
                    {this.errorMessage && (
                        <AdminNotice
                            kind="error"
                            isDismissible
                            onDismiss={() => this.setError()}
                        >
                            {this.errorMessage}
                        </AdminNotice>
                    )}
                    <ActionBar>
                        <input
                            type="text"
                            style={{
                                flex: 'auto',
                                marginRight: 10,
                                height: 35,
                                fontSize: 16,
                            }}
                            onChange={this.updateQuery}
                            autoFocus={true}
                            required
                            placeholder={placeholder}
                            value={this.query}
                        />
                        <Button
                            flat
                            disabled={!this.query}
                            type="submit"
                            label={PubmedDialog.labels.search}
                        >
                            {PubmedDialog.labels.search}
                        </Button>
                    </ActionBar>
                </form>
                {this.results.length > 0 && (
                    <ResultList
                        onSelect={this.props.onSubmit}
                        results={this.visibleResults}
                    />
                )}
                {this.results.length > 0 && (
                    <Paginate
                        page={this.page}
                        totalPages={Math.ceil(this.results.length / 5)}
                    />
                )}
            </>
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
    while (true) {
        if (i === options.length) {
            i = 0;
        }
        yield options[i];
        i++;
    }
}
