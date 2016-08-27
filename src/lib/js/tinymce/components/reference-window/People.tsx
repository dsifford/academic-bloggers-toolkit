import * as React from 'react';
import { referenceWindowEvents as LocalEvents } from '../../../utils/Constants';

interface PeopleProps {
    people: CSL.TypedPerson[];
    eventHandler: Function;
    citationType: CSL.CitationType;
}

export class People extends React.Component<PeopleProps, {}> {

    fieldmaps: ABT.FieldMappings = (top as any).ABT_i18n.fieldmaps;
    labels = (top as any).ABT_i18n.tinymce.referenceWindow.people;

    constructor(props) {
        super(props);
    }

    addPerson() {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.ADD_PERSON)
        );
    }

    removePerson(index: number) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.REMOVE_PERSON, {
                detail: index,
            })
        );
    }

    onChange(index: number, field: string, e: React.FormEvent<HTMLInputElement>) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.PERSON_CHANGE, {
                detail: {
                    index,
                    field,
                    value: (e.target as HTMLInputElement).value,
                },
            })
        );
    }

    render() {
        return (
            <div>
                <div className="row" style={{alignItems: 'center', display: 'flex'}}>
                    <strong style={{paddingRight: 5}} children="Contributors"/>
                    <input
                        type="button"
                        id="add-person"
                        className="btn"
                        value={this.labels.add}
                        onClick={this.addPerson.bind(this)}
                    />
                </div>
                {this.props.people.map((person: CSL.TypedPerson, i: number) =>
                    <div
                        key={`person-list-${i}`}
                        id={`person-list-${i}`}
                        style={{alignItems: 'center', display: 'flex'}}
                    >
                        <div>
                            <select
                                value={person.type}
                                onChange={this.onChange.bind(this, i, 'type')}
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
                        <div style={{flex: 1, padding: '0 5px'}}>
                            <input
                                type="text"
                                style={{width: '100%'}}
                                placeholder={this.labels.surname}
                                aria-label={this.labels.surname}
                                id={`person-family-${i}`}
                                value={person.family}
                                onChange={this.onChange.bind(this, i, 'family')}
                                required={true}
                            />
                        </div>
                        ,
                        <div style={{flex: 1, padding: '0 5px'}}>
                            <input
                                type="text"
                                style={{width: '100%'}}
                                placeholder={this.labels.given}
                                aria-label={this.labels.given}
                                id={`person-given-${i}`}
                                value={person.given}
                                onChange={this.onChange.bind(this, i, 'given')}
                                required={true}
                            />
                        </div>
                        <div style={{padding: '0 5px'}}>
                            <input
                                id={`remove-button-${i}`}
                                type="button"
                                className="btn"
                                value="✖"
                                onClick={this.removePerson.bind(this, i)}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
