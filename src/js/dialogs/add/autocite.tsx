import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { colors, shadows } from 'utils/styles';

interface Props {
    kind: 'webpage' | 'book' | 'chapter';
    inputType: 'text' | 'url';
    placeholder: string;
    pattern?: string;
    getter(kind: string, query: string): void;
}

@observer
export default class AutoCite extends React.PureComponent<Props> {
    static readonly labels = top.ABT_i18n.tinymce.referenceWindow.manualEntryContainer;
    /**
     * Needed for handling the initial focus() of the field
     */
    input: HTMLInputElement;

    query = observable('');

    @action
    handleAutociteFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.query.set(e.currentTarget.value);
    };

    @action
    handleQuery = () => {
        if (this.query.get().length === 0 || !this.input.validity.valid) return;
        this.props.getter(this.props.kind, this.query.get());
        this.query.set('');
    };

    handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Return') {
            e.stopPropagation();
            e.preventDefault();
            this.handleQuery();
        }
    };

    bindRefs = (c: HTMLInputElement) => {
        this.input = c;
    };

    componentDidMount() {
        this.input.focus();
    }

    render() {
        const { placeholder, inputType } = this.props;
        return (
            <div>
                <label htmlFor="citequery" children={AutoCite.labels.autocite} />
                <input
                    type={inputType}
                    id="citequery"
                    placeholder={placeholder}
                    pattern={this.props.pattern ? this.props.pattern : undefined}
                    ref={this.bindRefs}
                    value={this.query.get()}
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleAutociteFieldChange}
                />
                <input
                    type="button"
                    aria-label={AutoCite.labels.search}
                    className={
                        this.query.get().length === 0 || !this.input.validity.valid
                            ? 'abt-btn abt-btn_flat abt-btn_disabled'
                            : 'abt-btn abt-btn_flat'
                    }
                    value={AutoCite.labels.search}
                    onClick={this.handleQuery}
                />
                <style jsx>{`
                    div {
                        display: flex;
                        padding: 10px;
                        margin-bottom: 10px;
                        align-items: center;
                        background: ${colors.light_gray};
                        box-shadow: ${shadows.depth_1}, ${shadows.top_border};
                    }
                    #citequery {
                        margin: 0 10px;
                        flex: auto;
                        height: 28px;
                        font-size: 14px;
                    }
                `}</style>
            </div>
        );
    }
}
