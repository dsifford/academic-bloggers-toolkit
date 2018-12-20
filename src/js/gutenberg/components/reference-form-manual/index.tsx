import { Component, FormEvent } from '@wordpress/element';

import Autocite from 'gutenberg/components/autocite';
import DataFields from 'gutenberg/components/data-fields';
import PeopleFields from 'gutenberg/components/people-fields';
import { DataContext, PeopleContext } from 'gutenberg/context';
import { CSL_PERSON_KEYS } from 'utils/constants';
import fields from 'utils/fieldmaps';

import styles from './style.scss';

interface Props {
    id: string;
    data?: CSL.Data;
    withAutocite?: boolean;
    onSubmit(data: CSL.Data): void;
}

interface State {
    data: Partial<CSL.Data>;
    people: Array<{ kind: CSL.PersonFieldKey } & CSL.Person>;
}

class ReferenceFormManual extends Component<Props, State> {
    state: State = {
        data: {
            type: 'webpage' as 'webpage',
        },
        people: [
            {
                kind: 'author' as 'author',
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
        const { type } = this.state.data;
        const { id } = this.props;
        return (
            <PeopleContext.Provider
                value={{
                    people: this.state.people,
                    add: this.addPerson,
                    remove: this.removePerson,
                    update: this.updatePerson,
                }}
            >
                <DataContext.Provider
                    value={{ data: this.state.data, update: this.updateData }}
                >
                    <form
                        id={id}
                        className={styles.form}
                        onSubmit={this.handleSubmit}
                    >
                        <label className={styles.field}>
                            Citation type
                            <select
                                value={type}
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
                        <PeopleFields fields={fields[type!].people} />
                        <DataFields fieldmap={fields[type!]} />
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
                        inputProps={{
                            pattern: '(?:[\\dxX]-?){10}|(?:[\\dxX]-?){13}',
                            placeholder: 'ISBN',
                        }}
                    />
                );
            case 'webpage':
                return (
                    <Autocite
                        kind={type}
                        onSubmit={this.consumeData}
                        inputProps={{ type: 'url', placeholder: 'URL' }}
                    />
                );
            default:
                return null;
        }
    };

    private consumeData = (input: CSL.Data) => {
        let data: State['data'] = {};
        let people: State['people'] = [];
        for (const [key, value] of Object.entries<any>(input)) {
            if (CSL_PERSON_KEYS.includes(key as CSL.PersonFieldKey)) {
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

    private handleTypeChange = (e: FormEvent<HTMLSelectElement>) =>
        this.setState({
            data: { type: e.currentTarget.value as CSL.ItemType },
        });

    private handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
