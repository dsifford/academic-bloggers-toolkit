import { action, IObservableArray, observable, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { colors, shadows } from 'utils/styles';

import { Spinner } from 'components/Spinner';
import { MetaFields } from './meta-fields';
import { People } from './people';

interface ManualEntryProps {
    loading: boolean;
    manualData: ObservableMap<string>;
    people: IObservableArray<CSL.TypedPerson>;
    autoCite(kind: 'webpage' | 'book' | 'chapter', query: string): void;
    typeChange(citationType: string): void;
}

@observer
export class ManualEntryContainer extends React.PureComponent<ManualEntryProps, {}> {
    static readonly labels = top.ABT_i18n.tinymce.referenceWindow.manualEntryContainer;

    // FIXME: Should this be done server-side?
    citationTypes = top.ABT_i18n.citationTypes.sort((a, b) => {
        const strA = a.label.toUpperCase();
        const strB = b.label.toUpperCase();
        if (strA < strB) return -1;
        if (strA > strB) return 1;
        return 0;
    });

    handleTypeChange = (e: React.FormEvent<HTMLSelectElement>) => {
        this.props.typeChange(e.currentTarget.value);
    };

    handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = !isScrollingDown;
        const isScrollable = e.currentTarget.scrollHeight > e.currentTarget.clientHeight;
        const atBottom =
            e.currentTarget.scrollHeight <=
            e.currentTarget.clientHeight + e.currentTarget.scrollTop;
        const atTop = e.currentTarget.scrollTop === 0;

        if (isScrollable && !atBottom && isScrollingDown) {
            e.cancelable = false;
        }

        if (isScrollable && !atTop && isScrollingUp) {
            e.cancelable = false;
        }
    };

    // FIXME:
    getHeight = () => document.getElementById('abt-root')!.getBoundingClientRect().height;

    render() {
        const itemType: string = this.props.manualData.get('type')!;
        const renderAutocite: boolean = ['webpage', 'book', 'chapter'].indexOf(itemType) > -1;
        return (
            <div>
                {this.props.loading && <Spinner size="40px" overlay />}
                <div id="type-select-row">
                    <label
                        htmlFor="type-select"
                        children={ManualEntryContainer.labels.citationType}
                    />
                    <select id="type-select" onChange={this.handleTypeChange} value={itemType}>
                        {this.citationTypes.map((item, i) =>
                            <option
                                key={i}
                                value={item.value}
                                aria-selected={itemType === item.value}
                                children={item.label}
                            />
                        )}
                    </select>
                </div>
                {renderAutocite &&
                    itemType === 'webpage' &&
                    <AutoCite
                        getter={this.props.autoCite}
                        kind={itemType as 'webpage'}
                        placeholder={ManualEntryContainer.labels.URL}
                        inputType="url"
                    />}
                {renderAutocite &&
                    ['book', 'chapter'].indexOf(itemType) > -1 &&
                    <AutoCite
                        getter={this.props.autoCite}
                        kind={itemType as 'book' | 'chapter'}
                        placeholder={ManualEntryContainer.labels.ISBN}
                        pattern="(?:[\dxX]-?){10}|(?:[\dxX]-?){13}"
                        inputType="text"
                    />}
                <div
                    onWheel={this.handleWheel}
                    className={renderAutocite ? 'bounded-rect autocite' : 'bounded-rect'}
                >
                    {this.props.manualData.get('type') !== 'article' &&
                        <People
                            people={this.props.people}
                            citationType={this.props.manualData.get('type') as CSL.CitationType}
                        />}
                    <MetaFields meta={this.props.manualData} />
                </div>
                <style jsx>{`
                    label {
                        margin-right: 10px;
                    }
                    select {
                        flex: auto;
                    }
                    #type-select-row {
                        display: flex;
                        padding: 0 10px 10px;
                        align-items: center;
                    }
                    .bounded-rect {
                        max-height: calc(100vh - 200px);
                        overflow-y: auto;
                        overflow-x: hidden;
                    }
                    .autocite {
                        max-height: calc(100vh - 250px);
                    }
                `}</style>
            </div>
        );
    }
}

interface AutoCiteProps {
    kind: 'webpage' | 'book' | 'chapter';
    inputType: 'text' | 'url';
    placeholder: string;
    pattern?: string;
    getter(kind: string, query: string): void;
}

@observer
export class AutoCite extends React.Component<AutoCiteProps, {}> {
    static readonly labels = top.ABT_i18n.tinymce.referenceWindow.manualEntryContainer;
    /**
     * Needed for handling the initial focus() of the field
     */
    input: HTMLInputElement;

    @observable query = '';

    @action
    handleAutociteFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.query = e.target.value;
    };

    @action
    handleQuery = () => {
        if (this.query.length === 0 || !this.input.validity.valid) return;
        this.props.getter(this.props.kind, this.query);
        this.query = '';
    };

    handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Return') {
            e.stopPropagation();
            e.preventDefault();
            this.handleQuery();
        }
    };

    bindRefs = (c: HTMLInputElement) => {
        this.input = c;
    };

    componentDidMount() {
        this.input.focus();
    }

    render() {
        const { placeholder, inputType } = this.props;
        return (
            <div id="autocite" className="row">
                <label htmlFor="citequery" children={AutoCite.labels.autocite} />
                <input
                    type={inputType}
                    id="citequery"
                    placeholder={placeholder}
                    pattern={this.props.pattern ? this.props.pattern : undefined}
                    ref={this.bindRefs}
                    value={this.query}
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleAutociteFieldChange}
                />
                <input
                    type="button"
                    aria-label={AutoCite.labels.search}
                    className={
                        this.query.length === 0 || !this.input.validity.valid
                            ? 'abt-btn abt-btn_flat abt-btn_disabled'
                            : 'abt-btn abt-btn_flat'
                    }
                    value={AutoCite.labels.search}
                    onClick={this.handleQuery}
                />
                <style jsx>{`
                    div {
                        display: flex;
                        padding: 10px;
                        align-items: center;
                        background: ${colors.light_gray};
                        box-shadow: ${shadows.depth_1}, ${shadows.top_border};
                    }
                    #citequery {
                        margin: 0 10px;
                        flex: auto;
                        height: 28px;
                        font-size: 14px;
                    }
                `}</style>
            </div>
        );
    }
}
