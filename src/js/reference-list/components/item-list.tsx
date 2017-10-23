import { action, IObservableArray, IObservableValue, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { colors, shadows, transitions } from 'utils/styles';

import Badge from 'components/badge';
import Card from './card';

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
        this.props.selectedItems.remove(e.currentTarget.id) ||
            this.props.selectedItems.push(e.currentTarget.id);
    };

    render(): JSX.Element | null {
        const { CSL, children, id, items, onEditReference, selectedItems, ui } = this.props;
        if (!items || items.length === 0) return null;
        return (
            <div>
                <div
                    className="item-list-heading"
                    role="menubar"
                    onClick={this.singleClick}
                    onDoubleClick={this.doubleClick}
                >
                    <div className="item-list-heading__label" children={children} />
                    <Badge count={items.length} />
                </div>
                {ui[id].isOpen.get() && (
                    <Items
                        items={items}
                        selectedItems={selectedItems}
                        withTooltip={id === 'cited'}
                        CSL={CSL}
                        onEditReference={onEditReference}
                        id={id}
                        style={{ maxHeight: ui[id].maxHeight.get() }}
                        onClick={this.toggleSelect}
                    />
                )}
                <style jsx>{`
                    .item-list-heading {
                        display: flex;
                        justify-content: space-between;
                        cursor: pointer;
                        background: ${colors.light_gray};
                        box-shadow: ${shadows.depth_1}, ${shadows.top_border};
                        padding: 10px;
                        transition: ${transitions.buttons};
                        align-items: baseline;
                        user-select: none;
                    }
                    .item-list-heading:hover {
                        background: ${colors.light_gray.darken(3)};
                    }
                    .item-list-heading:active {
                        background: ${colors.light_gray.darken(8)};
                    }
                `}</style>
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
export class Items extends React.Component<ItemsProps, {}> {
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

    render(): JSX.Element {
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
                {this.props.items.map((r, i) => (
                    <Card
                        key={r.id}
                        id={r.id}
                        CSL={r}
                        onClick={this.props.onClick}
                        onDoubleClick={this.editSingleReference}
                        index={i + 1}
                        isSelected={this.props.selectedItems.includes(r.id)}
                        indexOnHover={this.props.withTooltip}
                    />
                ))}
            </div>
        );
    }
}
