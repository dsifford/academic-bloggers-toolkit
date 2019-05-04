import { RichTextToolbarButton } from '@wordpress/block-editor';
import { withDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { create, FormatProps, insert, remove } from '@wordpress/rich-text';
import { get } from 'lodash';

import AddFootnoteDialog from 'gutenberg/dialogs/add-footnote';
import { FootnoteElement } from 'utils/element';

import { name as NAME } from './';
import './footnote.scss?global';

interface DispatchProps {
    parseFootnotes(): void;
}
type OwnProps = FormatProps;
type Props = OwnProps & DispatchProps;

function Footnote(props: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        isActive,
        value: { activeFormats = [], start, end },
    } = props;
    const footnoteIsSelected = activeFormats.some(f => f.type === NAME);

    return (
        <>
            <AddFootnoteDialog
                isOpen={isOpen}
                title={__('Add footnote', 'academic-bloggers-toolkit')}
                onClose={() => setIsOpen(false)}
                onSubmit={note => {
                    setIsOpen(false);
                    insertFootnote(note, props);
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
                onClick={() => handleClick(setIsOpen, props)}
            />
        </>
    );
}

function handleClick(setIsOpen: (open: boolean) => void, props: Props) {
    const { onChange, parseFootnotes, value } = props;
    const { activeFormats = [] } = value;
    const activeFootnote = activeFormats.find(f => f.type === NAME);

    if (activeFootnote) {
        const activeId = get(activeFootnote, ['attributes', 'id'], -1);
        const indices = value.formats.reduce<number[]>(
            (arr, formats = [], idx) =>
                formats.some(
                    f =>
                        f.type === NAME &&
                        get(f, ['attributes', 'id']) === activeId,
                )
                    ? [...arr, idx]
                    : arr,
            [],
        );
        onChange(remove(value, indices[0], indices[indices.length - 1] + 1));
        parseFootnotes();
    } else {
        setIsOpen(true);
    }
}

function insertFootnote(
    note: string,
    { onChange, parseFootnotes, value }: Props,
) {
    const footnote = create({
        html: FootnoteElement.create(note),
    });
    onChange(insert(value, footnote));
    parseFootnotes();
}

export default withDispatch<DispatchProps, OwnProps>(dispatch => ({
    parseFootnotes() {
        dispatch('abt/data').parseFootnotes();
    },
}))(Footnote);
