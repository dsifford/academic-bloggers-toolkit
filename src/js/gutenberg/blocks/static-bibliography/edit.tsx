import { BlockEditProps } from '@wordpress/blocks';
import {
    IconButton,
    PanelBody,
    Placeholder,
    Toolbar,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { select as globalSelect, withSelect } from '@wordpress/data';
import {
    BlockFormatControls,
    InspectorControls,
    RichText,
} from '@wordpress/editor';
import { Component, ComponentType } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import CountIcon from 'gutenberg/components/count-icon';
import SidebarItemList from 'gutenberg/components/sidebar-item-list';
import { localeCache, styleCache } from 'utils/cache';
import { swapWith } from 'utils/data';
import Processor from 'utils/processor';

import { stripListItem } from '../';
import { Attributes } from './';
import styles from './style.scss';

namespace Edit {
    export interface SelectProps {
        readonly references: ReadonlyArray<CSL.Data>;
    }
    export type OwnProps = BlockEditProps<Attributes>;
    export type Props = OwnProps & SelectProps;
}
class Edit extends Component<Edit.Props> {
    render() {
        const {
            attributes: { items, orderedList },
            isSelected,
            references,
            setAttributes,
        } = this.props;
        const ListTag = orderedList ? 'ol' : 'ul';
        return (
            <>
                <InspectorControls>
                    <PanelBody>
                        {__(
                            'Double click on one or more items in the list below to insert them into the end of the list.',
                            'academic-bloggers-toolkit',
                        )}
                        <PanelBody
                            icon={<CountIcon count={references.length} />}
                            initialOpen={false}
                            title={__(
                                'Available References',
                                'academic-bloggers-toolkit',
                            )}
                        >
                            <SidebarItemList
                                items={references}
                                onItemDoubleClick={this.addItem}
                            />
                        </PanelBody>
                    </PanelBody>
                </InspectorControls>
                <BlockFormatControls>
                    <Toolbar
                        controls={[
                            {
                                icon: 'editor-ul',
                                title: __(
                                    'Convert to unordered list',
                                    'academic-bloggers-toolkit',
                                ),
                                isActive: orderedList === false,
                                onClick() {
                                    if (orderedList) {
                                        setAttributes({ orderedList: false });
                                    }
                                },
                            },
                            {
                                icon: 'editor-ol',
                                title: __(
                                    'Convert to ordered list',
                                    'academic-bloggers-toolkit',
                                ),
                                isActive: orderedList === true,
                                onClick() {
                                    if (!orderedList) {
                                        setAttributes({ orderedList: true });
                                    }
                                },
                            },
                        ]}
                    />
                </BlockFormatControls>
                <section className="abt-static-bib">
                    {items.length === 0 && (
                        <Placeholder
                            icon="welcome-learn-more"
                            label={__(
                                'No references added yet',
                                'academic-bloggers-toolkit',
                            )}
                        >
                            {__(
                                'Add references to this list by double clicking one or more items listed in the "Avaliable References" section of the block settings panel.',
                                'academic-bloggers-toolkit',
                            )}
                        </Placeholder>
                    )}
                    {items.length > 0 && (
                        <ListTag
                            className={classNames(
                                'abt-bibliography__body',
                                styles.body,
                            )}
                        >
                            {items.map(({ content, id }, i) =>
                                isSelected ? (
                                    <LiveItem
                                        key={id}
                                        id={id}
                                        content={content}
                                        onMoveUp={this.makeItemMover(i, 'up')}
                                        onRemove={() =>
                                            setAttributes({
                                                items: [
                                                    ...items.slice(0, i),
                                                    ...items.slice(i + 1),
                                                ],
                                            })
                                        }
                                        onMoveDown={this.makeItemMover(
                                            i,
                                            'down',
                                        )}
                                    />
                                ) : (
                                    <RichText.Content<'li'>
                                        key={id}
                                        data-id={id}
                                        tagName="li"
                                        className={classNames(
                                            'csl-entry',
                                            styles.item,
                                        )}
                                        value={content}
                                    />
                                ),
                            )}
                        </ListTag>
                    )}
                </section>
            </>
        );
    }

    private makeItemMover = (index: number, dir: 'up' | 'down') => {
        const {
            attributes: { items },
            setAttributes,
        } = this.props;
        if (
            (dir === 'up' && index === 0) ||
            (dir === 'down' && index === items.length - 1)
        ) {
            return;
        }
        return () =>
            setAttributes({
                items: swapWith(items, index, index + (dir === 'up' ? -1 : 1)),
            });
    };

    private addItem = async (id: string) => {
        const {
            attributes: { items },
            references,
            setAttributes,
        } = this.props;
        const data = references.find(item => item.id === id);
        if (!data) {
            return;
        }
        const styleXml = await styleCache.fetchItem(
            globalSelect('abt/data').getStyle().value,
        );
        await localeCache.fetchItem(styleXml);
        const processor = new Processor(styleXml);
        processor.parseCitations([
            {
                citationID: '',
                citationItems: [
                    {
                        id: data.id,
                        item: data,
                    },
                ],
                properties: {
                    index: 0,
                    noteIndex: 0,
                },
            },
        ]);
        const newItem = processor.bibliography[0];
        if (newItem) {
            setAttributes({
                items: [
                    ...items,
                    {
                        ...newItem,
                        content: stripListItem(newItem.content),
                    },
                ],
            });
        }
    };
}

namespace LiveItem {
    export interface Props {
        id: string;
        content: string;
        onRemove(): void;
        onMoveDown?(): void;
        onMoveUp?(): void;
    }
}
const LiveItem = ({
    content,
    id,
    onMoveDown,
    onMoveUp,
    onRemove,
}: LiveItem.Props) => (
    <div key={id} className={styles.row}>
        <RichText.Content<'li'>
            tagName="li"
            data-id={id}
            className={classNames('csl-entry', styles.item)}
            value={content}
        />
        <div className={styles.buttonList}>
            <IconButton
                icon="arrow-up-alt2"
                disabled={!onMoveUp}
                label={__('Move item up', 'academic-bloggers-toolkit')}
                onClick={() => onMoveUp && onMoveUp()}
            />
            <IconButton
                icon="trash"
                label={__('Remove item', 'academic-bloggers-toolkit')}
                onClick={() => onRemove()}
            />
            <IconButton
                icon="arrow-down-alt2"
                disabled={!onMoveDown}
                label={__('Move item down', 'academic-bloggers-toolkit')}
                onClick={() => onMoveDown && onMoveDown()}
            />
        </div>
    </div>
);

export default compose([
    withSelect<Edit.SelectProps, Edit.OwnProps>(
        (select, { attributes: { items } }) => {
            const existingIds = items.map(({ id }) => id);
            return {
                references: select('abt/data')
                    .getSortedItems()
                    .filter(item => !existingIds.includes(item.id)),
            };
        },
    ),
])(Edit) as ComponentType<Edit.OwnProps>;
