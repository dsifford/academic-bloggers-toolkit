import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { RichTextToolbarButton } from '@wordpress/editor';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { create, FormatProps, insert } from '@wordpress/rich-text';
import _ from 'lodash';

import AddFootnoteDialog from 'gutenberg/dialogs/add-footnote';
import { createSelector } from 'utils/dom';
import { FootnoteElement } from 'utils/element';

import { name as NAME } from './';
import './footnote.scss?global';

namespace Footnote {
    export interface DispatchProps {
        parseFootnotes(): void;
    }
    export interface SelectProps {
        selectedElement: HTMLElement | null;
    }
    export type OwnProps = FormatProps;
    export type Props = OwnProps & DispatchProps & SelectProps;
    export interface State {
        isOpen: boolean;
    }
}
class Footnote extends Component<Footnote.Props, Footnote.State> {
    state = {
        isOpen: false,
    };
    render() {
        const { isActive, selectedElement, value } = this.props;
        return (
            <>
                <AddFootnoteDialog
                    title={__('Add footnote', 'academic-bloggers-toolkit')}
                    isOpen={this.state.isOpen}
                    onClose={() => this.setState({ isOpen: false })}
                    onSubmit={note => {
                        this.setState({ isOpen: false });
                        this.insertFootnote(note);
                    }}
                />
                <RichTextToolbarButton
                    icon="testimonial"
                    title={
                        !selectedElement
                            ? __('Add Footnote', 'academic-bloggers-toolkit')
                            : __('Remove Footnote', 'academic-bloggers-toolkit')
                    }
                    isActive={isActive || !!selectedElement}
                    isDisabled={
                        (!value.start || !value.end) && !selectedElement
                    }
                    onClick={this.handleClick}
                />
            </>
        );
    }

    private handleClick = () => {
        const { onChange, parseFootnotes, selectedElement, value } = this.props;
        if (selectedElement) {
            for (const [index, formats] of value.formats.entries()) {
                if (!formats) {
                    continue;
                }
                if (
                    formats.find(
                        f =>
                            f.type === NAME &&
                            _.get(f, ['attributes', 'note'], null) ===
                                selectedElement.dataset.note,
                    )
                ) {
                    value.formats = [
                        ...value.formats.slice(0, index),
                        ...value.formats.slice(index + 1),
                    ];
                    value.text =
                        value.text.slice(0, index) +
                        value.text.slice(index + 1);
                }
            }
            onChange(value);
            parseFootnotes();
        } else {
            this.setState({ isOpen: true });
        }
    };

    private insertFootnote = (note: string): void => {
        const { onChange, parseFootnotes, value } = this.props;
        const footnote = create({
            html: FootnoteElement.create(note),
            removeNode: node =>
                !node.textContent || node.textContent.trim() === '',
        });
        onChange(insert(value, footnote));
        parseFootnotes();
    };
}

const selectedFootnoteSelector = createSelector({
    classNames: [FootnoteElement.className],
    attributes: { 'data-mce-selected': true },
});

export default compose([
    withDispatch<Footnote.DispatchProps>(dispatch => ({
        parseFootnotes() {
            dispatch('abt/data').parseFootnotes();
        },
    })),
    withSelect<Footnote.SelectProps>(() => ({
        selectedElement: document.querySelector<HTMLSpanElement>(
            selectedFootnoteSelector,
        ),
    })),
])(Footnote);
