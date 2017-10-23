import { parseDate } from 'astrocite-core';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { DialogProps } from 'dialogs/';

import MetaFields from 'dialogs/add/meta-fields';
import People from 'dialogs/add/people';

const PERSON_TYPE_KEYS: ReadonlyArray<keyof CSL.Data> = [
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

const DATE_TYPE_KEYS: ReadonlyArray<keyof CSL.Data> = [
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
export default class EditDialog extends React.Component<Props> {
    static readonly labels = top.ABT.i18n.dialogs.edit;

    /** Controls state of all fields besides people fields */
    fields = observable.map<string>();

    /** Controls state of all people fields */
    people = observable<ABT.TypedPerson>([]);

    constructor(props: Props) {
        super(props);
        const data = toJS(props.data);
        for (const fieldId of Object.keys(data)) {
            if (typeof data[fieldId as keyof CSL.Data] !== 'object') {
                this.fields.set(fieldId, (data as any)[fieldId]);
                continue;
            }
            if (DATE_TYPE_KEYS.includes(fieldId as keyof CSL.Data)) {
                this.fields.set(fieldId, (data as any)[fieldId]['date-parts'][0].join('/'));
                continue;
            }
            if (PERSON_TYPE_KEYS.includes(fieldId as keyof CSL.Data)) {
                for (const person of (data as any)[fieldId]) {
                    const p: ABT.TypedPerson = { ...person, type: fieldId };
                    this.people.push(p);
                }
            }
        }
    }

    handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const people = toJS(this.people);
        const fields = toJS<Partial<CSL.Data>>(this.fields as any);
        for (const person of people) {
            const { type: personType, ...rest } = person;
            fields[personType] = [...(fields[personType] || []), rest];
        }
        for (const key of DATE_TYPE_KEYS) {
            if (fields[key]) {
                fields[key] = parseDate(fields[key] as string);
            }
        }
        this.props.onSubmit(fields);
    };

    render(): JSX.Element {
        return (
            <form onSubmit={this.handleSubmit}>
                <People
                    citationType={this.fields.get('type') as CSL.ItemType}
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
