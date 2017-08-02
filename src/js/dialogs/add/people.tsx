import { action, IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface PeopleProps {
    people: IObservableArray<CSL.TypedPerson>;
    citationType: CSL.CitationType;
}

@observer
export class People extends React.PureComponent<PeopleProps, {}> {
    static readonly fieldmaps = top.ABT_i18n.fieldmaps;
    static readonly labels = top.ABT_i18n.tinymce.referenceWindow.people;

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
                {this.props.people.map((person: CSL.TypedPerson, i: number) =>
                    <Person
                        change={this.updatePerson}
                        remove={this.removePerson}
                        citationType={this.props.citationType}
                        fieldMap={
                            People.fieldmaps[this.props.citationType as keyof ABT.FieldMappings]
                        }
                        index={i}
                        labels={People.labels}
                        person={person}
                        key={`person-${i}`}
                    />,
                )}
                <div className="btn-row">
                    <input
                        type="button"
                        id="add-person"
                        className="abt-btn abt-btn_flat"
                        value={People.labels.add}
                        onClick={this.addPerson}
                    />
                </div>
                <style jsx>{`
                    .btn-row {
                        display: flex;
                        justify-content: center;
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
    person: CSL.TypedPerson;
    citationType: CSL.CitationType;
    fieldMap: ABT.FieldMap;
    labels: any;
    index: number;
    change: any;
    remove: any;
}

@observer
class Person extends React.PureComponent<PersonProps, {}> {
    render() {
        const { change, index, labels, person, remove } = this.props;
        return (
            <div>
                <select value={person.type} onChange={change} data-index={index} data-field="type">
                    {this.props.fieldMap.people.map((p, j: number) =>
                        <option
                            key={`peopleSelect-${j}`}
                            id={`peopleSelect-${j}`}
                            aria-selected={person.type === p.kind}
                            value={p.kind}
                            children={p.label}
                        />,
                    )}
                </select>
                <input
                    type="text"
                    id={`person-family-${index}`}
                    placeholder={labels.surname}
                    aria-label={labels.surname}
                    value={person.family}
                    data-index={index}
                    data-field="family"
                    onChange={change}
                    required={true}
                />
                <input
                    type="text"
                    id={`person-given-${index}`}
                    placeholder={labels.given}
                    aria-label={labels.given}
                    value={person.given}
                    data-field="given"
                    data-index={index}
                    onChange={change}
                    required={true}
                />
                <input
                    type="button"
                    className="abt-btn abt-btn_flat abt-btn_icon"
                    data-index={index}
                    style={{ fontSize: '1.2em', fontWeight: 'bold' }}
                    value="⨯"
                    onClick={remove}
                />
                <style jsx>{`
                    div {
                        display: flex;
                        padding: 0 5px;
                        align-items: center;
                    }
                    input[type="text"] {
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
