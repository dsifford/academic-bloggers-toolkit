import { action, IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface PeopleProps {
    people: IObservableArray<CSL.TypedPerson>;
    citationType: CSL.CitationType;
}

@observer
export class People extends React.PureComponent<PeopleProps, {}> {
    fieldmaps = top.ABT_i18n.fieldmaps;
    labels = top.ABT_i18n.tinymce.referenceWindow.people;

    @action
    addPerson = () => {
        this.props.people.push({ family: '', given: '', type: 'author' });
    };

    @action
    removePerson = (e: React.MouseEvent<HTMLInputElement>) => {
        const index = e.currentTarget.getAttribute('data-index')!;
        this.props.people.remove(this.props.people[index]);
    };

    @action
    updatePerson = (
        e: React.FormEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const index = e.currentTarget.getAttribute('data-index')!;
        const field = e.currentTarget.getAttribute('data-field')!;
        const value = e.currentTarget.value;
        this.props.people[index][field] = value;
    };

    render() {
        return (
            <div>
                <div className="row">
                    <div>
                        <span
                            style={{ fontWeight: 400 }}
                            children={this.labels.contributors}
                        />
                    </div>
                </div>
                {this.props.people.map((person: CSL.TypedPerson, i: number) =>
                    <Person
                        change={this.updatePerson}
                        remove={this.removePerson}
                        citationType={this.props.citationType}
                        fieldMap={this.fieldmaps[this.props.citationType]}
                        index={i}
                        labels={this.labels}
                        person={person}
                        key={`person-${i}`}
                    />
                )}
                <div className="row collapse">
                    <div
                        className="flex"
                        style={{ paddingTop: 5, textAlign: 'center' }}
                    >
                        <input
                            type="button"
                            id="add-person"
                            className="abt-btn abt-btn_flat"
                            value={this.labels.add}
                            onClick={this.addPerson}
                        />
                    </div>
                </div>
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
            <div className="row collapse">
                <div>
                    <select
                        value={person.type}
                        onChange={change}
                        data-index={index}
                        data-field="type"
                    >
                        {this.props.fieldMap.people.map((p, j: number) =>
                            <option
                                key={`peopleSelect-${j}`}
                                id={`peopleSelect-${j}`}
                                aria-selected={person.type === p.kind}
                                value={p.kind}
                                children={p.label}
                            />
                        )}
                    </select>
                </div>
                <div className="flex">
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
                </div>
                <div className="flex">
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
                </div>
                <div>
                    <input
                        type="button"
                        className="abt-btn abt-btn_flat abt-btn_icon"
                        data-index={index}
                        style={{ fontSize: '1.2em', fontWeight: 'bold' }}
                        value="⨯"
                        onClick={remove}
                    />
                </div>
            </div>
        );
    }
}
