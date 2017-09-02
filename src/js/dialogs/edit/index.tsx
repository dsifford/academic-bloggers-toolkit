import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { DialogProps } from 'dialogs/';

import MetaFields from 'dialogs/add/meta-fields';
import People from 'dialogs/add/people';

const PERSON_TYPE_KEYS: ReadonlyArray<CSL.PersonType> = [
    'author',
    'container-author',
    'editor',
    'director',
    'interviewer',
    'illustrator',
    'composer',
    'translator',
    'recipient',
];

const DATE_TYPE_KEYS: ReadonlyArray<CSL.DateType> = [
    'accessed',
    'container',
    'event-date',
    'issued',
    'original-date',
    'submitted',
];

interface Props extends DialogProps {
    data: CSL.Data;
    onSubmit(data: any): void;
}

@observer
export default class EditDialog extends React.PureComponent<Props> {
    static readonly labels = top.ABT_i18n.dialogs.edit;

    /** Controls state of all fields besides people fields */
    fields = observable.map<string>();

    /** Controls state of all people fields */
    people = observable<CSL.TypedPerson>([]);

    constructor(props: Props) {
        super(props);
        for (const fieldId of Object.keys(props.data)) {
            if (typeof props.data[fieldId] !== 'object') {
                this.fields.set(fieldId, props.data[fieldId]);
                continue;
            }
            if (DATE_TYPE_KEYS.includes(fieldId as CSL.DateType)) {
                this.fields.set(fieldId, props.data[fieldId]['date-parts'][0].join('/'));
                continue;
            }
            if (PERSON_TYPE_KEYS.includes(fieldId as CSL.PersonType)) {
                for (const person of props.data[fieldId]) {
                    const p: CSL.TypedPerson = { ...person, type: fieldId };
                    this.people.push(p);
                }
            }
        }
    }

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const people = toJS(this.people);
        const fields = toJS<Partial<CSL.Data>>(this.fields);
        for (const person of people) {
            const { type: personType, ...rest } = person;
            fields[personType] = [...(fields[personType] || []), rest];
        }
        this.props.onSubmit(fields);
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <People
                    citationType={this.fields.get('type') as CSL.CitationType}
                    people={this.people}
                />
                <MetaFields meta={this.fields} />
                <div>
                    <input
                        type="submit"
                        className="abt-btn abt-btn_flat abt-btn_submit"
                        value={EditDialog.labels.confirm}
                    />
                </div>
                <style jsx>{`
                    div {
                        padding-bottom: 10px;
                        text-align: center;
                    }
                `}</style>
            </form>
        );
    }
}
