import * as React from 'react';
import { Modal } from '../../../../utils/Modal';
import { observable, computed, IObservableArray, reaction, map } from 'mobx';
import { observer } from 'mobx-react';
import { getFromURL } from '../../../../utils/Externals';
import DevTools from 'mobx-react-devtools';

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
            manualData: this.manualData.toJS(),
            people: this.people,
        };
    };

    constructor() {
        super();
        reaction(
            () => [this.people.length, this.manualData.get('type'), this.addManually],
            () => this.modal.resize(),
            false,
            100
        );
    }

    componentDidMount() {
        this.modal.resize();
    }

    handleSubmit(e: Event) {
        e.preventDefault();
        let wm = top.tinyMCE.activeEditor.windowManager;
        wm.setParams({ data: this.payload });
        wm.close();
    }

    appendPMID = (pmid: string) => {
        this.identifierList = this.identifierList
            .split(',')
            .map(i => i.trim())
            .concat(pmid)
            .filter(Boolean)
            .join(',');
    }

    handleAddPerson = () => {
        this.people.push({ family: '', given: '', type: 'author' });
    }

    handleAutocite = (query: string) => {
        this.isLoading = true;
        getFromURL(query)
        .then(meta => {
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
            this.isLoading = false;
        })
        .catch(e => {
            this.isLoading = false;
            top.tinyMCE.activeEditor.windowManager.alert(e.message);
            console.error(e);
        });
    }

    handleChangePerson = (index: string, field: string, value: string) => {
        this.people[index][field] = value;
    }

    handleIdentifierChange = (value: string) => {
        this.identifierList = value;
    }

    handleRemovePerson = (index: string) => {
        this.people.remove(this.people[index]);
    }

    handleToggleAttachInline = () => {
        this.attachInline = !this.attachInline;
    }

    handleToggleManual = () => {
        this.addManually = !this.addManually;
        this.people.replace([{ family: '', given: '', type: 'author' } as CSL.TypedPerson]);
        this.handleTypeChange('webpage');
    }

    handleTypeChange = (type: CSL.CitationType) => {
        this.manualData.clear();
        this.manualData.set('type', type);
    }

    render() {
        return(
            <div>
                <DevTools />
                <form onSubmit={this.handleSubmit.bind(this)}>
                    { !this.addManually &&
                        <IdentifierInput
                            identifierList={this.identifierList}
                            change={this.handleIdentifierChange}
                        />
                    }
                    { this.addManually &&
                        <ManualEntryContainer
                            addPerson={this.handleAddPerson}
                            autoCite={this.handleAutocite}
                            changePerson={this.handleChangePerson}
                            loading={this.isLoading}
                            manualData={this.manualData}
                            people={this.people}
                            removePerson={this.handleRemovePerson}
                            typeChange={this.handleTypeChange}
                        />
                    }
                    <ButtonRow
                        addManually={this.addManually}
                        pubmedCallback={this.appendPMID}
                        attachInline={this.attachInline}
                        attachInlineToggle={this.handleToggleAttachInline}
                        toggleManual={this.handleToggleManual}
                    />
                </form>
            </div>
        );
    }
}
