import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Modal } from '../../../utils/Modal';
import { referenceWindowEvents as LocalEvents, manualDataObj } from '../../../utils/Constants';

import { ManualEntryContainer } from './ManualEntryContainer';

interface DOMEvent extends UIEvent {
    target: HTMLInputElement;
}

class ReferenceWindow extends React.Component<{}, ABT.ReferenceWindowPayload> {

    private modal: Modal = new Modal('Insert Formatted Reference');

    constructor() {
        super();
        this.state = {
            identifierList: '',
            attachInline: true,
            addManually: false,
            people: [
                { given: '', family: '', type: 'author' },
            ],
            manualData: manualDataObj,
        };
    }

    componentDidMount() {
        this.modal.resize();
    }

    componentDidUpdate() {
        this.modal.resize();
    }

    handleSubmit(e: Event) {
        e.preventDefault();
        let wm = top.tinyMCE.activeEditor.windowManager;
        wm.setParams({ data: this.state, });
        wm.close();
    }

    consumeChildEvents(e: CustomEvent) {
        switch (e.type) {
            case LocalEvents.IDENTIFIER_FIELD_CHANGE: {
                this.setState(
                    Object.assign({}, this.state, {
                        identifierList: e.detail,
                    })
                );
                return;
            }
            case LocalEvents.PUBMED_DATA_SUBMIT: {
                let newList: string = e.detail;

                // If the current PMID List is not empty, add PMID to it
                if (this.state.identifierList !== '') {
                    let combinedInput: string[] = this.state.identifierList.split(',');
                    combinedInput.push(newList);
                    newList = combinedInput.join(',');
                }

                this.setState(Object.assign({}, this.state, { identifierList: newList, }));
                return;
            }
            case LocalEvents.TOGGLE_MANUAL: {
                this.setState(
                    Object.assign({}, this.state, {
                        addManually: !this.state.addManually,
                    })
                );
                return;
            }
            case LocalEvents.ADD_PERSON: {
                this.setState(
                    Object.assign({}, this.state, {
                        people: [
                            ...this.state.people,
                            { given: '', family: '', type: 'author', },
                        ],
                    })
                );
                return;
            }
            case LocalEvents.REMOVE_PERSON: {
                this.setState(
                    Object.assign({}, this.state, {
                        people: [
                            ...this.state.people.slice(0, e.detail),
                            ...this.state.people.slice(e.detail + 1),
                        ],
                    })
                );
                return;
            }
            case LocalEvents.PERSON_CHANGE: {
                let people = [...this.state.people, ];
                people[e.detail.index][e.detail.field] = e.detail.value;
                this.setState(
                    Object.assign({}, this.state, {
                        people,
                    })
                );
                return;
            }
            case LocalEvents.TOGGLE_INLINE_ATTACHMENT: {
                this.setState(
                    Object.assign({}, this.state, { attachInline: !this.state.attachInline, })
                );
                return;
            }
            case LocalEvents.CHANGE_CITATION_STYLE: {
                this.setState(
                    Object.assign({}, this.state, { citationStyle: e.detail, })
                );
                return;
            }
            case LocalEvents.CHANGE_CITATION_TYPE: {
                this.setState(
                    Object.assign({}, this.state, {
                        manualData: Object.assign({}, manualDataObj, { type: e.detail, }),
                    })
                );
                return;
            }
            case LocalEvents.META_FIELD_CHANGE: {
                this.setState(
                    Object.assign({}, this.state, {
                        manualData: Object.assign({}, this.state.manualData, {
                            [e.detail.field]: e.detail.value,
                        }),
                    })
                );
                return;
            }
        }
    }

    render() {
        return(
            <div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    { !this.state.addManually &&
                        <IdentifierInput
                            identifierList={this.state.identifierList}
                            eventHandler={this.consumeChildEvents.bind(this)} />
                    }
                    { this.state.addManually &&
                        <ManualEntryContainer
                            manualData={this.state.manualData}
                            people={this.state.people}
                            eventHandler={this.consumeChildEvents.bind(this)} />
                    }
                    <ActionButtons
                        addManually={this.state.addManually}
                        eventHandler={this.consumeChildEvents.bind(this)}
                        attachInline={this.state.attachInline} />
                </form>
            </div>
        );
    }
}


interface IdentifierInputProps {
    identifierList: string;
    eventHandler: Function;
}

class IdentifierInput extends React.Component<IdentifierInputProps, {}> {

    refs: {
        [key: string]: Element
        identifierField: HTMLInputElement
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        (ReactDOM.findDOMNode(this.refs.identifierField) as HTMLInputElement).focus();
    }

    handleChange(e: DOMEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.IDENTIFIER_FIELD_CHANGE, { detail: e.target.value, })
        );
    }

    render() {
        return(
            <div className='row' style={{ display: 'flex', alignItems: 'center', }}>
                <div style={{ padding: '5px', }}>
                    <label
                        htmlFor='identifierList'
                        children='PMID/DOI' />
                </div>
                <input
                    type='text'
                    id='identifierList'
                    style={{ width: '100%', }}
                    onChange={this.handleChange.bind(this)}
                    ref='identifierField'
                    required={true}
                    value={this.props.identifierList} />
            </div>
        );
    }
}


interface ActionButtonProps {
    addManually: boolean;
    eventHandler: Function;
    attachInline: boolean;
}

class ActionButtons extends React.Component<ActionButtonProps, {}> {

    constructor(props: ActionButtonProps) {
        super(props);
    }

    searchPubmedClick() {
        let wm = top.tinyMCE.activeEditor.windowManager;
        wm.open({
            title: 'Search PubMed for Reference',
            url: wm.windows[0].settings.params.baseUrl + 'pubmed-window.html',
            width: 600,
            height: 100,
            onsubmit: (e) => {
                this.props.eventHandler(
                    new CustomEvent(LocalEvents.PUBMED_DATA_SUBMIT, { detail: e.target.data.pmid, })
                );
            },
        });
    }

    addManuallyClick() {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.TOGGLE_MANUAL)
        );
    }

    handleToggleInlineAttachment() {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.TOGGLE_INLINE_ATTACHMENT)
        );
    }

    render() {
        return(
            <div className='row' style={{
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
            }}>
                <input
                    id='addManually'
                    style={{ margin: '0 5px', }}
                    onClick={this.addManuallyClick.bind(this)}
                    type='button'
                    className='btn'
                    value={
                        this.props.addManually === false
                        ? 'Add Manually'
                        : 'Add with Identifier'} />
                <input
                    id='searchPubmed'
                    style={{ margin: '0 5px', }}
                    onClick={this.searchPubmedClick.bind(this)}
                    type='button'
                    className='btn'
                    value='Search Pubmed' />
                <span style={{
                    borderRight: 'solid 2px #ccc',
                    height: 25, margin: '0 10px',
                }} />
                <input
                    style={{ margin: '0 5px', }}
                    type='submit'
                    className='submit-btn'
                    value='Insert Reference' />
                <div>
                    <label
                        htmlFor='attachInline'
                        style={{ padding: '5px', whiteSpace: 'nowrap', }}
                        children='Attach Inline' />
                    <input
                        type='checkbox'
                        id='attachInline'
                        checked={this.props.attachInline}
                        onChange={this.handleToggleInlineAttachment.bind(this)} />
                </div>
            </div>
        );
    }

}



ReactDOM.render(
  <ReferenceWindow />,
  document.getElementById('main-container')
);
