import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Modal from '../utils/Modal';
import citeStyles from '../utils/CitationStylesObj';
import { CitationTypeArray, FieldMappings } from '../utils/Constants';
import { toTitleCase } from '../utils/HelperFunctions';

interface DOMEvent extends UIEvent {
    target: HTMLInputElement
}

interface State {
    identifierList: string
    citationStyle: string
    showCitationSelect: boolean
    includeLink: boolean
    attachInline: boolean
    addManually: boolean
    people: CSL.Person[]
    manualData: CSL.Data
}

const LocalEvents = {
    'IDENTIFIER_FIELD_CHANGE': 'IDENTIFIER_FIELD_CHANGE',
    'PUBMED_DATA_SUBMIT': 'PUBMED_DATA_SUBMIT',
    'TOGGLE_MANUAL': 'TOGGLE_MANUAL',
    'TOGGLE_INCLUDE_LINK': 'TOGGLE_INCLUDE_LINK',
    'ADD_PERSON': 'ADD_PERSON',
    'REMOVE_PERSON': 'REMOVE_PERSON',
    'PERSON_CHANGE': 'PERSON_CHANGE',
    'SHOW_CITATION_SELECT': 'SHOW_CITATION_SELECT',
    'TOGGLE_INLINE_ATTACHMENT': 'TOGGLE_INLINE_ATTACHMENT',
    'CHANGE_CITATION_STYLE': 'CHANGE_CITATION_STYLE',
    'CHANGE_CITATION_TYPE': 'CHANGE_CITATION_TYPE',
}



class ReferenceWindow extends React.Component<{}, State> {

    private modal: Modal = new Modal('Insert Formatted Reference');

    constructor() {
        super();
        this.state = {
            identifierList: '',
            citationStyle: top.tinyMCE.activeEditor.windowManager.windows[0].settings.params.preferredStyle || 'american-medical-association',
            includeLink: false,
            attachInline: false,
            showCitationSelect: false,
            addManually: false,
            people: [
                { given: '', family: '' },
            ],
            manualData: {
                id: 0,
                type: 'article-journal',
                accessed: [],
                issued: [],
                // 'event-date': [],
                'chapter-number': '',
                journalAbbreviation: '',
                'collection-title': '', // book series
                'container-title': '', // book title for chapter, journal title for journal article
                'container-title-short': '',
                DOI: '', // string
                edition: '', // string|number
                event: '', // string
                'event-place': '', // string
                genre: '', // string // eg. phd dissertation for thesis
                ISBN: '', // string
                issue: '', // string|number
                'page': '', // string
                publisher: '', // string
                'publisher-place': '', // string
                section: '', // string // relevant for newspaper
                title: '', // string
                'title-short': '', // string
                URL: '', // string
                volume: '', // string|number
            },
        }
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
                        identifierList: e.detail
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
            case LocalEvents.TOGGLE_INCLUDE_LINK: {
                this.setState(
                    Object.assign({}, this.state, {
                        includeLink: !this.state.includeLink
                    })
                );
                return;
            }
            case LocalEvents.ADD_PERSON: {
                this.setState(
                    Object.assign({}, this.state, {
                        people: [
                            ...this.state.people,
                            { given: '', family: '' },
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
                            ...this.state.people.slice(e.detail + 1)
                        ]
                    })
                );
                return;
            }
            case LocalEvents.PERSON_CHANGE: {
                let people = [...this.state.people];
                people[e.detail.index][e.detail.field] = e.detail.value;
                this.setState(
                    Object.assign({}, this.state, {
                        people
                    })
                );
                return;
            }
            case LocalEvents.SHOW_CITATION_SELECT: {
                this.setState(
                    Object.assign({}, this.state, { showCitationSelect: !this.state.showCitationSelect })
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
                let manualData = Object.assign({}, this.state.manualData, {
                    type: e.detail,
                });
                this.setState(
                    Object.assign({}, this.state, { manualData })
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
                    <RefOptions
                        attachInline={this.state.attachInline}
                        citationStyle={this.state.citationStyle}
                        eventHandler={this.consumeChildEvents.bind(this)}
                        showSelectBox={this.state.showCitationSelect} />
                    <ActionButtons
                        addManually={this.state.addManually}
                        eventHandler={this.consumeChildEvents.bind(this)} />
                </form>
            </div>
        );
    }
}


interface IdentifierInputProps {
    identifierList: string
    eventHandler: Function
}

class IdentifierInput extends React.Component<IdentifierInputProps,{}> {

    refs: {
        [key: string]: Element
        identifierField: HTMLInputElement
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        (ReactDOM.findDOMNode(this.refs.identifierField) as HTMLInputElement).focus()
    }

    handleChange(e: DOMEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.IDENTIFIER_FIELD_CHANGE, { detail: e.target.value })
        );
    }

