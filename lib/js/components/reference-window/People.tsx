import * as React from 'react';
import { ReferenceWindowEvents as LocalEvents, FieldMappings } from '../../utils/Constants';


interface PeopleProps {
    people: CSL.TypedPerson[]
    eventHandler: Function
    citationType: CSL.CitationType
}

export class People extends React.Component<PeopleProps,{}> {

    public fieldMaps: ABT.FieldMappings = FieldMappings;

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

    onChange(index: number, field: string, e: InputEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.PERSON_CHANGE, {
                detail: {
                    index,
                    field,
                    value: e.target.value,
                }
            })
        );
    }

    render() {
        return (
            <div>
                <div className='row' style={{ display: 'flex', alignItems: 'center', }}>
                    <strong style={{ paddingRight: 5, }} children='Contributors'/>
                    <input
                        type='button'
                        id='add-person'
                        className='btn'
                        value='Add Another'
                        onClick={this.addPerson.bind(this)}/>
                </div>
                {this.props.people.map((person: CSL.TypedPerson, i: number) =>
                    <div key={`person-list-${i}`} id={`person-list-${i}`} style={{ display: 'flex', alignItems: 'center', }}>
                        <div>
                            <select
                                value={person.type}
                                onChange={this.onChange.bind(this, i, 'type')}>
                                { this.fieldMaps[this.props.citationType].people.map((p, j: number) =>
                                    <option key={`peopleSelect-${j}`} id={`peopleSelect-${j}`} value={p.type} children={p.label} />
                                )}
                            </select>
                        </div>
                        <div style={{ flex: 1, padding: '0 5px', }} >
                            <input
                                type='text'
                                style={{ width: '100%', }}
                                placeholder='Lastname'
                                aria-label='Last Name'
                                id={`person-family-${i}`}
                                value={person.family}
                                onChange={this.onChange.bind(this, i, 'family')}
                                required={true} />
                        </div>
                        ,
                        <div style={{ flex: 1, padding: '0 5px', }} >
                            <input
                                type='text'
                                style={{width: '100%'}}
                                placeholder='Firstname, Middleinitial'
                                aria-label='First Name, Middle Initial'
                                id={`person-given-${i}`}
                                value={person.given}
                                onChange={this.onChange.bind(this, i, 'given')}
                                required={true} />
                        </div>
                        <div style={{ padding: '0 5px', }}>
                            <input
                            id={`remove-button-${i}`}
                            type='button'
                            className='btn'
                            value='✖'
                            onClick={this.removePerson.bind(this, i)} />
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
