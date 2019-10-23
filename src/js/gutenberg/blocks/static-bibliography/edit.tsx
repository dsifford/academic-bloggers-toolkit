import {
    BlockFormatControls,
    InspectorControls,
    RichText,
} from '@wordpress/block-editor';
import { BlockEditProps } from '@wordpress/blocks';
import { PanelBody, Placeholder, Toolbar } from '@wordpress/components';
import { select as globalSelect, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import CountIcon from 'components/count-icon';
import ReferenceItem from 'gutenberg/components/reference-item';
import SidebarItemList from 'gutenberg/components/sidebar-item-list';
import { localeCache, styleCache } from 'utils/cache';
import { swapWith } from 'utils/data';
import { stripListItem } from 'utils/editor';
import Processor from 'utils/processor';

import { Attributes } from './';
import LiveItem from './live-item';
import styles from './style.scss';

type Props = BlockEditProps<Attributes>;

export default function StaticBibEdit(props: Props) {
    const {
        attributes: { orderedList, items },
        setAttributes,
    } = props;
    const references = useSelect(select => {
        const existingIds = items.map(item => item.id);
        return select('abt/data')
            .getSortedItems()
            .filter(item => !existingIds.includes(item.id));
    });
    return (
        <>
            <InspectorControls>
                <PanelBody>
                    {__(
                        'Double click on one or more items in the list below to insert them into the end of the list.',
                        'academic-bloggers-toolkit',
                    )}
                </PanelBody>
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
                        renderItem={item => <ReferenceItem item={item} />}
                        onItemDoubleClick={async id =>
                            addItem(id, references, items, setAttributes)
                        }
                    />
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
                                setAttributes({ orderedList: false });
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
                                setAttributes({ orderedList: true });
                            },
                        },
                    ]}
                />
            </BlockFormatControls>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <section
                aria-label={__('References', 'academic-bloggers-toolkit')}
                className="abt-static-bib"
                role="region"
            >
                <ItemList {...props} />
            </section>
        </>
    );
}

function ItemList({
    attributes: { items, orderedList },
    isSelected,
    setAttributes,
}: Props) {
    const List = orderedList ? 'ol' : 'ul';
    if (items.length === 0) {
        return (
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
        );
    }
    if (isSelected) {
        return (
            <List className="abt-bibliography__body">
                {items.map(({ content, id }, i) => (
                    <LiveItem
                        key={id}
                        content={content}
                        id={id}
                        onMoveDown={
                            i === items.length - 1
                                ? undefined
                                : () =>
                                      setAttributes({
                                          items: swapWith(items, i, i + 1),
                                      })
                        }
                        onMoveUp={
                            i === 0
                                ? undefined
                                : () =>
                                      setAttributes({
                                          items: swapWith(items, i, i - 1),
                                      })
                        }
                        onRemove={() =>
                            setAttributes({
                                items: [
                                    ...items.slice(0, i),
                                    ...items.slice(i + 1),
                                ],
                            })
                        }
                    />
                ))}
            </List>
        );
    }
    return (
        <List className="abt-bibliography__body">
            {items.map(({ content, id }) => (
                <RichText.Content
                    key={id}
                    className={classNames('csl-entry', styles.item)}
                    data-id={id}
                    tagName="li"
                    value={content}
                />
            ))}
        </List>
    );
}

async function addItem(
    id: string,
    references: CSL.Data[],
    items: Processor.BibItem[],
    setAttributes: (attrs: Partial<Attributes>) => void,
) {
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
    const newItem = processor.bibliography.items[0];
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
}