    handleLinkToggle() {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.TOGGLE_INCLUDE_LINK)
        );
    }

    render() {
        return(
            <div className='row' style={{display: 'flex', alignItems: 'center'}}>
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
                <div style={{ padding: '5px', }}>
                    <label
                        style={{ whiteSpace: 'nowrap', }}
                        htmlFor='includeLink'
                        children='Include Link?'/>
                </div>
                <div style={{ padding: '5px', }}>
                    <input
                        type="checkbox"
                        onChange={this.handleLinkToggle.bind(this)}
                        id="includeLink" />
                </div>
            </div>
        )
    }
}

interface RefOptionsProps {
    attachInline: boolean
    citationStyle: string
    eventHandler: Function
    showSelectBox: boolean
}

class RefOptions extends React.Component<RefOptionsProps,{}> {

    constructor(props) {
        super(props);
    }

    handleSelect(e: DOMEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.CHANGE_CITATION_STYLE, {
                detail: e.target.value
            })
        );
    }

    handleToggleInlineAttachment() {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.TOGGLE_INLINE_ATTACHMENT)
        );
    }

    handleToggleSelect() {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.SHOW_CITATION_SELECT)
        );
    }

    public citationStyleText = toTitleCase(this.props.citationStyle.split('-').join(' '));

    render() {
        return (
            <div className='row'>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <label
                        htmlFor='citationStyle'
                        children='Format'
                        style={{ padding: '5px', }} />
                    { this.props.showSelectBox &&
                        <select
                            id='citationStyle'
                            style={{ width: '100%', }}
                            onChange={this.handleSelect.bind(this)}
                            value={this.props.citationStyle} >
                            { citeStyles.map((style, i) =>
                                <option
                                key={i}
                                value={style.label}
                                children={style.value} />
                            )}
                        </select>
                    }
                    { !this.props.showSelectBox &&
                        <input
                            type='button'
                            className='btn'
                            style={{ width: '100%', }}
                            onClick={this.handleToggleSelect.bind(this)}
                            value={`${this.citationStyleText} (Click to change)`} />
                    }
                </div>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <label
                        htmlFor='attachInline'
                        style={{ padding: '5px', }}
                        children='Also add inline citation at current cursor position?' />
                    <input
                        type='checkbox'
                        id='attachInline'
                        style={{ padding: '5px', }}
                        checked={this.props.attachInline}
                        onChange={this.handleToggleInlineAttachment.bind(this)} />
                </div>
            </div>
        )
    }
}



interface ActionButtonProps {
    addManually: boolean
    eventHandler: Function
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
            onsubmit: (e: any) => {
                this.props.eventHandler(
                    new CustomEvent(LocalEvents.PUBMED_DATA_SUBMIT, { detail: e.target.data.pmid })
                );
            }
        });
    }

    addManuallyClick() {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.TOGGLE_MANUAL)
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
                    style={{ margin: '0 5px' }}
                    onClick={this.addManuallyClick.bind(this)}
                    type='button'
                    className='btn'
                    value={
                        this.props.addManually === false
                        ? 'Add Reference Manually'
                        : 'Add Reference with PMID'} />
                <input
                    id='searchPubmed'
                    style={{ margin: '0 5px' }}
                    onClick={this.searchPubmedClick.bind(this)}
                    type='button'
                    className='btn'
                    value='Search Pubmed' />
                <span style={{
                    borderRight: 'solid 2px #ccc',
                    height: 25, margin: '0 15px 0 10px',
                }} />
                <input
                    style={{ flexGrow: 1, margin: '0 15px 0 0' }}
                    type='submit'
                    className='submit-btn'
                    value='Insert Reference' />
            </div>
        )
    }

}



interface ManualEntryProps {
    manualData: CSL.Data
    people: CSL.Person[]
    eventHandler: Function
}

class ManualEntryContainer extends React.Component<ManualEntryProps, {}> {

    constructor(props) {
        super(props);
    }

    consumeChildEvents(e: CustomEvent) {
        this.props.eventHandler(e);
    }

    typeChange(e: DOMEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.CHANGE_CITATION_TYPE, {
                detail: e.target.value
            })
        );
    }

    handleMetaChange(e) {
        // let newMeta = Object.assign({}, this.props.manualData);
        // newMeta[this.props.manualData.type][e.target.dataset['metakey']] = e.target.value;
        // this.props.onChange(new CustomEvent('META_CHANGE', { detail: newMeta }));
    }

    render() {
        return (
            <div>
                <ManualSelection
                    value={this.props.manualData.type}
                    onChange={this.typeChange.bind(this)} />
                <People
                    people={this.props.people}
                    eventHandler={this.consumeChildEvents.bind(this)}
                    citationType={this.props.manualData.type}/>
                <MetaFields
                    citationType={this.props.manualData.type}
                    meta={this.props.manualData}
                    onChange={this.consumeChildEvents.bind(this)} />
            </div>
        )
    }
}

