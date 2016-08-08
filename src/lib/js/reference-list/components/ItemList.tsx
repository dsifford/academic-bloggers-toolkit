import * as React from 'react';
import { Card } from './Card';
import { observer } from 'mobx-react';

interface Props extends React.HTMLProps<HTMLElement> {
    readonly items: CSL.Data[];
    readonly selectedItems: string[];
    readonly click: (id: string, isSelected: boolean) => any;
    toggle: any;
    isOpen: boolean;
    maxHeight: string;
}

@observer
export class ItemList extends React.Component<Props, {}> {

    constructor(props) { super(props) }

    singleClick = () => {
        this.props.toggle(this.props.id);
    }

    doubleClick = () => {
        this.props.toggle(this.props.id, true);
    }

    render() {
        const { items, selectedItems, click, children, className, isOpen, maxHeight, id } = this.props;
        if (!items) return;
        return (
            <div>
                <div className="group-label" onClick={this.singleClick} onDoubleClick={this.doubleClick}>
                    <div children={children} />
                    <div className="badge" children={items.length} />
                </div>
                { isOpen &&
                    <Items
                        id={id}
                        className={className}
                        style={{maxHeight: maxHeight}}
                        items={items}
                        selectedItems={selectedItems}
                        click={click}
                    />
                }
            </div>
        );
    }
}

interface ItemsProps extends React.HTMLProps<HTMLElement> {
    readonly items: CSL.Data[];
    readonly selectedItems: string[];
    readonly click: (id: string, isSelected: boolean) => any;
}

@observer
class Items extends React.Component<ItemsProps, {}> {
    render() {
        return (
            <div
                id={this.props.id}
                className={this.props.className}
                style={this.props.style}
            >
                {
                    this.props.items.map(r =>
                        <Card
                            key={r.id}
                            CSL={r}
                            isSelected={this.props.selectedItems.indexOf(r.id) > -1}
                            id={r.id}
                            click={this.props.click}
                        />
                    )
                }
            </div>
        );
    }
}
