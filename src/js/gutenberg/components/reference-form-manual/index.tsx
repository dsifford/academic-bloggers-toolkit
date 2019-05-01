import { Notice } from '@wordpress/components';
import { Component, FormEvent } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Autocite from 'gutenberg/components/autocite';
import DataFields from 'gutenberg/components/data-fields';
import PeopleFields from 'gutenberg/components/people-fields';
import { DataContext, PeopleContext } from 'gutenberg/context';
import { isCslPersonKey } from 'utils/constants';
import fields from 'utils/fieldmaps';

import styles from './style.scss';

interface Props {
    id: string;
    data?: CSL.Data;
    withAutocite?: boolean;
    onSubmit(data: CSL.Data): void;
}

interface State {
    error: string;
    data: CSL.Data;
    people: Array<{ kind: CSL.PersonFieldKey } & CSL.Person>;
}

class ReferenceFormManual extends Component<Props, State> {
    state: State = {
        error: '',
        data: {
            id: '',
            type: 'webpage' as CSL.ItemType,
        },
        people: [
            {
                kind: 'author' as CSL.PersonFieldKey,
                family: '',
                given: '',
            },
        ],
    };

    componentDidMount() {
        const { data } = this.props;
        if (data) {
            this.consumeData(data);
        }
    }

    render() {
        const { data, error, people } = this.state;
        const { id } = this.props;
        return (
            <PeopleContext.Provider
                value={{
                    people,
                    add: this.addPerson,
                    remove: this.removePerson,
                    update: this.updatePerson,
                }}
            >
                <DataContext.Provider value={{ data, update: this.updateData }}>
                    <form
                        id={id}
                        className={styles.form}
                        onSubmit={this.handleSubmit}
                    >
                        {error && (
                            <Notice
                                status="error"
                                onRemove={() => this.setState({ error: '' })}
                            >
                                {error}
                            </Notice>
                        )}
                        <label className={styles.field}>
                            {__('Citation type', 'academic-bloggers-toolkit')}
                            <select
                                value={data.type}
                                onChange={this.handleTypeChange}
                            >
                                {[...Object.entries(fields)].map(
                                    ([value, { title: label }]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ),
                                )}
                            </select>
                        </label>
                        {this.maybeRenderAutocite()}
                        <PeopleFields fields={fields[data.type!].people} />
                        <DataFields fieldmap={fields[data.type!]} />
                    </form>
                </DataContext.Provider>
            </PeopleContext.Provider>
        );
    }

    private maybeRenderAutocite = () => {
        const { withAutocite } = this.props;
        const { type } = this.state.data;
        if (!withAutocite) {
            return null;
        }
        switch (type) {
            case 'book':
            case 'chapter':
                return (
                    <Autocite
                        kind={type}
                        onSubmit={this.consumeData}
                        onError={error => this.setState({ error })}
                        inputProps={{
                            pattern: '(?:[\\dxX]-?){10}|(?:[\\dxX]-?){13}',
                            placeholder: __(
                                'ISBN',
                                'academic-bloggers-toolkit',
                            ),
                        }}
                    />
                );
            case 'webpage':
                return (
                    <Autocite
                        kind={type}
                        onSubmit={this.consumeData}
                        onError={error => this.setState({ error })}
                        inputProps={{
                            type: 'url',
                            placeholder: __('URL', 'academic-bloggers-toolkit'),
                        }}
                    />
                );
            default:
                return null;
        }
    };

    private consumeData = (input: CSL.Data) => {
        let data: State['data'] = {
            id: '',
            type: 'article',
        };
        let people: State['people'] = [];
        for (const [key, value] of Object.entries<any>(input)) {
            if (isCslPersonKey(key)) {
                people = [
                    ...people,
                    ...value.map((person: CSL.Person) => ({
                        ...person,
                        kind: key,
                    })),
                ];
            } else {
                data = {
                    ...data,
                    [key]: value,
                };
            }
        }
        this.setState({ data, people });
    };

    private addPerson = () =>
        this.setState(state => ({
            ...state,
            people: [
                ...state.people,
                { kind: 'author', family: '', given: '' },
            ],
        }));

    private removePerson = () =>
        this.setState(state => ({
            ...state,
            people: [...state.people.slice(0, state.people.length - 1)],
        }));

    private updateData = <T extends keyof CSL.Data>(
        key: T,
        value: CSL.Data[T],
    ) => this.setState(state => ({ data: { ...state.data, [key]: value } }));

    private updatePerson = (
        index: number,
        person: { kind: CSL.PersonFieldKey } & CSL.Person,
    ) =>
        this.setState(state => ({
            ...state,
            people: [
                ...state.people.slice(0, index),
                person,
                ...state.people.slice(index + 1),
            ],
        }));

    private handleTypeChange = ({
        currentTarget: { value },
    }: FormEvent<HTMLSelectElement>) =>
        this.setState({
            data: { id: '', type: value as CSL.ItemType },
        });

    private handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        let { data } = this.state;
        for (const person of this.state.people) {
            const { kind, ...rest } = person;
            data = {
                ...data,
                [kind]: Array.isArray(data[kind])
                    ? [...data[kind]!, rest]
                    : [rest],
            };
        }
        this.props.onSubmit(data as CSL.Data);
    };
}

export default ReferenceFormManual;
