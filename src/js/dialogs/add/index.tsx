import { action, computed, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { DialogProps } from 'dialogs/';
import {
    BookMeta as IBookMeta,
    getFromISBN,
    getFromURL,
    URLMeta as IURLMeta,
} from 'utils/resolvers/';
import { AutociteKind } from './autocite';

import Spinner from 'components/spinner';
import Container from 'dialogs/container';
import PubmedDialog from 'dialogs/pubmed';
import ButtonRow from './button-row';
import IdentifierInput from './identifier-input';
import ManualEntryContainer from './manual-entry-container';

interface BookMeta extends IBookMeta {
    kind: 'book' | 'chapter';
}
interface URLMeta extends IURLMeta {
    kind: 'webpage';
}
type AutoCiteMeta = BookMeta | URLMeta;

@observer
export default class AddDialog extends React.Component<DialogProps> {
    static readonly pubmedLabel = top.ABT.i18n.dialogs.pubmed.title;

    /** Describes the active state of `ManualEntryContainer` */
    addManually = observable(false);

    /** Describes the checked state of the attach inline toggle switch */
    attachInline = observable(true);

    /** Describes the active state of all dialogs above this one */
    currentDialog = observable('');

    /** Describes the visibility state of the error callout */
    errorMessage = observable('');

    /** Reference to the identifier input field in `IdentifierInput`. Used for focus/refocus */
    identifierInputField: HTMLInputElement | null | undefined;

    /** Controls the value of the `IdentifierInput` field */
    identifierList = observable('');

    /** Controls the visibility state of loading spinner */
    isLoading = observable(false);

    /** Controls the value of all fields in `ManualEntryContainer` */
    manualData = observable.map(new Map([['type', 'webpage']]));

    /** Controls the value of the `People` fields in `ManualEntryContainer` */
    people = observable<CSL.TypedPerson>([{ family: '', given: '', type: 'author' }]);

    @computed
    get payload() {
        return {
            addManually: toJS(this.addManually),
            attachInline: toJS(this.attachInline),
            identifierList: toJS(this.identifierList),
            manualData: toJS(this.manualData),
            people: this.people.slice(),
        };
    }

    @action
    appendPMID = (pmid: string) => {
        const ids = new Set(
            this.identifierList
                .get()
                .split(',')
                .map(i => i.trim())
                .concat(pmid)
                .filter(Boolean),
        );
        this.identifierList.set(Array.from(ids).join(', '));
        this.currentDialog.set('');
        if (this.identifierInputField) this.identifierInputField.focus();
    };

    @action
    autocite = (meta: AutoCiteMeta) => {
        switch (meta.kind) {
            case 'webpage':
                this.manualData.merge({
                    URL: meta.url,
                    accessed: meta.accessed
                        .split('T')[0]
                        .split('-')
                        .join('/'),
                    'container-title': meta.site_title,
                    issued: meta.issued
                        .split('T')[0]
                        .split('-')
                        .join('/'),
                    title: meta.content_title,
                });
                this.people.replace(
                    meta.authors.map(a => ({
                        family: a.lastname || '',
                        given: a.firstname || '',
                        type: 'author' as CSL.PersonType,
                    })),
                );
                break;
            case 'chapter':
            case 'book':
                const titleKey = meta.kind === 'chapter' ? 'container-title' : 'title';
                this.manualData.merge({
                    accessed: new Date(Date.now())
                        .toISOString()
                        .split('T')[0]
                        .split('-')
                        .join('/'),
                    issued: meta.issued,
                    'number-of-pages': meta['number-of-pages'],
                    publisher: meta.publisher,
                    [titleKey]: meta.title,
                });
                this.people.replace(meta.authors);
        }
    };

    @action
    changeIdentifiers = (e: React.FormEvent<HTMLInputElement>) => {
        this.identifierList.set(e.currentTarget.value);
    };

    @action
    changeType = (citationType: CSL.CitationType) => {
        this.manualData.clear();
        this.manualData.set('type', citationType);
        this.people.replace([{ family: '', given: '', type: 'author' }]);
    };

    @action
    closePubmedDialog = () => {
        this.props.focusTrapPaused!.set(false);
    };

    @action
    openPubmedDialog = () => {
        this.props.focusTrapPaused!.set(true);
        this.currentDialog.set('PUBMED');
    };

    @action
    setErrorMessage = (msg?: string) => {
        this.errorMessage.set(msg || '');
    };

    @action
    toggleAddManual = () => {
        this.addManually.set(!this.addManually.get());
        this.people.replace([{ family: '', given: '', type: 'author' }]);
        this.changeType('webpage');
    };

    @action
    toggleAttachInline = () => {
        this.attachInline.set(!this.attachInline.get());
    };

    @action
    toggleLoadingState = (state?: boolean) => {
        const loadingState: boolean = state ? state : !this.isLoading.get();
        this.isLoading.set(loadingState);
    };

    captureInputField = (el: HTMLInputElement | null) => {
        this.identifierInputField = el;
        if (el) el.focus();
    };

    handleAutocite = async (kind: AutociteKind, query: string) => {
        this.toggleLoadingState();
        try {
            switch (kind) {
                case 'webpage': {
                    const data = await getFromURL(query);
                    this.autocite({ ...data, kind });
                    break;
                }
                case 'book':
                case 'chapter':
                default: {
                    const data = await getFromISBN(query);
                    this.autocite({ ...data, kind });
                }
            }
        } catch (e) {
            this.setErrorMessage(e.message);
        }
        this.toggleLoadingState();
    };

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.props.onSubmit(this.payload);
    };

    render() {
        return (
            <div>
                {this.isLoading.get() && <Spinner size="40px" overlay />}
                {this.currentDialog.get() === 'PUBMED' && (
                    <Container
                        overlayOpacity={0.2}
                        currentDialog={this.currentDialog}
                        title={AddDialog.pubmedLabel}
                        onClose={this.closePubmedDialog}
                    >
                        <PubmedDialog onSubmit={this.appendPMID} />
                    </Container>
                )}
                <form id="add-reference" onSubmit={this.handleSubmit}>
                    {!this.addManually.get() && (
                        <IdentifierInput
                            fieldRef={this.captureInputField}
                            identifierList={this.identifierList}
                            onChange={this.changeIdentifiers}
                        />
                    )}
                    {this.addManually.get() && (
                        <ManualEntryContainer
                            errorMessage={this.errorMessage}
                            manualData={this.manualData}
                            people={this.people}
                            onAutoCite={this.handleAutocite}
                            onTypeChange={this.changeType}
                        />
                    )}
                </form>
                <ButtonRow
                    isLoading={this.isLoading.get()}
                    addManually={this.addManually}
                    onSearchPubmedClick={this.openPubmedDialog}
                    attachInline={this.attachInline}
                    onAttachInlineToggle={this.toggleAttachInline}
                    onToggleManual={this.toggleAddManual}
                />
                <style jsx>{`
                    div {
                        position: relative;
                    }
                `}</style>
            </div>
        );
    }
}
