import { Component } from '@wordpress/element';
import { FormEvent } from 'react';

import styles from './identifier-form.scss';

type PatternObj = { readonly [k in IdentifierKind]: string };

export const enum IdentifierKind {
    DOI = 'doi',
    PMID = 'pmid',
    PMCID = 'pmcid',
}

const PATTERNS: PatternObj = {
    doi: '10.[^ ]+',
    pmid: '[0-9]+',
    pmcid: 'PMC[0-9]+',
};

interface State {
    kind: IdentifierKind;
    pattern: string;
}

class IdentifierForm extends Component<{}, State> {
    state: State = {
        kind: IdentifierKind.DOI,
        pattern: PATTERNS.doi,
    };
    render() {
        const { kind, pattern } = this.state;
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
        this.setState({ kind, pattern: PATTERNS[kind] });
    };
}

export default IdentifierForm;
