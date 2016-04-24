import * as React from 'react';
import { ReferenceWindowEvents as LocalEvents, FieldMappings } from '../../../utils/Constants';


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

    removePerson(e: InputEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.REMOVE_PERSON, {
                detail: parseInt(e.target.dataset['num']),
            })
        );
    }

    onChange(e: InputEvent) {
        this.props.eventHandler(
            new CustomEvent(LocalEvents.PERSON_CHANGE, {
                detail: {
                    index: parseInt(e.target.dataset['num']),
                    field: e.target.dataset['namefield'],
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
                        className='btn'
                        value='Add Another'
                        onClick={this.addPerson.bind(this)}/>
                </div>
                {this.props.people.map((person: CSL.TypedPerson, i: number) =>
                    <div key={`person-list-${i}`} style={{ display: 'flex', alignItems: 'center', }}>
                        <div>
                            <select
                                value={person.type}
                                data-num={i}
                                data-namefield='type'
                                onChange={this.onChange.bind(this)}>
                                { this.fieldMaps[this.props.citationType].people.map((p, j: number) =>
                                    <option key={`peopleSelect-${j}`} value={p.type} children={p.label} />
                                )}
                            </select>
                        </div>
                        <div style={{ flex: 1, padding: '0 5px', }} >
                            <input
                                type='text'
                                data-namefield='family'
                                data-num={i}
                                style={{ width: '100%', }}
                                placeholder='Lastname'
                                aria-label='Last Name'
                                id={`person-family-${i}`}
                                value={person.family}
                                onChange={this.onChange.bind(this)}
                                required={true} />
                        </div>
                        ,
                        <div style={{ flex: 1, padding: '0 5px', }} >
                            <input
                                type='text'
                                data-namefield='given'
                                style={{width: '100%'}}
                                placeholder='Firstname, Middleinitial'
                                aria-label='First Name, Middle Initial'
                                data-num={i}
                                id={`person-given-${i}`}
                                value={person.given}
                                onChange={this.onChange.bind(this)}
                                required={true} />
                        </div>
                        <div style={{ padding: '0 5px', }}>
                            <input
                            type='button'
                            className='btn'
                            data-num={i}
                            value='✖'
                            onClick={this.removePerson.bind(this)} />
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
