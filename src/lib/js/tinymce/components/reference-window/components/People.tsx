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

    fieldmaps: ABT.FieldMappings = (top as any).ABT_i18n.fieldmaps;
    labels = (top as any).ABT_i18n.tinymce.referenceWindow.people;

    handleChange = (e: React.FormEvent<HTMLInputElement|HTMLSelectElement>) => {
        e.preventDefault();
        const target = e.target as HTMLInputElement|HTMLSelectElement;
        this.props.changePerson(target.dataset['index'], target.dataset['field'], target.value);
    }

    handleAddPerson = () => {
        this.props.addPerson();
    }

    handleRemovePerson = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.props.removePerson((e.target as HTMLInputElement).dataset['index']);
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
                            className="abt-btn abt-btn-flat"
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
        return (
            <div className="row collapse">
                <div>
                    <select
                        value={this.props.person.type}
                        onChange={this.props.change}
                        data-index={this.props.index}
                        data-field="type"
                    >
                        { this.props.fieldMap.people.map((p, j: number) =>
                            <option
                                key={`peopleSelect-${j}`}
                                id={`peopleSelect-${j}`}
                                value={p.type}
                                children={p.label}
                            />
                        )}
                    </select>
                </div>
                <div className="flex">
                    <input
                        type="text"
                        placeholder={this.props.labels.surname}
                        aria-label={this.props.labels.surname}
                        value={this.props.person.family}
                        data-index={this.props.index}
                        data-field="family"
                        onChange={this.props.change}
                        required={true}
                    />
                </div>
                <div className="flex">
                    <input
                        type="text"
                        placeholder={this.props.labels.given}
                        aria-label={this.props.labels.given}
                        value={this.props.person.given}
                        data-field="given"
                        data-index={this.props.index}
                        onChange={this.props.change}
                        required={true}
                    />
                </div>
                <div>
                    <input
                        type="button"
                        className="abt-btn abt-btn-flat abt-btn-icon"
                        data-index={this.props.index}
                        style={{fontSize: '1.2em', fontWeight: 'bold'}}
                        value="⨯"
                        onClick={this.props.remove}
                    />
                </div>
            </div>
        );
    }
}
