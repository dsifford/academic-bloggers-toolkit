import * as React from 'react';
import { observer } from 'mobx-react';

interface PeopleProps {
    people: CSL.TypedPerson[];
    citationType: CSL.CitationType;
    addPerson(): void;
    changePerson(index: string, field: string, value: string): void;
    removePerson(index: string): void;
}

@observer
export class People extends React.PureComponent<PeopleProps, {}> {

    fieldmaps = top.ABT_i18n.fieldmaps;
    labels = top.ABT_i18n.tinymce.referenceWindow.people;

    handleChange = (e: React.FormEvent<HTMLInputElement|HTMLSelectElement>) => {
        this.props.changePerson(
            e.currentTarget.getAttribute('data-index'),
            e.currentTarget.getAttribute('data-field'),
            e.currentTarget.value,
        );
    }

    handleAddPerson = () => {
        this.props.addPerson();
    }

    handleRemovePerson = (e: React.MouseEvent<HTMLInputElement>) => {
        this.props.removePerson(e.currentTarget.getAttribute('data-index'));
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div>
                        <span style={{fontWeight: 400}} children={this.labels.contributors}/>
                    </div>
                </div>
                {this.props.people.map((person: CSL.TypedPerson, i: number) =>
                    <Person
                        change={this.handleChange}
                        remove={this.handleRemovePerson}
                        citationType={this.props.citationType}
                        fieldMap={this.fieldmaps[this.props.citationType]}
                        index={i}
                        labels={this.labels}
                        person={person}
                        key={`person-${i}`}
                    />
                )}
                <div className="row collapse">
                    <div className="flex" style={{paddingTop: 5, textAlign: 'center'}}>
                        <input
                            type="button"
                            id="add-person"
                            className="abt-btn abt-btn_flat"
                            value={this.labels.add}
                            onClick={this.handleAddPerson}
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
                        { this.props.fieldMap.people.map((p, j: number) =>
                            <option
                                key={`peopleSelect-${j}`}
                                id={`peopleSelect-${j}`}
                                aria-selected={person.type === p.type}
                                value={p.type}
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
                        style={{fontSize: '1.2em', fontWeight: 'bold'}}
                        value="⨯"
                        onClick={remove}
                    />
                </div>
            </div>
        );
    }
}
