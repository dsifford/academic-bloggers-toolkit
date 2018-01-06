import { action, IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Button from 'components/button';
import Contributor from './contributor';
import * as styles from './contributor-list.scss';

interface Props {
    citationType: CSL.ItemType;
    people: IObservableArray<ABT.Contributor>;
}

@observer
export default class ContributorList extends React.Component<Props> {
    static readonly fieldmaps = top.ABT.i18n.fieldmaps;
    static readonly labels = top.ABT.i18n.dialogs.add.contributor_list;

    @action
    add = (): void => {
        this.props.people.push({} as ABT.Contributor);
    };

    @action
    remove = (e: React.MouseEvent<HTMLInputElement>): void => {
        const index = Number(e.currentTarget.dataset.index);
        if (isNaN(index)) {
            throw new TypeError('Index of contributor is NaN');
        }
        this.props.people.remove(this.props.people[index]);
    };

    render(): JSX.Element {
        let key = Date.now();
        const contributorTypes =
            ContributorList.fieldmaps[this.props.citationType].people;
        return (
            <>
                <h2
                    className={styles.heading}
                    children={ContributorList.labels.contributors}
                />
                {this.props.people.map((contributor, i) => (
                    <Contributor
                        key={key++}
                        index={i}
                        contributorTypes={contributorTypes}
                        contributor={contributor}
                        onRemove={this.remove}
                    />
                ))}
                <div className={styles.btnRow}>
                    <Button
                        flat
                        label={ContributorList.labels.add}
                        onClick={this.add}
                    >
                        {ContributorList.labels.add}
                    </Button>
                </div>
            </>
        );
    }
}
