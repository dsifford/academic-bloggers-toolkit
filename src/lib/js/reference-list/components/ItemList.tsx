import * as React from 'react';
import { Card } from './Card';
import { toJS, ObservableMap, action } from 'mobx';
import { observer } from 'mobx-react';
import { editReferenceWindow } from '../../utils/TinymceFunctions';
import { parseManualData } from '../API';
import { preventScrollPropagation } from '../../utils/helpers/';
import { EVENTS } from '../../utils/Constants';

declare const tinyMCE: TinyMCE.MCE;

interface Props extends React.HTMLProps<HTMLElement> {
    readonly items: CSL.Data[];
    readonly selectedItems: string[];
    CSL: ObservableMap<CSL.Data>;
    click: (id: string, isSelected: boolean) => void;
    toggle: (id: string, explode?: boolean) => void;
    isOpen: boolean;
    maxHeight: string;
}

@observer
export class ItemList extends React.PureComponent<Props, {}> {

    singleClick = () => {
        this.props.toggle(this.props.id);
    }

    doubleClick = () => {
        this.props.toggle(this.props.id, true);
    }

    render() {
        const { items, selectedItems, click, children, isOpen, maxHeight, id, CSL } = this.props;
        if (!items) return null;
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
                { isOpen &&
                    <Items
                        click={click}
                        CSL={CSL}
                        id={id}
                        items={items}
                        style={{maxHeight}}
                        selectedItems={selectedItems}
                        withTooltip={id === 'cited'}
                    />
                }
            </div>
        );
    }
}

interface ItemsProps extends React.HTMLProps<HTMLElement> {
    CSL: ObservableMap<CSL.Data>;
    readonly items: CSL.Data[];
    readonly selectedItems: string[];
    readonly withTooltip: boolean;
    readonly click: (id: string, isSelected: boolean) => void;
}

@observer
class Items extends React.Component<ItemsProps, {}> {

    element: HTMLDivElement;
    handleScroll = preventScrollPropagation.bind(this);

    bindRefs = (c: HTMLDivElement) => {
        this.element = c;
    }

    editSingleReference = (e: React.MouseEvent<HTMLDivElement>) => {
        const refId = e.currentTarget.getAttribute('data-reference-id');
        editReferenceWindow(
            tinyMCE.EditorManager.get('content'),
            toJS(this.props.items.find(i => i.id === refId))
        )
        .then(parseManualData)
        .then(m => [refId, m[0]])
        .then(this.finalizeEdits)
        .catch(err => {
            if (!err) return; // User exited early
            Rollbar.error('itemList.tsx -> editSingleReference', err);
        });
    }

    @action
    finalizeEdits = (d: [string, CSL.Data]) => {
        this.props.CSL.delete(d[0]);
        this.props.CSL.set(d[0], d[1]);
        dispatchEvent(new CustomEvent(EVENTS.REFERENCE_EDITED));
    }

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
                {
                    this.props.items.map((r, i) =>
                        <Card
                            CSL={r}
                            click={this.props.click}
                            onDoubleClick={this.editSingleReference}
                            id={r.id}
                            index={`${i + 1}`}
                            isSelected={this.props.selectedItems.indexOf(r.id) > -1}
                            key={r.id}
                            showTooltip={this.props.withTooltip}
                        />
                    )
                }
            </div>
        );
    }
}
