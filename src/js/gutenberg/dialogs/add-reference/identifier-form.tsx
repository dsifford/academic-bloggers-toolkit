import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Component, createRef } from '@wordpress/element';
import { FormEvent } from 'react';

import { IdentifierKind } from 'utils/constants';

import styles from './identifier-form.scss';

type PatternObj = { readonly [k in IdentifierKind]: string };

const PATTERNS: PatternObj = {
    doi: '10.[^ ]+',
    pmid: '[0-9]+',
    pmcid: 'PMC[0-9]+',
};

interface DispatchProps {
    setIdentifierKind(kind: IdentifierKind): void;
}

interface SelectProps {
    kind: IdentifierKind;
    pattern: string;
}

class IdentifierForm extends Component<DispatchProps & SelectProps> {
    private inputRef = createRef<HTMLInputElement>();
    componentDidMount() {
        // Necessary due to WordPress modal stealing focus
        setTimeout(() => {
            if (this.inputRef.current) {
                this.inputRef.current.focus();
            }
        }, 100);
    }
    render() {
        const { kind, pattern } = this.props;
        return (
            <div className={styles.form}>
                <select
                    required
                    name="identifierKind"
                    value={kind}
                    onChange={this.handleChange}
                >
                    <option value={IdentifierKind.DOI}>DOI</option>
                    <option value={IdentifierKind.PMID}>PMID</option>
                    <option value={IdentifierKind.PMCID}>PMCID</option>
                </select>
                <input
                    ref={this.inputRef}
                    required
                    name="identifier"
                    type="text"
                    pattern={pattern}
                />
            </div>
        );
    }

    private handleChange = (e: FormEvent<HTMLSelectElement>): void => {
        const kind = e.currentTarget.value as IdentifierKind;
        this.props.setIdentifierKind(kind);
    };
}

export default compose([
    withDispatch<DispatchProps>(dispatch => ({
        setIdentifierKind: dispatch('abt/ui').setIdentifierKind,
    })),
    withSelect<SelectProps>(select => {
        const kind = select('abt/ui').getIdentifierKind();
        return {
            kind,
            pattern: PATTERNS[kind],
        };
    }),
])(IdentifierForm);
