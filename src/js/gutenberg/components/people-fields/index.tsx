import { IconButton } from '@wordpress/components';
import classNames from 'classnames';

import RemoveIcon from 'gutenberg/components/icons/remove';
import { PeopleContext } from 'gutenberg/context';
import { PersonField } from 'utils/fieldmaps';

import styles from './style.scss';

namespace PeopleFields {
    export interface Props {
        fields: PersonField[];
    }
}

const PeopleFields = ({ fields }: PeopleFields.Props) => (
    <PeopleContext.Consumer>
        {({ add, people, remove }) => (
            <>
                <h2>Contributors</h2>
                <div className={styles.people}>
                    {people.map((person, i) => (
                        <Person
                            fields={fields}
                            data={person}
                            index={i}
                            key={i}
                            isLiteral={person.literal !== undefined}
                        />
                    ))}
                    <div className={styles.buttons}>
                        <IconButton
                            icon={<RemoveIcon />}
                            disabled={people.length === 0}
                            onClick={remove}
                        >
                            Remove contributor
                        </IconButton>
                        <IconButton icon="insert" onClick={add}>
                            Add contributor
                        </IconButton>
                    </div>
                </div>
            </>
        )}
    </PeopleContext.Consumer>
);

namespace Person {
    export interface Props {
        fields: PersonField[];
        data: { kind: CSL.PersonFieldKey } & CSL.Person;
        index: number;
        isLiteral?: boolean;
    }
}

const Person = ({ data, fields, index, isLiteral }: Person.Props) => (
    <PeopleContext.Consumer>
        {({ update }) => (
            <div
                role="group"
                className={classNames(styles.person, {
                    [styles.personLiteral]: isLiteral,
                })}
            >
                <select
                    value={data.kind}
                    onChange={e =>
                        update(index, {
                            ...data,
                            kind: e.currentTarget.value as CSL.PersonFieldKey,
                        })
                    }
                >
                    {fields.map(({ key, label }) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </select>
                {!isLiteral && (
                    <>
                        <input
                            required
                            data-lpignore="true"
                            autoComplete="off"
                            type="text"
                            placeholder="Last name"
                            value={data.family}
                            onChange={e =>
                                update(index, {
                                    ...data,
                                    family: e.currentTarget.value,
                                })
                            }
                        />
                        <input
                            required
                            data-lpignore="true"
                            autoComplete="off"
                            type="text"
                            placeholder="First name"
                            value={data.given}
                            onChange={e =>
                                update(index, {
                                    ...data,
                                    given: e.currentTarget.value,
                                })
                            }
                        />
                    </>
                )}
                {isLiteral && (
                    <input
                        required
                        type="text"
                        data-lpignore="true"
                        autoComplete="off"
                        placeholder="Literal name"
                        value={data.literal}
                        onChange={e =>
                            update(index, {
                                ...data,
                                literal: e.currentTarget.value,
                            })
                        }
                    />
                )}
                <IconButton
                    type="button"
                    icon={isLiteral ? 'admin-users' : 'groups'}
                    label={
                        isLiteral ? 'Toggle single name' : 'Toggle group name'
                    }
                    onClick={() =>
                        update(index, {
                            kind: data.kind,
                            ...(isLiteral
                                ? { family: '', given: '' }
                                : { literal: '' }),
                        })
                    }
                />
            </div>
        )}
    </PeopleContext.Consumer>
);

export default PeopleFields;
