import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import { IdentifierKind } from 'utils/constants';
import { ResponseError } from 'utils/error';
import { doi, pubmed } from 'utils/resolvers';

import styles from './style.scss';

const PATTERNS: { readonly [k in IdentifierKind]: string } = {
    doi: '10\\.[^ ]+',
    pmid: '[0-9]+',
    pmcid: 'PMC[0-9]+',
};

async function fetchData(
    kind: IdentifierKind,
    value: string,
): Promise<CSL.Data> {
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
            throw new Error(
                sprintf(
                    __(
                        'Invalid indentifier type: %s',
                        'academic-bloggers-toolkit',
                    ),
                    value,
                ),
            );
    }
    if (response instanceof ResponseError) {
        throw new Error(
            sprintf(
                __(
                    'Unable to retrieve data for identifier: %s',
                    'academic-bloggers-toolkit',
                ),
                response.resource,
            ),
        );
    }
    return response;
}

interface Props {
    id: string;
    onClose(): void;
    onError(message: string): void;
    onSubmit(data: CSL.Data): void;
    setBusy(busy: boolean): void;
}

export default function IdentifierForm(props: Props) {
    const { setIdentifierKind } = useDispatch('abt/ui');
    const kind = useSelect(select => select('abt/ui').getIdentifierKind());

    const [value, setValue] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const { id, onClose, setBusy, onSubmit, onError } = props;

    return (
        <form
            className={styles.form}
            id={id}
            onSubmit={async e => {
                e.preventDefault();
                setBusy(true);
                try {
                    onSubmit(await fetchData(kind, value));
                } catch (err) {
                    onError(err.message);
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
                pattern={PATTERNS[kind]}
                type="text"
                value={value}
                onChange={e => setValue(e.currentTarget.value)}
            />
        </form>
    );
}
