import { action, IObservableArray, IObservableValue, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Callout from 'components/callout';
import AutoCite, { AutociteKind } from './autocite';
import MetaFields from './meta-fields';
import People from './people';

interface ManualEntryProps {
    /** Error message to display in callout. If none, this should be an empty string */
    errorMessage: IObservableValue<string>;
    /** Observable map of `CSL.Data` for manual entry fields */
    manualData: ObservableMap<string>;
    people: IObservableArray<CSL.TypedPerson>;
    /** "Getter" callback for `AutoCite` component */
    onAutoCite(kind: AutociteKind, query: string): void;
    /** Callback with new `CSL.CitationType` to call when type is changed */
    onTypeChange(citationType: CSL.CitationType): void;
}

@observer
export default class ManualEntryContainer extends React.PureComponent<ManualEntryProps, {}> {
    static readonly citationTypes = top.ABT.i18n.citationTypes;
    static readonly labels = top.ABT.i18n.dialogs.add.manualEntryContainer;

    @action
    dismissError = () => {
        this.props.errorMessage.set('');
    };

    focusTypeSelect = (e: HTMLSelectElement | null) => e && e.focus();

    handleTypeChange = (e: React.FormEvent<HTMLSelectElement>) => {
        this.props.onTypeChange(e.currentTarget.value as CSL.CitationType);
    };

    handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = !isScrollingDown;
        const isScrollable = e.currentTarget.scrollHeight > e.currentTarget.clientHeight;
        const atBottom =
            e.currentTarget.scrollHeight <=
            e.currentTarget.clientHeight + Math.ceil(e.currentTarget.scrollTop);
        const atTop = e.currentTarget.scrollTop === 0;

        if (isScrollable && !atBottom && isScrollingDown) {
            e.cancelable = false;
        }

        if (isScrollable && !atTop && isScrollingUp) {
            e.cancelable = false;
        }
    };

    render() {
        const itemType: string = this.props.manualData.get('type')!;
        const renderAutocite: boolean = ['webpage', 'book', 'chapter'].includes(itemType);
        return (
            <div>
                <div id="type-select-row">
                    <label
                        htmlFor="type-select"
                        children={ManualEntryContainer.labels.citationType}
                    />
                    <select
                        id="type-select"
                        ref={this.focusTypeSelect}
                        onChange={this.handleTypeChange}
                        value={itemType}
                    >
                        {ManualEntryContainer.citationTypes.map((item, i) => (
                            <option
                                key={i}
                                value={item.value}
                                aria-selected={itemType === item.value}
                                children={item.label}
                            />
                        ))}
                    </select>
                </div>
                {renderAutocite &&
                    itemType === 'webpage' && (
                        <AutoCite
                            getter={this.props.onAutoCite}
                            kind={itemType as 'webpage'}
                            placeholder={ManualEntryContainer.labels.URL}
                        />
                    )}
                {renderAutocite &&
                    ['book', 'chapter'].includes(itemType) && (
                        <AutoCite
                            getter={this.props.onAutoCite}
                            kind={itemType as 'book' | 'chapter'}
                            placeholder={ManualEntryContainer.labels.ISBN}
                            pattern="(?:[\dxX]-?){10}|(?:[\dxX]-?){13}"
                        />
                    )}
                <div
                    onWheel={this.handleWheel}
                    className={renderAutocite ? 'bounded-rect autocite' : 'bounded-rect'}
                >
                    <Callout
                        children={this.props.errorMessage.get()}
                        onDismiss={this.dismissError}
                    />
                    {this.props.manualData.get('type') !== 'article' && (
                        <People
                            people={this.props.people}
                            citationType={this.props.manualData.get('type') as CSL.CitationType}
                        />
                    )}
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
                        padding: 10px;
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
