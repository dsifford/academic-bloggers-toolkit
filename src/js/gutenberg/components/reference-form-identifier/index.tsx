import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Component, createRef, FormEvent } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import { IdentifierKind } from 'utils/constants';
import { ResponseError } from 'utils/error';
import { DOI, Pubmed } from 'utils/resolvers';

import styles from './style.scss';

const PATTERNS: { readonly [k in IdentifierKind]: string } = {
    doi: '10\\.[^ ]+',
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

interface OwnProps {
    id: string;
    onClose(): void;
    onError(message: string): void;
    onSubmit(data: CSL.Data): void;
    setBusy(busy: boolean): void;
}

type Props = DispatchProps & SelectProps & OwnProps;

interface State {
    value: string;
}

class IdentifierForm extends Component<Props, State> {
    state: State = {
        value: '',
    };

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
        const { kind, pattern, id } = this.props;
        const { value } = this.state;
        return (
            <form id={id} className={styles.form} onSubmit={this.handleSubmit}>
                <select required value={kind} onChange={this.handleKindChange}>
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
                {/* TODO: consider using `FormTokenField` here */}
                <input
                    ref={this.inputRef}
                    required
                    type="text"
                    pattern={pattern}
                    value={value}
                    onChange={this.handleValueChange}
                />
            </form>
        );
    }

    private handleKindChange = (e: FormEvent<HTMLSelectElement>) => {
        const kind = e.currentTarget.value as IdentifierKind;
        this.props.setIdentifierKind(kind);
    };

    private handleValueChange = (e: FormEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        this.setState({ value });
    };

    private handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.props.setBusy(true);
        const { value } = this.state;
        const { kind } = this.props;
        let response: CSL.Data | ResponseError;
        switch (kind) {
            case IdentifierKind.DOI:
                response = await DOI.get(value);
                break;
            case IdentifierKind.PMCID:
                response = await Pubmed.get(value, 'pmc');
                break;
            case IdentifierKind.PMID:
                response = await Pubmed.get(value, 'pubmed');
                break;
            default:
                this.props.onError(
                    sprintf(
                        __(
                            'Invalid indentifier type: %s',
                            'academic-bloggers-toolkit',
                        ),
                        value,
                    ),
                );
                this.props.setBusy(false);
                this.props.onClose();
                return;
        }
        this.props.setBusy(false);
        if (response instanceof ResponseError) {
            this.props.onError(
                sprintf(
                    __(
                        'Unable to retrieve data for identifier: %s',
                        'academic-bloggers-toolkit',
                    ),
                    response.resource,
                ),
            );
            this.props.onClose();
            return;
        }
        return this.props.onSubmit(response);
    };
}

export default compose([
    withDispatch<DispatchProps, OwnProps>(dispatch => ({
        setIdentifierKind(kind: IdentifierKind) {
            dispatch('abt/ui').setIdentifierKind(kind);
        },
    })),
    withSelect<SelectProps, OwnProps>(select => {
        const kind = select('abt/ui').getIdentifierKind();
        return {
            kind,
            pattern: PATTERNS[kind],
        };
    }),
])(IdentifierForm);
