import { IconButton } from '@wordpress/components';
import { HTMLProps, useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import { ResponseError } from 'utils/error';
import { isbn, url } from 'utils/resolvers';

import styles from './style.scss';

interface Props {
    /**
     * Props to pass through to the input element.
     */
    inputProps?: HTMLProps<HTMLInputElement>;
    /**
     * The kind of autocite to be performed.
     */
    kind: CSL.ItemType;
    /**
     * Called with an error message if an error occurs.
     */
    onError(message: string): void;
    /**
     * Called with resolved data after autociting.
     */
    onSubmit(data: CSL.Data): void;
}

type HandlerProps = Pick<Props, 'kind' | 'onError' | 'onSubmit'>;

function Autocite({ inputProps, ...props }: Props) {
    const [isBusy, setIsBusy] = useState(false);
    const [query, setQuery] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);
    const isInvalid = inputRef.current
        ? !inputRef.current.validity.valid
        : true;

    const tryAutocite = async () => {
        setIsBusy(true);
        if (await handleQuery(query, props)) {
            setQuery('');
        }
        setIsBusy(false);
    };

    if (!['book', 'chapter', 'webpage'].includes(props.kind)) {
        return null;
    }

    return (
        <div className={styles.autocite} role="search">
            <label className={styles.autocite} htmlFor="autocite">
                {// translators: Not a real word, but should be something short that conveys that citation data will be generated automatically.
                __('Autocite', 'academic-bloggers-toolkit')}
            </label>
            <input
                ref={inputRef}
                autoComplete="off"
                data-lpignore="true"
                id="autocite"
                type="search"
                {...inputProps}
                value={query}
                onChange={e => setQuery(e.currentTarget.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!isInvalid) {
                            tryAutocite();
                        }
                    }
                }}
            />
            <IconButton
                isLarge
                disabled={isInvalid}
                icon="search"
                isBusy={isBusy}
                isPrimary={isBusy}
                onClick={tryAutocite}
            >
                {__('Search', 'academic-bloggers-toolkit')}
            </IconButton>
        </div>
    );
}

/**
 * Attempts an autocite and returns whether or not a successful response (and
 * thus data) was retrieved.
 */
async function handleQuery(
    query: string,
    { kind, onError, onSubmit }: HandlerProps,
): Promise<boolean> {
    let response: CSL.Data | ResponseError;
    switch (kind) {
        case 'book':
        case 'chapter':
            response = await isbn.get(query, kind === 'chapter');
            break;
        case 'webpage':
            response = await url.get(query);
            break;
        default:
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

export default Autocite;
