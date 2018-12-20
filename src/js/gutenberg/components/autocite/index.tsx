import { IconButton } from '@wordpress/components';
import { Component, createRef, HTMLProps } from '@wordpress/element';
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
    onSubmit(data: CSL.Data): void;
}

interface State {
    query: string;
}

export default class Autocite extends Component<Props, State> {
    state: State = {
        query: '',
    };

    private inputRef = createRef<HTMLInputElement>();

    render() {
        const { query } = this.state;
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
                    Autocite
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
                />
                <IconButton
                    icon="search"
                    disabled={isInvalid}
                    onClick={this.handleQuery}
                >
                    Search
                </IconButton>
            </div>
        );
    }

    private handleQuery = async () => {
        const { query } = this.state;
        const { kind, onSubmit } = this.props;
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
                console.error(`Invalid indentifier type: ${kind}`);
                return;
        }
        if (response instanceof ResponseError) {
            console.error(
                `Unable to retrieve data for identifier: ${response.resource}`,
            );
            return;
        }
        return onSubmit(response);
    };
}
