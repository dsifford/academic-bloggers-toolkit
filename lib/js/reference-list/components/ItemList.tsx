import * as React from 'react';
import { Card } from './Card';
import { observer } from 'mobx-react'

interface Props extends React.HTMLProps<HTMLElement> {
    readonly items: CSL.Data[];
    readonly selectedItems: string[];
    readonly click: (id: string, isSelected: boolean) => any;
    readonly startVisible: boolean;
}

interface State {
    readonly showList: boolean;
}

@observer
export class ItemList extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            showList: this.props.startVisible,
        };
    }

    toggle = () => {
        this.setState(
            Object.assign({}, this.state, {
                showList: !this.state.showList,
            })
        );
    }

    render() {
        const { items, selectedItems, click, children, className } = this.props;
        if (!items) return;
        return (
            <div>
                <div className='group-label' onClick={this.toggle}>
                    <div children={children} />
                    <div className='badge' children={items.length} />
                </div>
                { this.state.showList &&
                    <Items className={className} items={items} selectedItems={selectedItems} click={click} />
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
class Items extends React.Component<ItemsProps,{}> {
    render() {
        return (
            <div className={this.props.className}>
                {
                    this.props.items.map(r =>
                        <Card
                            key={r.id}
                            CSL={r}
                            isSelected={this.props.selectedItems.indexOf(r.id) > -1}
                            id={r.id}
                            click={this.props.click} />
                    )
                }
            </div>
        );
    }
}