const ManualSelection = ({
    value,
    onChange,
}) => {
    const commonStyle = { padding: '5px' };
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={commonStyle}>
                <label
                    htmlFor="type"
                    style={{whiteSpace: 'nowrap'}}
                    children='Select Citation Type' />
            </div>
            <div style={Object.assign({}, commonStyle, {flex: 1})}>
                <select
                    id="type"
                    style={{width: '100%'}}
                    onChange={onChange}
                    value={value} >
                    {
                        CitationTypeArray.map((item, i) => {

                            if (!item.inUse) {
                                return;
                            }

                            return (
                                <option
                                    key={i}
                                    value={item.value}
                                    children={item.label} />
                            )
                        }
                    )}
                </select>
            </div>
        </div>
    )
}



interface PeopleProps {
    people: CSL.Person[]
    eventHandler: Function
    citationType: CSL.CitationType
}

class People extends React.Component<PeopleProps,{}> {

    constructor(props) {
        super(props);
    }

    addPerson() {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.ADD_PERSON)
        );
    }

    removePerson(e: DOMEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.REMOVE_PERSON, {
                detail: parseInt(e.target.dataset['num']),
            })
        );
    }

    onChange(e: DOMEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.PERSON_CHANGE, {
                detail: {
                    index: parseInt(e.target.dataset['num']),
                    field: e.target.dataset['namefield'],
                    value: e.target.value,
                }
            })
        );
    }

    render() {
        return (
            <div>
                <div className='row'>
                    <strong children='Author Name(s)'/>
                </div>
                {this.props.people.map((person: CSL.Person, i: number) =>
                    <div key={`person-list-${i}`} style={{ display: 'flex', alignItems: 'center', }}>
                        <div style={{ padding: '0 5px', }}>
                            <label
                                htmlFor={`person-given-${i}`}
                                style={{whiteSpace: 'nowrap'}}
                                children='First'/>

                        </div>
                        <div style={{ flex: 1, padding: '0 5px', }} >
                            <input
                                type='text'
                                data-namefield='given'
                                data-num={i}
                                style={{ width: '100%', }}
                                pattern='^[a-zA-Z]+$' /** TODO: Fix this pattern */
                                id={`person-given-${i}`}
                                value={person.given}
                                onChange={this.onChange.bind(this)}
                                required={true} />
                        </div>
                        <div style={{ padding: '0 5px', }}>
                            <label
                                htmlFor={`person-family-${i}`}
                                style={{whiteSpace: 'nowrap'}}
                                children='Last'/>
                        </div>
                        <div style={{ flex: 1, padding: '0 5px', }} >
                            <input
                                type='text'
                                data-namefield='family'
                                style={{width: '100%'}}
                                pattern='^[a-zA-Z]+$'
                                data-num={i}
                                id={`person-family-${i}`}
                                value={person.family}
                                onChange={this.onChange.bind(this)}
                                required={true} />
                        </div>
                        <div style={{ padding: '0 5px', }}>
                            <input
                            type='button'
                            className='btn'
                            data-num={i}
                            value='x'
                            onClick={this.removePerson.bind(this)} />
                        </div>
                    </div>
                )}
                <div className='row' style={{textAlign: 'center'}}>
                    <input type='button' className='btn' value='Add Author' onClick={this.addPerson.bind(this)}/>
                </div>
            </div>
        )
    }
}


interface MetaFieldProps {
    citationType: CSL.CitationType
    meta: CSL.Data
    onChange: Function
}

class MetaFields extends React.Component<MetaFieldProps,{}> {

    public fieldMappings = FieldMappings;

    constructor(props) {
        super(props);
    }

    handleChange() {

    }

    render() {
        let title = this.fieldMappings[this.props.citationType].title;
        let relevantFields = this.fieldMappings[this.props.citationType].relevant;
        let labels = this.fieldMappings[this.props.citationType].label;
        return (
            <div>
                <div className='row'>
                    <strong>{title} Information</strong>
                    <span style={{ marginLeft: 5 }} children='(fill out what you can)' />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', }}>
                    {relevantFields.map((fieldname, i: number) =>
                        <div
                            key={`${title}-meta-${i}`}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center', }}>
                            <div style={{ padding: '0 5px', flex: 1, }}>
                                <label
                                    htmlFor={`${title}-${labels[i]}`}
                                    style={{ padding: '5px', }} children={labels[i]} />
                            </div>
                            <div style={{ padding: '0 5px', flex: 2, }}>
                                <input
                                    type='text'
                                    style={{width: '100%'}}
                                    id={`${title}-${labels[i]}`}
                                    data-fieldname={fieldname}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.props.meta[fieldname]} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}


ReactDOM.render(
  <ReferenceWindow />,
  document.getElementById('main-container')
)
