import { Component } from '@wordpress/element';
import { FormEvent } from 'react';

import DataFields from 'gutenberg/components/data-fields';
import PersonFields from 'gutenberg/components/person-fields';
import fields from 'utils/fieldmaps';

import styles from './manual-form.scss';

interface State {
    itemType: CSL.ItemType;
}

class ManualForm extends Component<{}, State> {
    state = {
        itemType: 'webpage' as 'webpage',
    };
    render() {
        const { itemType } = this.state;
        return (
            <>
                <label className={styles.field}>
                    Citation type
                    <select value={itemType} onChange={this.handleTypeChange}>
                        {[...Object.entries(fields)].map(
                            ([value, { title: label }]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ),
                        )}
                    </select>
                </label>
                <PersonFields people={fields[itemType].people} />
                <DataFields
                    fields={fields[itemType].fields}
                    title={fields[itemType].title}
                />
            </>
        );
    }
    private handleTypeChange = (e: FormEvent<HTMLSelectElement>) => {
        const itemType = e.currentTarget.value as CSL.ItemType;
        this.setState({ itemType });
    };
}

export default ManualForm;
