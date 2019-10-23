import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { create, FormatProps, insert, remove } from '@wordpress/rich-text';
import { get } from 'lodash';

import AddFootnoteDialog from 'gutenberg/dialogs/add-footnote';
import { FootnoteElement } from 'utils/element';

import { name as NAME } from './';
import './footnote.scss?global';

type Props = FormatProps;

export default function Footnote({ isActive, value, onChange }: Props) {
    const { parseFootnotes } = useDispatch('abt/data');
    const [isOpen, setIsOpen] = useState(false);

    const { activeFormats = [], start, end } = value;
    const footnoteIsSelected = activeFormats.some(f => f.type === NAME);

    return (
        <>
            <AddFootnoteDialog
                isOpen={isOpen}
                title={__('Add footnote', 'academic-bloggers-toolkit')}
                onClose={() => setIsOpen(false)}
                onSubmit={note => {
                    setIsOpen(false);
                    const footnote = create({
                        html: FootnoteElement.create(note),
                    });
                    onChange(insert(value, footnote));
                    parseFootnotes();
                }}
            />
            <RichTextToolbarButton
                icon="testimonial"
                isActive={isActive || footnoteIsSelected}
                isDisabled={(!start || !end) && !footnoteIsSelected}
                title={
                    footnoteIsSelected
                        ? __('Remove Footnote', 'academic-bloggers-toolkit')
                        : __('Add Footnote', 'academic-bloggers-toolkit')
                }
                onClick={() => {
                    const activeFootnote = activeFormats.find(
                        f => f.type === NAME,
                    );
                    if (activeFootnote) {
                        const activeId = get(
                            activeFootnote,
                            ['attributes', 'id'],
                            -1,
                        );
                        const indices = value.formats.reduce<number[]>(
                            (arr, formats = [], idx) =>
                                formats.some(
                                    f =>
                                        f.type === NAME &&
                                        get(f, ['attributes', 'id']) ===
                                            activeId,
                                )
                                    ? [...arr, idx]
                                    : arr,
                            [],
                        );
                        onChange(
                            remove(
                                value,
                                indices[0],
                                indices[indices.length - 1] + 1,
                            ),
                        );
                        parseFootnotes();
                    } else {
                        setIsOpen(true);
                    }
                }}
            />
        </>
    );
}
