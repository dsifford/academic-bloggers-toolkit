import { IconButton } from '@wordpress/components';
import { Component, createRef, HTMLProps } from '@wordpress/element';
import { __, _x, sprintf } from '@wordpress/i18n';
import classNames from 'classnames';

import { ResponseError } from 'utils/error';
import { ISBN, URL } from 'utils/resolvers';

import styles from './style.scss';

interface Props {
    /**
     * Describes the type of autocite needed
     */
    kind: 'book' | 'chapter' | 'webpage';
    inputProps?: HTMLProps<HTMLInputElement>;
    className?: string;
    onError(message: string): void;
    onSubmit(data: CSL.Data): void;
}

interface State {
    isBusy: boolean;
    query: string;
}

export default class Autocite extends Component<Props, State> {
    state = {
        isBusy: false,
        query: '',
    };

    private inputRef = createRef<HTMLInputElement>();

    render() {
        const { isBusy, query } = this.state;
        const { inputProps, className } = this.props;
        const isInvalid = this.inputRef.current
            ? !this.inputRef.current.validity.valid
            : true;
        return (
            <div
                role="search"
                className={classNames(styles.autocite, className)}
            >
                <label
                    htmlFor="autocite"
                    role="search"
                    className={classNames(styles.autocite, className)}
                >
                    {_x(
                        'Autocite',
                        'Not a real word, but should be something short that conveys that citation data will be generated automatically',
                        'academic-bloggers-toolkit',
                    )}
                </label>
                <input
                    id="autocite"
                    type="search"
                    autoComplete="off"
                    data-lpignore="true"
                    required
                    ref={this.inputRef}
                    {...inputProps}
                    value={query}
                    onChange={e =>
                        this.setState({ query: e.currentTarget.value })
                    }
                    onKeyDown={e => {
                        if (e.key !== 'Enter') {
                            return;
                        }
                        e.preventDefault();
                        return isInvalid ? void 0 : this.handleQuery();
                    }}
                />
                <IconButton
                    isLarge
                    isBusy={isBusy}
                    isPrimary={isBusy}
                    icon="search"
                    disabled={isInvalid}
                    onClick={this.handleQuery}
                >
                    {__('Search', 'academic-bloggers-toolkit')}
                </IconButton>
            </div>
        );
    }

    private handleQuery = async () => {
        this.setState({ isBusy: true });
        const { query } = this.state;
        const { kind, onError, onSubmit } = this.props;
        let response: CSL.Data | ResponseError;
        switch (kind) {
            case 'book':
            case 'chapter':
                response = await ISBN.get(query, kind === 'chapter');
                break;
            case 'webpage':
                response = await URL.get(query);
                break;
            default:
                this.setState({ isBusy: false });
                return;
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
            this.setState({ isBusy: false });
            return;
        }
        this.setState({ isBusy: false, query: '' });
        return onSubmit(response);
    };
}
