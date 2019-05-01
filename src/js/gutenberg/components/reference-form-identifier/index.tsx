import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import { IdentifierKind } from 'utils/constants';
import { ResponseError } from 'utils/error';
import { doi, pubmed } from 'utils/resolvers';

import styles from './style.scss';

interface DispatchProps {
    setIdentifierKind(kind: IdentifierKind): void;
}

interface SelectProps {
    kind: IdentifierKind;
    pattern: string;
}

interface OwnProps {
    id: string;
    onClose(): void;
    onError(message: string): void;
    onSubmit(data: CSL.Data): void;
    setBusy(busy: boolean): void;
}

type Props = DispatchProps & SelectProps & OwnProps;

const PATTERNS: { readonly [k in IdentifierKind]: string } = {
    doi: '10\\.[^ ]+',
    pmid: '[0-9]+',
    pmcid: 'PMC[0-9]+',
};

function IdentifierForm(props: Props) {
    const [value, setValue] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const { id, kind, onClose, pattern, setBusy, setIdentifierKind } = props;

    return (
        <form
            id={id}
            className={styles.form}
            onSubmit={async e => {
                e.preventDefault();
                setBusy(true);
                if (!(await fetchData(value, props))) {
                    onClose();
                }
            }}
        >
            <select
                required
                value={kind}
                onChange={e => {
                    setIdentifierKind(e.currentTarget.value as IdentifierKind);
                }}
            >
                <option value={IdentifierKind.DOI}>
                    {__('DOI', 'academic-bloggers-toolkit')}
                </option>
                <option value={IdentifierKind.PMID}>
                    {__('PMID', 'academic-bloggers-toolkit')}
                </option>
                <option value={IdentifierKind.PMCID}>
                    {__('PMCID', 'academic-bloggers-toolkit')}
                </option>
            </select>
            <input
                // TODO: consider using `FormTokenField` here
                ref={inputRef}
                required
                type="text"
                pattern={pattern}
                value={value}
                onChange={e => setValue(e.currentTarget.value)}
            />
        </form>
    );
}

async function fetchData(
    value: string,
    { kind, onError, onSubmit }: Props,
): Promise<boolean> {
    let response: CSL.Data | ResponseError;
    switch (kind) {
        case IdentifierKind.DOI:
            response = await doi.get(value);
            break;
        case IdentifierKind.PMCID:
            response = await pubmed.get(value, 'pmc');
            break;
        case IdentifierKind.PMID:
            response = await pubmed.get(value, 'pubmed');
            break;
        default:
            onError(
                sprintf(
                    __(
                        'Invalid indentifier type: %s',
                        'academic-bloggers-toolkit',
                    ),
                    value,
                ),
            );
            return false;
    }
    if (response instanceof ResponseError) {
        onError(
            sprintf(
                __(
                    'Unable to retrieve data for identifier: %s',
                    'academic-bloggers-toolkit',
                ),
                response.resource,
            ),
        );
        return false;
    }
    onSubmit(response);
    return true;
}

export default compose(
    withDispatch<DispatchProps, OwnProps>(dispatch => ({
        setIdentifierKind(kind: IdentifierKind) {
            dispatch('abt/ui').setIdentifierKind(kind);
        },
    })),
    withSelect<SelectProps, DispatchProps & OwnProps>(select => {
        const kind = select('abt/ui').getIdentifierKind();
        return {
            kind,
            pattern: PATTERNS[kind],
        };
    }),
)(IdentifierForm);
