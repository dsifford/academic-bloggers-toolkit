import { Notice } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Autocite from 'gutenberg/components/autocite';
import DataFields from 'gutenberg/components/data-fields';
import PeopleFields from 'gutenberg/components/people-fields';
import { DataContext, PeopleContext } from 'gutenberg/context';
import { isCslPersonKey } from 'utils/constants';
import fields from 'utils/fieldmaps';
import { typedKeys } from 'utils/types';

import styles from './style.scss';

interface Props {
    id: string;
    data?: CSL.Data;
    withAutocite?: boolean;
    onSubmit(data: CSL.Data): void;
}

type Person = { kind: CSL.PersonFieldKey } & CSL.Person;

function ReferenceFormManual(props: Props) {
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState<CSL.Data>({
        id: '',
        type: 'webpage',
    });
    const [people, setPeople] = useState<Person[]>([
        {
            kind: 'author',
            family: '',
            given: '',
        },
    ]);

    useEffect(() => {
        if (props.data) {
            const [d, p] = consumeData(props.data);
            setData(d);
            setPeople(p);
        }
    }, [props.data]);

    const isBookType = ['book', 'chapter'].includes(data.type);
    const isWebpageType = data.type === 'webpage';

    return (
        <PeopleContext.Provider
            value={{
                people,
                add() {
                    setPeople([
                        ...people,
                        { kind: 'author', family: '', given: '' },
                    ]);
                },
                remove() {
                    setPeople(people.slice(0, people.length - 1));
                },
                update(idx, person) {
                    setPeople([
                        ...people.slice(0, idx),
                        person,
                        ...people.slice(idx + 1),
                    ]);
                },
            }}
        >
            <DataContext.Provider
                value={{
                    data,
                    update(key, val) {
                        setData({ ...data, [key]: val });
                    },
                }}
            >
                <form
                    className={styles.form}
                    id={props.id}
                    onSubmit={e => {
                        e.preventDefault();
                        props.onSubmit(
                            people.reduce<CSL.Data>(
                                (obj, { kind, ...person }) => {
                                    const existingField = obj[kind];
                                    if (existingField) {
                                        return {
                                            ...obj,
                                            [kind]: [...existingField, person],
                                        };
                                    }
                                    return {
                                        ...obj,
                                        [kind]: [person],
                                    };
                                },
                                data,
                            ),
                        );
                    }}
                >
                    {errorMessage && (
                        <Notice
                            status="error"
                            onRemove={() => setErrorMessage('')}
                        >
                            {errorMessage}
                        </Notice>
                    )}
                    <label className={styles.field}>
                        {__('Citation type', 'academic-bloggers-toolkit')}
                        <select
                            style={{ maxWidth: 'initial' }}
                            value={data.type}
                            onChange={e =>
                                setData({
                                    id: '',
                                    type: e.currentTarget.value as CSL.ItemType,
                                })
                            }
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
                    {props.withAutocite && (
                        <Autocite
                            inputProps={{
                                pattern: isBookType
                                    ? '(?:[\\dxX]-?){10}|(?:[\\dxX]-?){13}'
                                    : undefined,
                                placeholder: isBookType
                                    ? __('ISBN', 'academic-bloggers-toolkit')
                                    : isWebpageType
                                    ? __('URL', 'academic-bloggers-toolkit')
                                    : undefined,
                                type: isWebpageType ? 'url' : undefined,
                            }}
                            kind={data.type}
                            onError={setErrorMessage}
                            onSubmit={consumeData}
                        />
                    )}
                    <PeopleFields fields={fields[data.type].people} />
                    <DataFields fieldmap={fields[data.type]} />
                </form>
            </DataContext.Provider>
        </PeopleContext.Provider>
    );
}

function consumeData(input: CSL.Data): [CSL.Data, Person[]] {
    const keys = typedKeys(input);
    const peopleFields: Person[] = keys
        .filter(key => isCslPersonKey(key))
        .map(key => {
            const field = input[key] as CSL.Person[];
            return field.map(person => ({
                ...person,
                kind: key as CSL.PersonFieldKey,
            }));
        })
        .reduce((arr, values) => [...arr, ...values], []);
    const dataFields = keys
        .filter(key => !isCslPersonKey(key))
        .reduce<CSL.Data>((obj, key) => ({ ...obj, [key]: input[key] }), {
            id: '',
            type: 'article',
        });
    return [dataFields, peopleFields];
}

export default ReferenceFormManual;
