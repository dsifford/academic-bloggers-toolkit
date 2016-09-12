import * as React from 'react';
import { Modal } from '../../../../utils/Modal';
import { observable, computed, IObservableArray, reaction, map, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { getFromURL } from '../../../../utils/Externals';
// import DevTools, { configureDevtool } from 'mobx-react-devtools';
// configureDevtool({
//   logFilter: change => change.type === 'action',
// });

import { IdentifierInput } from './IdentifierInput';
import { ManualEntryContainer } from './ManualEntryContainer';
import { ButtonRow } from './ButtonRow';

@observer
export class ReferenceWindow extends React.Component<{}, {}> {

    labels = (top as any).ABT_i18n.tinymce.referenceWindow.referenceWindow;
    modal: Modal = new Modal(this.labels.title);

    @observable
    addManually = false;

    @observable
    attachInline = true;

    @observable
    identifierList = '';

    @observable
    isLoading = false;

    @observable
    manualData = map([['type', 'webpage']]);

    @observable
    people: IObservableArray<CSL.TypedPerson> = observable([
        { family: '', given: '', type: 'author' } as CSL.TypedPerson,
    ]);

    @computed
    get payload() {
        return {
            addManually: this.addManually,
            attachInline: this.attachInline,
            identifierList: this.identifierList,
            manualData: toJS(this.manualData),
            people: this.people.slice(),
        };
    };

    @action
    addPerson = () => {
        this.people.push({ family: '', given: '', type: 'author' });
    }

    @action
    appendPMID = (pmid: string) => {
        this.identifierList = this.identifierList
            .split(',')
            .map(i => i.trim())
            .concat(pmid)
            .filter(Boolean)
            .join(',');
    }

    @action
    autocite = (meta: ABT.URLMeta) => {
        this.manualData.merge({
            URL: meta.url,
            accessed: meta.accessed.split('T')[0].split('-').join('/'),
            'container-title': meta.site_title,
            issued: meta.issued.split('T')[0].split('-').join('/'),
            title: meta.content_title,
        });
        this.people.replace(meta.authors.map(a => ({
            family: a.lastname || '',
            given: a.firstname || '',
            type: 'author',
        } as CSL.TypedPerson)));
        this.toggleLoadingState();
    }

    @action
    changeIdentifiers = (value: string) => {
        this.identifierList = value;
    }

    @action
    changeType = (type: CSL.CitationType) => {
        this.manualData.clear();
        this.manualData.set('type', type);
    }

    @action
    removePerson = (index: string) => {
        this.people.remove(this.people[index]);
    }

    @action
    toggleAttachInline = () => {
        this.attachInline = !this.attachInline;
    }

    @action
    toggleLoadingState = (state?: boolean) => {
        this.isLoading = state
        ? state
        : !this.isLoading;
    }

    @action
    toggleAddManual = () => {
        this.addManually = !this.addManually;
        this.people.replace([{ family: '', given: '', type: 'author' } as CSL.TypedPerson]);
        this.changeType('webpage');
    }

    @action
    updatePerson = (index: string, field: string, value: string) => {
        this.people[index][field] = value;
    }

    componentDidMount() {
        this.modal.resize();
        reaction(
            () => [this.people.length, this.manualData.get('type'), this.addManually],
            () => this.modal.resize(),
            false,
            100
        );
    }

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let wm = top.tinyMCE.activeEditor.windowManager;
        wm.setParams({ data: this.payload });
        wm.close();
    }

    handleAutocite = (query: string) => {
        this.toggleLoadingState();
        getFromURL(query)
        .then(this.autocite)
        .catch(e => {
            this.toggleLoadingState();
            top.tinyMCE.activeEditor.windowManager.alert(e.message);
            console.error(e);
        });
    }

    preventScrollPropagation = (e: React.WheelEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        return(
            <div onWheel={this.preventScrollPropagation}>
                {/* <DevTools /> */}
                <form onSubmit={this.handleSubmit}>
                    { !this.addManually &&
                        <IdentifierInput
                            identifierList={this.identifierList}
                            change={this.changeIdentifiers}
                        />
                    }
                    { this.addManually &&
                        <ManualEntryContainer
                            addPerson={this.addPerson}
                            autoCite={this.handleAutocite}
                            changePerson={this.updatePerson}
                            loading={this.isLoading}
                            manualData={this.manualData}
                            people={this.people}
                            removePerson={this.removePerson}
                            typeChange={this.changeType}
                        />
                    }
                    <ButtonRow
                        addManually={this.addManually}
                        pubmedCallback={this.appendPMID}
                        attachInline={this.attachInline}
                        attachInlineToggle={this.toggleAttachInline}
                        toggleManual={this.toggleAddManual}
                    />
                </form>
            </div>
        );
    }
}
