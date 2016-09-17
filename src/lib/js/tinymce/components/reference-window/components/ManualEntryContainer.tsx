import * as React from 'react';
import { observable, ObservableMap, action } from 'mobx';
import { observer } from 'mobx-react';
import { preventScrollPropagation } from '../../../../utils/HelperFunctions';

import { People } from './People';
import { MetaFields } from './MetaFields';
import { Spinner } from '../../../../components/Spinner';

interface ManualEntryProps {
    loading: boolean;
    manualData: ObservableMap<string>;
    people: CSL.TypedPerson[];
    autoCite(kind: 'webpage'|'book'|'chapter', query: string): void;
    addPerson(): void;
    changePerson(index: string, field: string, value: string): void;
    removePerson(index: string): void;
    typeChange(value: string): void;
}

@observer
export class ManualEntryContainer extends React.PureComponent<ManualEntryProps, {}> {

    label = (top as any).ABT_i18n.tinymce.referenceWindow.manualEntryContainer.type;
    citationTypes = (top as any).ABT_i18n.citationTypes as ABT.CitationTypes;
    element: HTMLElement;
    handleWheel = preventScrollPropagation.bind(this);

    bindRefs = (c: HTMLDivElement) => {
        this.element = c;
    }

    handleTypeChange = (e) => {
        e.preventDefault();
        this.props.typeChange((e.target as HTMLInputElement).value);
    }

    getHeight() {
        return document.getElementById('main-container').getBoundingClientRect().height;
    }

    render() {
        const itemType: string = this.props.manualData.get('type');
        const renderAutocite: boolean = ['webpage', 'book', 'chapter'].indexOf(itemType) > -1;
        return (
            <div>
                { this.props.loading &&
                    <Spinner size="40px" height={this.getHeight} overlay />
                }
                <div id="type-select-row" className="row">
                    <div>
                        <label htmlFor="type-select" children={this.label} />
                    </div>
                    <div className="flex">
                        <select
                            id="type-select"
                            onChange={this.handleTypeChange}
                            value={itemType}
                        >
                            { this.citationTypes.map((item, i) =>
                                <option key={i} value={item.value} children={item.label}/>)
                            }
                        </select>
                    </div>
                </div>
                { renderAutocite && itemType === 'webpage' &&
                    <AutoCite
                        getter={this.props.autoCite}
                        kind={itemType as 'webpage'}
                        placeholder="URL"
                        type="url"
                    />
                }
                { renderAutocite && ['book', 'chapter'].indexOf(itemType) > -1 &&
                    <AutoCite
                        getter={this.props.autoCite}
                        kind={itemType as 'book'|'chapter'}
                        placeholder="ISBN"
                        pattern="(?:[\dxX]-?){10}|(?:[\dxX]-?){13}"
                        type="text"
                    />
                }
                <div
                    className={renderAutocite ? 'abt-scroll-y autocite' : 'abt-scroll-y'}
                    ref={this.bindRefs}
                    onWheel={this.handleWheel}
                >
                { this.props.manualData.get('type') !== 'article' &&
                    <People
                        people={this.props.people}
                        changePerson={this.props.changePerson}
                        addPerson={this.props.addPerson}
                        removePerson={this.props.removePerson}
                        citationType={this.props.manualData.get('type') as CSL.CitationType}
                    />
                }
                    <MetaFields meta={this.props.manualData} />
                </div>
            </div>
        );
    }
}

interface AutoCiteProps {
    kind: 'webpage'|'book'|'chapter';
    type: 'text'|'url';
    placeholder: string;
    pattern?: string;
    getter(kind: string, query: string): void;
}

@observer
export class AutoCite extends React.Component<AutoCiteProps, {}> {

    @observable
    query = '';

    /**
     * Needed for handling the initial focus() of the field
     */
    input: HTMLInputElement;

    @action
    handleAutociteFieldChange = (e) => {
        this.query = e.target.value;
    }

    @action
    handleQuery = () => {
        if (this.query.length === 0) return;
        this.props.getter(this.props.kind, this.query);
        this.query = '';
    }

    bindRefs = (c: HTMLInputElement) => {
        this.input = c;
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === 'Return') {
            e.stopPropagation();
            e.preventDefault();
            this.handleQuery();
        }
    }

    componentDidMount() {
        this.input.focus();
    }

    render() {
        const { placeholder, type } = this.props;
        return (
            <div id="autocite" className="row">
                <div>
                    <label htmlFor="citequery" children="Autocite" />
                </div>
                <div className="flex">
                    <input
                        type={type}
                        id="citequery"
                        placeholder={placeholder}
                        pattern={this.props.pattern ? this.props.pattern : null}
                        ref={this.bindRefs}
                        value={this.query}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleAutociteFieldChange}
                    />
                </div>
                <div>
                    <input
                        type="button"
                        className="abt-btn abt-btn-flat"
                        aria-label="Search"
                        disabled={this.query.length === 0 || (this.input.validity ? !this.input.validity.valid : true)}
                        value="Search"
                        onClick={this.handleQuery}
                    />
                </div>
            </div>
        );
    }
}
