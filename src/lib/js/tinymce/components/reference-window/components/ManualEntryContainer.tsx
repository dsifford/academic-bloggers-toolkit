import * as React from 'react';
import { observable, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';

import { People } from './People';
import { MetaFields } from './MetaFields';
import { Spinner } from '../../../../components/Spinner';

interface ManualEntryProps {
    loading: boolean;
    manualData: ObservableMap<string>;
    people: CSL.TypedPerson[];
    autoCite(query: string): void;
    addPerson(): void;
    changePerson(index: string, field: string, value: string): void;
    removePerson(index: string): void;
    typeChange(value: string): void;
}

@observer
export class ManualEntryContainer extends React.Component<ManualEntryProps, {}> {

    label = (top as any).ABT_i18n.tinymce.referenceWindow.manualEntryContainer.type;
    citationTypes = (top as any).ABT_i18n.citationTypes as ABT.CitationTypes;

    handleTypeChange = (e) => {
        e.preventDefault();
        this.props.typeChange((e.target as HTMLInputElement).value);
    }

    render() {
        return (
            <div>
                { this.props.loading &&
                    <Spinner size="40px" overlay />
                }
                <div id="type-select-row" className="row">
                    <div>
                        <label htmlFor="type-select" children={this.label} />
                    </div>
                    <div className="flex">
                        <select
                            id="type-select"
                            onChange={this.handleTypeChange}
                            value={this.props.manualData.get('type')}
                        >
                            { this.citationTypes.map((item, i) =>
                                <option key={i} value={item.value} children={item.label}/>)
                            }
                        </select>
                    </div>
                </div>
                { this.props.manualData.get('type') === 'webpage' &&
                    <AutoCite getter={this.props.autoCite} />
                }
                <People
                    people={this.props.people}
                    changePerson={this.props.changePerson}
                    addPerson={this.props.addPerson}
                    removePerson={this.props.removePerson}
                    citationType={this.props.manualData.get('type') as CSL.CitationType}
                />
                <MetaFields
                    meta={this.props.manualData}
                />
            </div>
        );
    }
}

interface AutoCiteProps {
    getter(query: string): void;
}

@observer
class AutoCite extends React.Component<AutoCiteProps, {}> {

    @observable
    query = '';

    /**
     * Needed for handling the initial focus() of the field
     */
    input: HTMLInputElement;

    componentDidMount() {
        this.input.focus();
    }

    bindRefs = (c: HTMLInputElement) => {
        this.input = c;
    }

    handleChange = (e) => {
        this.query = e.target.value;
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === 'Return') {
            e.stopPropagation();
            e.preventDefault();
            this.handleQuery();
        }
    }

    handleQuery = () => {
        if (this.query.length === 0) return;
        this.props.getter(this.query);
        this.query = '';
    }

    render() {
        return (
            <div id="autocite" className="row">
                <div>
                    <label htmlFor="citequery" children="Autocite" />
                </div>
                <div className="flex">
                    <input
                        type="url"
                        id="citequery"
                        placeholder="URL"
                        ref={this.bindRefs}
                        value={this.query}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleChange}
                    />
                </div>
                <div>
                    <input
                        type="button"
                        className="btn"
                        aria-label="Search"
                        disabled={this.query.length === 0}
                        value="Search"
                        onClick={this.handleQuery}
                    />
                </div>
            </div>
        );
    }
}
