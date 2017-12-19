import { action, IObservableArray, IObservableValue, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Callout from 'components/callout';
import AutoCite, { AutociteKind } from 'dialogs/add/autocite';
import ContributorList from 'dialogs/components/contributor-list';
import MetaFields from 'dialogs/components/meta-fields';

import * as styles from './manual-input.scss';

interface Props {
    /** Error message to display in callout. If none, this should be an empty string */
    errorMessage: IObservableValue<string>;
    /** Observable map of `CSL.Data` for manual entry fields */
    manualData: ObservableMap<string>;
    people: IObservableArray<ABT.Contributor>;
    /** "Getter" callback for `AutoCite` component */
    onAutoCite(kind: AutociteKind, query: string): void;
    /** Callback with new `CSL.ItemType` to call when type is changed */
    onTypeChange(citationType: CSL.ItemType): void;
}

@observer
export default class ManualInput extends React.Component<Props> {
    static readonly citationTypes = top.ABT.i18n.citationTypes;
    static readonly labels = top.ABT.i18n.dialogs.add.manualEntryContainer;

    @action
    dismissError = (): void => {
        this.props.errorMessage.set('');
    };

    focusTypeSelect = (e: HTMLSelectElement | null): void => (e ? e.focus() : void 0);

    handleTypeChange = (e: React.FormEvent<HTMLSelectElement>): void => {
        this.props.onTypeChange(e.currentTarget.value as CSL.ItemType);
    };

    handleWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
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

    render(): JSX.Element {
        const itemType: string = this.props.manualData.get('type')!;
        const renderAutocite: boolean = ['webpage', 'book', 'chapter'].includes(itemType);
        return (
            <>
                <div className={styles.typeSelect}>
                    <label
                        className={styles.label}
                        htmlFor="type-select"
                        children={ManualInput.labels.citationType}
                    />
                    <select
                        id="type-select"
                        className={styles.select}
                        ref={this.focusTypeSelect}
                        onChange={this.handleTypeChange}
                        value={itemType}
                    >
                        {ManualInput.citationTypes.map((item, i) => (
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
                            placeholder={ManualInput.labels.URL}
                        />
                    )}
                {renderAutocite &&
                    ['book', 'chapter'].includes(itemType) && (
                        <AutoCite
                            getter={this.props.onAutoCite}
                            kind={itemType as 'book' | 'chapter'}
                            placeholder={ManualInput.labels.ISBN}
                            pattern="(?:[\dxX]-?){10}|(?:[\dxX]-?){13}"
                        />
                    )}
                <div
                    onWheel={this.handleWheel}
                    className={
                        renderAutocite ? styles.scrollBoundaryAutocite : styles.scrollBoundary
                    }
                >
                    <Callout
                        children={this.props.errorMessage.get()}
                        onDismiss={this.dismissError}
                    />
                    {this.props.manualData.get('type') !== 'article' && (
                        <ContributorList
                            people={this.props.people}
                            citationType={
                                this.props.manualData.get('type') as keyof ABT.FieldMappings
                            }
                        />
                    )}
                    <MetaFields meta={this.props.manualData} />
                </div>
            </>
        );
    }
}
