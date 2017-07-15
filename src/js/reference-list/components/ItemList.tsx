import { action, IObservableArray, IObservableObject, ObservableMap, /*toJS*/ } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { EVENTS } from 'utils/Constants';
import { preventScrollPropagation } from 'utils/helpers/';
// import { parseManualData } from '../API';

import { Card } from './Card';

interface Props {
    readonly items: CSL.Data[];
    readonly id: string;
    readonly ui: {
        readonly isOpen: boolean;
        readonly maxHeight: string;
    } & IObservableObject;
    readonly children: string;
    selectedItems: IObservableArray<string>;
    CSL: ObservableMap<CSL.Data>;
    toggle(id: string, explode?: boolean): void;
}

@observer
export class ItemList extends React.PureComponent<Props, {}> {
    singleClick = () => {
        this.props.toggle(this.props.id);
    };

    doubleClick = () => {
        this.props.toggle(this.props.id, true);
    };

    @action
    toggleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
        this.props.selectedItems.remove(e.currentTarget.id) ||
            this.props.selectedItems.push(e.currentTarget.id);
    };

    render() {
        const { items, selectedItems, children, ui, id, CSL } = this.props;
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
                {ui.isOpen &&
                    <Items
                        onClick={this.toggleSelect}
                        CSL={CSL}
                        id={id}
                        items={items}
                        style={{ maxHeight: ui.maxHeight }}
                        selectedItems={selectedItems}
                        withTooltip={id === 'cited'}
                    />}
            </div>
        );
    }
}

interface ItemsProps extends React.HTMLProps<HTMLElement> {
    CSL: ObservableMap<CSL.Data>;
    readonly items: CSL.Data[];
    readonly selectedItems: string[];
    readonly withTooltip: boolean;
}

@observer
class Items extends React.Component<ItemsProps, {}> {
    element: HTMLDivElement;
    handleScroll = preventScrollPropagation.bind(this);

    bindRefs = (c: HTMLDivElement) => {
        this.element = c;
    };

    // FIXME:
    editSingleReference = (e: React.MouseEvent<HTMLDivElement>) => {
        // tslint:disable-next-line:no-console
        console.log(e);
        return;
        // const refId = e.currentTarget.id;
        // let data: ABT.ManualData = {};
        // try {
        //     data = {}
        //     // data = await editReferenceWindow(
        //     //     tinyMCE.EditorManager.get('content'),
        //     //     toJS(this.props.items.find(i => i.id === refId)!)
        //     // );
        // } catch (e) {
        //     if (!e) return; // user exited early
        //     return Rollbar.error('itemList.tsx -> editSingleReference', e);
        // }

        // const csl = await parseManualData(data);
        // return this.finalizeEdits([refId, csl[0]]);
    };

    @action
    finalizeEdits = (d: [string, CSL.Data]) => {
        this.props.CSL.delete(d[0]);
        this.props.CSL.set(d[0], d[1]);
        dispatchEvent(new CustomEvent(EVENTS.REFERENCE_EDITED));
    };

    render() {
        return (
            <div
                ref={this.bindRefs}
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
