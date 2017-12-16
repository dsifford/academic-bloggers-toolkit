import { action, IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Button from 'components/button';
import Contributor from './contributor';

interface Props {
    citationType: keyof ABT.FieldMappings;
    people: IObservableArray<ABT.Contributor>;
}

@observer
export default class ContributorList extends React.Component<Props> {
    static readonly fieldmaps = top.ABT.i18n.fieldmaps;
    static readonly labels = top.ABT.i18n.dialogs.add.contributorList;

    @action
    add = (): void => {
        this.props.people.push({ family: '', given: '', literal: '', type: 'author' });
    };

    @action
    remove = (e: React.MouseEvent<HTMLInputElement>): void => {
        const index = parseInt(e.currentTarget.dataset.index!, 10);
        this.props.people.remove(this.props.people[index]);
    };

    render(): JSX.Element {
        let key = Date.now();
        const contributorTypes = ContributorList.fieldmaps[this.props.citationType].people;
        return (
            <div>
                <h2 children={ContributorList.labels.contributors} />
                {this.props.people.map((contributor, i) => (
                    <Contributor
                        key={key++}
                        index={i}
                        contributorTypes={contributorTypes}
                        contributor={contributor}
                        onRemove={this.remove}
                    />
                ))}
                <div className="btn-row">
                    <Button flat label={ContributorList.labels.add} onClick={this.add} />
                </div>
                <style jsx>{`
                    .btn-row {
                        display: flex;
                        justify-content: center;
                        padding: 5px;
                    }
                    h2 {
                        font-size: 16px !important;
                    }
                `}</style>
            </div>
        );
    }
}
