import { action, IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Button from 'components/button';

interface PeopleProps {
    citationType: CSL.ItemType;
    people: IObservableArray<ABT.TypedPerson>;
}

@observer
export default class People extends React.Component<PeopleProps, {}> {
    static readonly fieldmaps = top.ABT.i18n.fieldmaps;
    static readonly labels = top.ABT.i18n.dialogs.add.people;

    @action
    addPerson = () => {
        this.props.people.push({ family: '', given: '', type: 'author' });
    };

    @action
    removePerson = (e: React.MouseEvent<HTMLInputElement>) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
        this.props.people.remove(this.props.people[index]);
    };

    @action
    updatePerson = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
        const field = e.currentTarget.getAttribute('data-field')! as keyof CSL.Person;
        const value = e.currentTarget.value;
        this.props.people[index][field] = value;
    };

    render() {
        return (
            <div>
                <h2 children={People.labels.contributors} />
                {this.props.people.map((person: ABT.TypedPerson, i: number) => (
                    <Person
                        key={`person-${i}`}
                        index={i}
                        citationType={this.props.citationType}
                        fieldMap={
                            People.fieldmaps[this.props.citationType as keyof ABT.FieldMappings]
                        }
                        person={person}
                        onChange={this.updatePerson}
                        onRemove={this.removePerson}
                    />
                ))}
                <div className="btn-row">
                    <Button flat label={People.labels.add} onClick={this.addPerson} />
                </div>
                <style jsx>{`
                    .btn-row {
                        display: flex;
                        justify-content: center;
                        padding: 5px;
                    }
                    h2 {
                        font-size: 16px !important;
                    }
                `}</style>
            </div>
        );
    }
}

interface PersonProps {
    citationType: CSL.ItemType;
    fieldMap: ABT.FieldMap;
    index: number;
    person: ABT.TypedPerson;
    onChange(e: React.FormEvent<HTMLInputElement | HTMLSelectElement>): void;
    onRemove(e: React.MouseEvent<HTMLButtonElement>): void;
}

@observer
class Person extends React.Component<PersonProps, {}> {
    static readonly labels = top.ABT.i18n.dialogs.add.people;
    render() {
        const { index, fieldMap: { people }, onChange, onRemove, person } = this.props;
        return (
            <div>
                <select
                    value={person.type}
                    onChange={onChange}
                    data-index={index}
                    data-field="type"
                >
                    {people.map((p, j: number) => (
                        <option
                            key={`peopleSelect-${j}`}
                            id={`peopleSelect-${j}`}
                            aria-selected={person.type === p.type}
                            value={p.type}
                            children={p.label}
                        />
                    ))}
                </select>
                <input
                    type="text"
                    id={`person-family-${index}`}
                    placeholder={Person.labels.surname}
                    aria-label={Person.labels.surname}
                    value={person.family}
                    data-index={index}
                    data-field="family"
                    onChange={onChange}
                    required={true}
                />
                <input
                    type="text"
                    id={`person-given-${index}`}
                    placeholder={Person.labels.given}
                    aria-label={Person.labels.given}
                    value={person.given}
                    data-field="given"
                    data-index={index}
                    onChange={onChange}
                    required={true}
                />
                <Button
                    flat
                    icon="no-alt"
                    label={Person.labels.given}
                    data-index={index}
                    onClick={onRemove}
                />
                <style jsx>{`
                    div {
                        display: flex;
                        padding: 0 5px;
                        align-items: center;
                    }
                    input[type='text'] {
                        flex: auto;
                        height: 28px;
                        line-height: 28px;
                        font-size: 14px;
                    }
                    select,
                    input {
                        margin: 0 5px;
                    }
                `}</style>
            </div>
        );
    }
}
