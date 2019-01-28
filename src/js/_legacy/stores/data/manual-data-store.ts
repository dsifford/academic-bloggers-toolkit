import { parseDate } from 'astrocite-core';
import { computed, observable, toJS } from 'mobx';
import uuid from 'uuid/v4';

import { AutociteResponse } from 'utils/resolvers';

type FieldProxy = {
    [k in CSL.StringFieldKey | CSL.NumberFieldKey | CSL.DateFieldKey]: string
} & {
    [k: string]: string;
};

const BLANK_PERSON: Readonly<ABT.Contributor> = {
    type: 'author',
    given: '',
    family: '',
    literal: '',
};

const DATE_FIELD_KEYS: ReadonlyArray<string> = [
    'accessed',
    'container',
    'event-date',
    'issued',
    'original-date',
    'submitted',
];

const PERSON_FIELD_KEYS: ReadonlyArray<string> = [
    'author',
    'collection-editor',
    'composer',
    'container-author',
    'director',
    'editor',
    'editorial-director',
    'illustrator',
    'interviewer',
    'original-author',
    'recipient',
    'reviewed-author',
    'translator',
];

function isDateField(k: string, _value: any): _value is CSL.Date {
    return DATE_FIELD_KEYS.includes(k);
}

function isPersonField(k: string, _value: any): _value is CSL.Person[] {
    return PERSON_FIELD_KEYS.includes(k);
}

function isTypeField(k: string, _value: any): _value is CSL.ItemType {
    return k === 'type';
}

export default class ManualData {
    readonly fields: FieldProxy;

    @observable citationType: CSL.ItemType;
    people = observable<ABT.Contributor>([]);

    private id: string;
    private standardFields = observable.map<string>();

    constructor(citationType: CSL.ItemType, id?: string) {
        this.citationType = citationType;
        this.id = id || uuid();
        this.fields = <any>new Proxy(this.standardFields, {
            get: (target, prop): string => {
                if (typeof prop !== 'string') {
                    return '';
                }
                return target.has(prop) ? target.get(prop)! : '';
            },
        });
        this.people.intercept(change => {
            if (change.type === 'splice') {
                change.added = change.added.map(person => ({
                    ...BLANK_PERSON,
                    ...person,
                }));
            }
            return change;
        });
    }

    @computed
    get CSL(): CSL.Data {
        const fields: { [k in CSL.PersonFieldKey]?: CSL.Person[] } = {};
        const contributors = this.people.reduce((csl, item) => {
            const { type, ...contributor } = item;
            const field = csl[type] || [];
            return {
                ...csl,
                [type]: [...field, contributor],
            };
        }, fields);
        const data: CSL.Data = [...this.standardFields.entries()]
            .filter(([_, value]) => !!value)
            .reduce(
                (csl, [key, value]) => {
                    return {
                        ...csl,
                        [key]: DATE_FIELD_KEYS.includes(key)
                            ? parseDate(value)
                            : value,
                    };
                },
                {
                    type: this.citationType,
                    id: this.id,
                },
            );
        return toJS({ ...data, ...contributors });
    }

    set CSL(data: CSL.Data) {
        this.standardFields.clear();
        this.people.clear();
        for (const [key, value] of Object.entries(data)) {
            if (key === 'id') {
                continue;
            }
            if (isTypeField(key, value)) {
                this.citationType = value;
                continue;
            }
            if (isDateField(key, value)) {
                const dateParts = value['date-parts'];
                this.standardFields.set(
                    key,
                    dateParts ? dateParts[0].join('/') : value.literal,
                );
                continue;
            }
            if (isPersonField(key, value)) {
                for (const person of value) {
                    const p: ABT.Contributor = {
                        ...person,
                        type: <CSL.PersonFieldKey>key,
                    };
                    this.people.push(p);
                }
                continue;
            }
            this.standardFields.set(key, value);
        }
    }

    init(citationType: CSL.ItemType): void {
        const newPerson: any = {};
        this.citationType = citationType;
        this.people.clear();
        this.standardFields.clear();
        this.people.push(newPerson);
    }

    merge = ({ fields, people }: AutociteResponse): void => {
        if (fields) {
            this.standardFields.merge(fields);
        }
        if (people) {
            this.people.clear();
            for (const person of people) {
                this.people.push(person);
            }
        }
    };

    updateField = (
        key: CSL.DateFieldKey | CSL.StringFieldKey | CSL.NumberFieldKey,
        value: string,
    ): void => {
        if (value === '') {
            this.standardFields.delete(key);
            return;
        }
        this.standardFields.set(key, value);
        return;
    };
}
