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
export class People extends React.Component<PeopleProps, {}> {

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
                    <div className="row collapse" key={`person-${i}`}>
                        <div>
                            <select
                                value={person.type}
                                onChange={this.handleChange}
                                data-index={i}
                                data-field="type"
                            >
                                { this.fieldmaps[this.props.citationType].people.map((p, j: number) =>
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
                                placeholder={this.labels.surname}
                                aria-label={this.labels.surname}
                                value={person.family}
                                data-index={i}
                                data-field="family"
                                onChange={this.handleChange}
                                required={true}
                            />
                        </div>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder={this.labels.given}
                                aria-label={this.labels.given}
                                value={person.given}
                                data-field="given"
                                data-index={i}
                                onChange={this.handleChange}
                                required={true}
                            />
                        </div>
                        <div>
                            <input
                                type="button"
                                className="btn btn-flat btn-icon"
                                data-index={i}
                                style={{fontSize: '1.2em', fontWeight: 'bold'}}
                                value="⨯"
                                onClick={this.handleRemovePerson}
                            />
                        </div>
                    </div>
                )}
                <div className="row collapse">
                    <div className="flex" style={{paddingTop: 5, textAlign: 'center'}}>
                        <input
                            type="button"
                            id="add-person"
                            className="btn btn-flat"
                            value={this.labels.add}
                            onClick={this.handleAddPerson}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
