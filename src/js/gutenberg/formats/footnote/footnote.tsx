import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { RichTextToolbarButton } from '@wordpress/editor';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { create, FormatProps, insert, remove } from '@wordpress/rich-text';
import _ from 'lodash';

import AddFootnoteDialog from 'gutenberg/dialogs/add-footnote';
import { FootnoteElement } from 'utils/element';

import { name as NAME } from './';
import './footnote.scss?global';

namespace Footnote {
    export interface DispatchProps {
        parseFootnotes(): void;
    }
    export type OwnProps = FormatProps;
    export type Props = OwnProps & DispatchProps;
    export interface State {
        isOpen: boolean;
    }
}
class Footnote extends Component<Footnote.Props, Footnote.State> {
    state: Footnote.State = {
        isOpen: false,
    };

    render() {
        const { isOpen } = this.state;
        const {
            isActive,
            value: { activeFormats = [], start, end },
        } = this.props;
        const footnoteIsSelected = activeFormats.some(f => f.type === NAME);
        return (
            <>
                <AddFootnoteDialog
                    title={__('Add footnote', 'academic-bloggers-toolkit')}
                    isOpen={isOpen}
                    onClose={() => this.setState({ isOpen: false })}
                    onSubmit={note => {
                        this.setState({ isOpen: false });
                        this.insertFootnote(note);
                    }}
                />
                <RichTextToolbarButton
                    icon="testimonial"
                    title={
                        !footnoteIsSelected
                            ? __('Add Footnote', 'academic-bloggers-toolkit')
                            : __('Remove Footnote', 'academic-bloggers-toolkit')
                    }
                    isActive={isActive || footnoteIsSelected}
                    isDisabled={(!start || !end) && !footnoteIsSelected}
                    onClick={this.handleClick}
                />
            </>
        );
    }

    private handleClick = () => {
        const { onChange, parseFootnotes, value } = this.props;
        const { activeFormats = [] } = value;
        const activeFootnote = activeFormats.find(f => f.type === NAME);
        if (activeFootnote) {
            const activeId = _.get(activeFootnote, ['attributes', 'id']);
            const indices = value.formats
                .map((formats, idx) =>
                    Array.isArray(formats) &&
                    formats.some(
                        f =>
                            f.type === NAME &&
                            _.get(f, ['attributes', 'id']) === activeId,
                    )
                        ? idx
                        : undefined,
                )
                .filter(Boolean) as number[];
            onChange(
                remove(value, indices[0] - 1, indices[indices.length - 1] + 1),
            );
            parseFootnotes();
        } else {
            this.setState({ isOpen: true });
        }
    };

    private insertFootnote = (note: string): void => {
        const { onChange, parseFootnotes, value } = this.props;
        const footnote = create({
            html: FootnoteElement.create(note),
        });
        onChange(insert(value, footnote));
        parseFootnotes();
    };
}

export default compose([
    withDispatch<Footnote.DispatchProps>(dispatch => ({
        parseFootnotes() {
            dispatch('abt/data').parseFootnotes();
        },
    })),
])(Footnote);
