import { action, IObservableArray, IObservableValue, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Badge from 'components/badge';
import Item from '../item';

import * as styles from './item-list.scss';

interface UI {
    cited: {
        readonly maxHeight: IObservableValue<string>;
        isOpen: IObservableValue<boolean>;
    };
    uncited: {
        readonly maxHeight: IObservableValue<string>;
        isOpen: IObservableValue<boolean>;
    };
    readonly [k: string]: any;
}

interface Props {
    readonly children: string;
    readonly id: 'cited' | 'uncited';
    readonly items?: CSL.Data[];
    CSL: ObservableMap<CSL.Data>;
    selectedItems: IObservableArray<string>;
    ui: UI;
    onEditReference(referenceId: string): void;
}

@observer
export default class ItemList extends React.Component<Props> {
    @action
    doubleClick = (): void => {
        this.props.ui.cited.isOpen.set(false);
        this.props.ui.uncited.isOpen.set(false);
        this.props.ui[this.props.id].isOpen.set(true);
    };

    @action
    singleClick = (): void => {
        this.props.ui[this.props.id].isOpen.set(!this.props.ui[this.props.id].isOpen.get());
    };

    @action
    toggleSelect = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.shiftKey && this.props.selectedItems.length > 0) {
            return this.shiftSelect(e.currentTarget.id);
        }
        this.props.selectedItems.remove(e.currentTarget.id) ||
            this.props.selectedItems.push(e.currentTarget.id);
    };

    @action
    editSingleReference = (e: React.MouseEvent<HTMLDivElement>): void => {
        const referenceId = e.currentTarget.id;
        this.props.onEditReference(referenceId);
    };

    handleScroll = (e: React.WheelEvent<HTMLDivElement>): void => {
        e.stopPropagation();
        const atTopAndScrollingUp: boolean = e.currentTarget.scrollTop === 0 && e.deltaY < 0;
        const atBottomAndScollingDown: boolean =
            Math.floor(e.currentTarget.scrollTop + e.currentTarget.offsetHeight) ===
                e.currentTarget.scrollHeight && e.deltaY > 0;
        if (atTopAndScrollingUp || atBottomAndScollingDown) {
            e.preventDefault();
        }
    };

    render(): JSX.Element | null {
        const { children, id, items, selectedItems, ui } = this.props;
        if (!items || items.length === 0) return null;
        return (
            <div>
                <div
                    className={styles.heading}
                    role="menubar"
                    onClick={this.singleClick}
                    onDoubleClick={this.doubleClick}
                >
                    <span>{children}</span>
                    <Badge count={items.length} />
                </div>
                {ui[id].isOpen.get() && (
                    <div
                        onWheel={this.handleScroll}
                        id={this.props.id}
                        className="abt-items"
                        style={{
                            maxHeight: ui[id].maxHeight.get(),
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            transition: '.2s',
                        }}
                    >
                        {items.map((r, i) => (
                            <Item
                                key={r.id}
                                id={r.id}
                                CSL={r}
                                onClick={this.toggleSelect}
                                onDoubleClick={this.editSingleReference}
                                index={i + 1}
                                isSelected={selectedItems.includes(r.id)}
                                indexOnHover={id === 'cited'}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    @action
    private shiftSelect = (id: string): void => {
        const { selectedItems } = this.props;
        // existence of items is already checked in calling function
        const items = this.props.items!;
        const lastId = selectedItems[selectedItems.length - 1];
        const lastIndex = items.findIndex(i => i.id === lastId);
        const thisIndex = items.findIndex(i => i.id === id);
        const idsToBeSelected = [
            ...items
                .filter(
                    (_, i) =>
                        lastIndex < thisIndex
                            ? lastIndex < i && i < thisIndex
                            : thisIndex < i && i < lastIndex,
                )
                .map(item => item.id),
            id,
        ];
        for (const i of idsToBeSelected) {
            if (!selectedItems.includes(i)) {
                selectedItems.push(i);
            }
        }
    };
}
