import { dispatch } from '@wordpress/data';
import { Component } from '@wordpress/element';

import SidebarItem from './sidebar-item';

import styles from './sidebar-item-list.scss';

interface Props {
    items: ReadonlyArray<CSL.Data>;
    selectedItems: ReadonlyArray<string>;
}

export default class SidebarItemList extends Component<Props> {
    render() {
        const { items, selectedItems } = this.props;
        return (
            <div
                className={styles.list}
                role="listbox"
                aria-multiselectable={true}
            >
                {items.map(item => (
                    <SidebarItem
                        key={item.id}
                        isSelected={selectedItems.includes(item.id)}
                        item={item}
                        onClick={this.handleClick}
                    />
                ))}
            </div>
        );
    }

    private handleClick = (id: string) => {
        dispatch('abt/ui').toggleItemSelected(id);
    };
}
