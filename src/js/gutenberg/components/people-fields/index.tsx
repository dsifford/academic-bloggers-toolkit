import { IconButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import RemoveIcon from 'components/icons/remove';
import { PeopleContext } from 'gutenberg/context';
import { PersonField } from 'utils/fieldmaps';

import styles from './style.scss';

interface Props {
    fields: PersonField[];
}

export default function PeopleFields({ fields }: Props) {
    return (
        <PeopleContext.Consumer>
            {({ add, people, remove }) => (
                <>
                    <h2>{__('Contributors', 'academic-bloggers-toolkit')}</h2>
                    <div className={styles.people}>
                        {people.map((person, i) => (
                            <Person
                                key={i}
                                data={person}
                                fields={fields}
                                index={i}
                                isLiteral={person.literal !== undefined}
                            />
                        ))}
                        <div className={styles.buttons}>
                            <IconButton
                                disabled={people.length === 0}
                                icon={<RemoveIcon />}
                                onClick={remove}
                            >
                                {__(
                                    'Remove contributor',
                                    'academic-bloggers-toolkit',
                                )}
                            </IconButton>
                            <IconButton icon="insert" onClick={add}>
                                {__(
                                    'Add contributor',
                                    'academic-bloggers-toolkit',
                                )}
                            </IconButton>
                        </div>
                    </div>
                </>
            )}
        </PeopleContext.Consumer>
    );
}

interface PersonProps {
    fields: PersonField[];
    data: { kind: CSL.PersonFieldKey } & CSL.Person;
    index: number;
    isLiteral?: boolean;
}

function Person({ data, fields, index, isLiteral }: PersonProps) {
    return (
        <PeopleContext.Consumer>
            {({ update }) => (
                <div
                    className={classNames(styles.person, {
                        [styles.personLiteral]: isLiteral,
                    })}
                    role="group"
                >
                    <select
                        value={data.kind}
                        onChange={e =>
                            update(index, {
                                ...data,
                                kind: e.currentTarget
                                    .value as CSL.PersonFieldKey,
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
                                autoComplete="off"
                                data-lpignore="true"
                                placeholder={__(
                                    'Last name',
                                    'academic-bloggers-toolkit',
                                )}
                                type="text"
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
                                autoComplete="off"
                                data-lpignore="true"
                                placeholder={__(
                                    'First name',
                                    'academic-bloggers-toolkit',
                                )}
                                type="text"
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
                            autoComplete="off"
                            data-lpignore="true"
                            placeholder={__(
                                'Literal name',
                                'academic-bloggers-toolkit',
                            )}
                            type="text"
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
                        icon={isLiteral ? 'admin-users' : 'groups'}
                        label={
                            isLiteral
                                ? __(
                                      'Toggle single name',
                                      'academic-bloggers-toolkit',
                                  )
                                : __(
                                      'Toggle group name',
                                      'academic-bloggers-toolkit',
                                  )
                        }
                        type="button"
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
}
