import * as React from 'react';
import { Modal } from '../../../utils/Modal';
import { referenceWindowEvents as LocalEvents, manualDataObj } from '../../../utils/Constants';

import { IdentifierInput } from './IdentifierInput';
import { ManualEntryContainer } from './ManualEntryContainer';
import { ButtonRow } from './ButtonRow';

export class ReferenceWindow extends React.Component<{}, ABT.ReferenceWindowPayload> {

    private modal: Modal = new Modal('Insert Formatted Reference');

    constructor() {
        super();
        this.state = {
            addManually: false,
            attachInline: true,
            identifierList: '',
            manualData: manualDataObj,
            people: [
                {family: '', given: '', type: 'author'},
            ],
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
        wm.setParams({ data: this.state });
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

                this.setState(Object.assign({}, this.state, { identifierList: newList }));
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
                            {family: '', given: '', type: 'author'},
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
                let people = [...this.state.people];
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
                    Object.assign({}, this.state, { attachInline: !this.state.attachInline })
                );
                return;
            }
            case LocalEvents.CHANGE_CITATION_STYLE: {
                this.setState(
                    Object.assign({}, this.state, { citationStyle: e.detail })
                );
                return;
            }
            case LocalEvents.CHANGE_CITATION_TYPE: {
                this.setState(
                    Object.assign({}, this.state, {
                        manualData: Object.assign({}, manualDataObj, { type: e.detail }),
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
            default:
                return;
        }
    }

    render() {
        return(
            <div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    { !this.state.addManually &&
                        <IdentifierInput
                            identifierList={this.state.identifierList}
                            eventHandler={this.consumeChildEvents.bind(this)}
                        />
                    }
                    { this.state.addManually &&
                        <ManualEntryContainer
                            manualData={this.state.manualData}
                            people={this.state.people}
                            eventHandler={this.consumeChildEvents.bind(this)}
                        />
                    }
                    <ButtonRow
                        addManually={this.state.addManually}
                        eventHandler={this.consumeChildEvents.bind(this)}
                        attachInline={this.state.attachInline}
                    />
                </form>
            </div>
        );
    }
}
