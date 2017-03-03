import { action, IObservableArray, observable, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { preventScrollPropagation } from '../../../../utils/helpers/';

import { Spinner } from '../../../../components/Spinner';
import { MetaFields } from './MetaFields';
import { People } from './People';

interface ManualEntryProps {
    loading: boolean;
    manualData: ObservableMap<string>;
    people: IObservableArray<CSL.TypedPerson>;
    autoCite(kind: 'webpage'|'book'|'chapter', query: string): void;
    typeChange(citationType: string): void;
}

@observer
export class ManualEntryContainer extends React.PureComponent<ManualEntryProps, {}> {

    labels = top.ABT_i18n.tinymce.referenceWindow.manualEntryContainer;
    citationTypes = top.ABT_i18n.citationTypes.sort((a, b) => {
        const strA = a.label.toUpperCase();
        const strB = b.label.toUpperCase();
        if (strA < strB) return -1;
        if (strA > strB) return 1;
        return 0;
    });
    element: HTMLElement;
    handleWheel = preventScrollPropagation.bind(this);

    bindRefs = (c: HTMLDivElement) => {
        this.element = c;
    }

    handleTypeChange = (e: React.FormEvent<HTMLSelectElement>) => {
        this.props.typeChange(e.currentTarget.value);
    }

    getHeight = () => document.getElementById('abt-root').getBoundingClientRect().height;

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
                        <label htmlFor="type-select" children={this.labels.citationType} />
                    </div>
                    <div className="flex">
                        <select
                            id="type-select"
                            onChange={this.handleTypeChange}
                            value={itemType}
                        >
                            { this.citationTypes.map((item, i) => (
                                <option
                                    key={i}
                                    value={item.value}
                                    aria-selected={itemType === item.value}
                                    children={item.label}
                                />
                            ))}
                        </select>
                    </div>
                </div>
                { renderAutocite && itemType === 'webpage' && (
                    <AutoCite
                        getter={this.props.autoCite}
                        kind={itemType as 'webpage'}
                        placeholder={this.labels.URL}
                        inputType="url"
                    />
                )}
                { renderAutocite && ['book', 'chapter'].indexOf(itemType) > -1 && (
                    <AutoCite
                        getter={this.props.autoCite}
                        kind={itemType as 'book'|'chapter'}
                        placeholder={this.labels.ISBN}
                        pattern="(?:[\\dxX]-?){10}|(?:[\\dxX]-?){13}"
                        inputType="text"
                    />
                )}
                <div
                    className={renderAutocite ? 'abt-scroll-y autocite' : 'abt-scroll-y'}
                    ref={this.bindRefs}
                    onWheel={this.handleWheel}
                >
                { this.props.manualData.get('type') !== 'article' && (
                    <People
                        people={this.props.people}
                        citationType={this.props.manualData.get('type') as CSL.CitationType}
                    />
                )}
                    <MetaFields meta={this.props.manualData} />
                </div>
            </div>
        );
    }
}

interface AutoCiteProps {
    kind: 'webpage'|'book'|'chapter';
    inputType: 'text'|'url';
    placeholder: string;
    pattern?: string;
    getter(kind: string, query: string): void;
}

@observer
export class AutoCite extends React.Component<AutoCiteProps, {}> {

    /**
     * Needed for handling the initial focus() of the field
     */
    input: HTMLInputElement;
    labels = top.ABT_i18n.tinymce.referenceWindow.manualEntryContainer;

    @observable
    query = '';

    @action
    handleAutociteFieldChange = (e) => {
        this.query = e.target.value;
    }

    @action
    handleQuery = () => {
        if (this.query.length === 0 || !this.input.validity.valid) return;
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
        const { placeholder, inputType } = this.props;
        return (
            <div id="autocite" className="row">
                <div>
                    <label htmlFor="citequery" children={this.labels.autocite} />
                </div>
                <div className="flex">
                    <input
                        type={inputType}
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
                        aria-label={this.labels.search}
                        className={
                            this.query.length === 0 || !this.input.validity.valid
                            ? 'abt-btn abt-btn_flat abt-btn_disabled'
                            : 'abt-btn abt-btn_flat'
                        }
                        value={this.labels.search}
                        onClick={this.handleQuery}
                    />
                </div>
            </div>
        );
    }
}
