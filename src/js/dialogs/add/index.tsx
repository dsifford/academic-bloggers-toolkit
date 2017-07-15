import { action, computed, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { BookMeta, getFromISBN, getFromURL, URLMeta } from 'utils/resolvers/';

import { ButtonRow } from './button-row';
import { IdentifierInput } from './identifier-input';
import { ManualEntryContainer } from './manual-entry-container';

interface Props {
    onSubmit(data: any): void;
}

@observer
export default class AddDialog extends React.Component<Props> {
    static readonly labels = top.ABT_i18n.tinymce.referenceWindow.referenceWindow;

    addManually = observable(false);

    attachInline = observable(true);

    identifierList = observable('');

    isLoading = observable(false);

    manualData = observable.map(new Map([['type', 'webpage']]));

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
        this.identifierList.set(
            this.identifierList
                .get()
                .split(',')
                .map(i => i.trim())
                .concat(pmid)
                .filter(Boolean)
                .join(',')
        );
    };

    @action
    autocite = (
        kind: 'webpage' | 'book' | 'chapter',
        meta: { webpage?: URLMeta; book?: BookMeta }
    ) => {
        switch (kind) {
            case 'webpage':
                this.manualData.merge({
                    URL: meta.webpage!.url,
                    accessed: meta.webpage!.accessed.split('T')[0].split('-').join('/'),
                    'container-title': meta.webpage!.site_title,
                    issued: meta.webpage!.issued.split('T')[0].split('-').join('/'),
                    title: meta.webpage!.content_title,
                });
                this.people.replace(
                    meta.webpage!.authors.map(a => ({
                        family: a.lastname || '',
                        given: a.firstname || '',
                        type: 'author' as CSL.PersonType,
                    }))
                );
                break;
            case 'book':
            case 'chapter':
            default:
                const titleKey = kind === 'chapter' ? 'container-title' : 'title';
                this.manualData.merge({
                    accessed: new Date(Date.now()).toISOString().split('T')[0].split('-').join('/'),
                    issued: meta.book!.issued,
                    'number-of-pages': meta.book!['number-of-pages'],
                    publisher: meta.book!.publisher,
                    [titleKey]: meta.book!.title,
                });
                this.people.replace(meta.book!.authors);
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
    toggleAttachInline = () => {
        this.attachInline.set(!this.attachInline.get());
    };

    @action
    toggleLoadingState = (state?: boolean) => {
        const loadingState: boolean = state ? state : !this.isLoading.get();
        this.isLoading.set(loadingState);
    };

    @action
    toggleAddManual = () => {
        this.addManually.set(!this.addManually.get());
        this.people.replace([{ family: '', given: '', type: 'author' }]);
        this.changeType('webpage');
    };

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.props.onSubmit(this.payload);
    };

    handleAutocite = async (kind: 'webpage' | 'book' | 'chapter', query: string) => {
        this.toggleLoadingState();
        try {
            switch (kind) {
                case 'webpage': {
                    const data = await getFromURL(query);
                    this.autocite(kind, { webpage: data });
                    break;
                }
                case 'book':
                case 'chapter':
                default: {
                    const data: BookMeta = await getFromISBN(query);
                    this.autocite(kind, { book: data });
                }
            }
        } catch (e) {
            // FIXME:
            // top.tinyMCE.activeEditor.windowManager.alert(e.message);
        }
        this.toggleLoadingState();
    };

    render() {
        return (
            <div>
                <form id="add-reference" onSubmit={this.handleSubmit}>
                    {!this.addManually.get() &&
                        <IdentifierInput
                            identifierList={this.identifierList}
                            onChange={this.changeIdentifiers}
                        />}
                    {this.addManually.get() &&
                        <ManualEntryContainer
                            autoCite={this.handleAutocite}
                            loading={this.isLoading.get()}
                            manualData={this.manualData}
                            people={this.people}
                            typeChange={this.changeType}
                        />}
                </form>
                    <ButtonRow
                        addManually={this.addManually}
                        pubmedCallback={this.appendPMID}
                        attachInline={this.attachInline}
                        attachInlineToggle={this.toggleAttachInline}
                        toggleManual={this.toggleAddManual}
                    />
            </div>
        );
    }
}
