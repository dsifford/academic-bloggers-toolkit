import { action, IObservableArray, IObservableObject, IObservableValue, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Card } from './Card';

interface UI {
    cited: {
        readonly maxHeight: string;
        isOpen: IObservableValue<boolean>;
    } & IObservableObject;
    uncited: {
        readonly maxHeight: string;
        isOpen: IObservableValue<boolean>;
    } & IObservableObject;
    readonly [k: string]: any;
}

interface Props {
    readonly items: CSL.Data[];
    readonly id: 'cited' | 'uncited';
    readonly children: string;
    ui: UI;
    selectedItems: IObservableArray<string>;
    CSL: ObservableMap<CSL.Data>;
    onEditReference(referenceId: string): void;
}

@observer
export class ItemList extends React.PureComponent<Props> {
    @action
    singleClick = () => {
        this.props.ui[this.props.id].isOpen.set(!this.props.ui[this.props.id].isOpen.get());
    };

    @action
    doubleClick = () => {
        this.props.ui.cited.isOpen.set(false);
        this.props.ui.uncited.isOpen.set(false);
        this.props.ui[this.props.id].isOpen.set(true);
    };

    @action
    toggleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
        this.props.selectedItems.remove(e.currentTarget.id) ||
            this.props.selectedItems.push(e.currentTarget.id);
    };

    render() {
        const { CSL, children, id, items, onEditReference, selectedItems, ui } = this.props;
        if (!items || items.length === 0) return null;
        return (
            <div>
                <div
                    className="abt-item-heading"
                    role="menubar"
                    onClick={this.singleClick}
                    onDoubleClick={this.doubleClick}
                >
                    <div className="abt-item-heading__label" children={children} />
                    <div className="abt-item-heading__badge" children={items.length} />
                </div>
                {ui[id].isOpen.get() &&
                    <Items
                        items={items}
                        selectedItems={selectedItems}
                        withTooltip={id === 'cited'}
                        CSL={CSL}
                        onEditReference={onEditReference}
                        id={id}
                        style={{ maxHeight: ui.maxHeight }}
                        onClick={this.toggleSelect}
                    />}
            </div>
        );
    }
}

interface ItemsProps extends React.HTMLProps<HTMLElement> {
    readonly items: CSL.Data[];
    readonly selectedItems: string[];
    readonly withTooltip: boolean;
    CSL: ObservableMap<CSL.Data>;
    onEditReference(referenceId: string): void;
}

@observer
class Items extends React.Component<ItemsProps, {}> {
    handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const atTopAndScrollingUp: boolean = e.currentTarget.scrollTop === 0 && e.deltaY < 0;
        const atBottomAndScollingDown: boolean =
            Math.floor(e.currentTarget.scrollTop + e.currentTarget.offsetHeight) ===
                e.currentTarget.scrollHeight && e.deltaY > 0;
        if (atTopAndScrollingUp || atBottomAndScollingDown) {
            e.preventDefault();
        }
    };

    @action
    editSingleReference = (e: React.MouseEvent<HTMLDivElement>) => {
        const referenceId = e.currentTarget.id;
        this.props.onEditReference(referenceId);
    };

    render() {
        return (
            <div
                onWheel={this.handleScroll}
                id={this.props.id}
                className="abt-items"
                style={{
                    ...this.props.style,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    transition: '.2s',
                }}
            >
                {this.props.items.map((r, i) =>
                    <Card
                        key={r.id}
                        id={r.id}
                        CSL={r}
                        onClick={this.props.onClick}
                        onDoubleClick={this.editSingleReference}
                        index={`${i + 1}`}
                        isSelected={this.props.selectedItems.indexOf(r.id!) > -1}
                        showTooltip={this.props.withTooltip}
                    />
                )}
            </div>
        );
    }
}
