import { action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Store from 'stores/ui/add-dialog';

import Callout from 'components/callout';
import AutoCite, { AutociteKind } from 'dialogs/add/autocite';
import ContributorList from 'dialogs/components/contributor-list';
import MetaFields from 'dialogs/components/meta-fields';

import * as styles from './manual-input.scss';

interface Props {
    store: Store;
    /** "Getter" callback for `AutoCite` component */
    onAutoCite(kind: AutociteKind, query: string): void;
}

@observer
export default class ManualInput extends React.Component<Props> {
    static readonly citationTypes = top.ABT.i18n.citationTypes;
    static readonly labels = top.ABT.i18n.dialogs.add.manualEntryContainer;

    focusTypeSelect = (e: HTMLSelectElement | null): void => (e ? e.focus() : void 0);

    @action
    dismissError = (): void => {
        this.props.store.errorMessage = '';
    };

    @action
    handleTypeChange = (e: React.FormEvent<HTMLSelectElement>): void => {
        this.props.store.data.init(e.currentTarget.value as CSL.ItemType);
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
        const { store } = this.props;
        const itemType = store.data.citationType;
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
                        children={this.props.store.errorMessage}
                        onDismiss={this.dismissError}
                    />
                    {itemType !== 'article' && (
                        <ContributorList people={store.data.people} citationType={itemType} />
                    )}
                    <MetaFields meta={this.props.store.data} />
                </div>
            </>
        );
    }
}
