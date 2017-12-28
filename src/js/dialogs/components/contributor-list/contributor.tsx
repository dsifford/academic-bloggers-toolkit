import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Button from 'components/button';
import * as styles from './contributor-list.scss';

interface Props {
    contributorTypes: ABT.ContributorField[];
    index: number;
    contributor: ABT.Contributor;
    onRemove(e: React.MouseEvent<HTMLButtonElement>): void;
}

@observer
export default class Contributor extends React.Component<Props> {
    static readonly labels = top.ABT.i18n.dialogs.add.contributor;

    @observable isLiteral = false;

    constructor(props: Props) {
        super(props);
        this.isLiteral = props.contributor.literal ? true : false;
    }

    @action
    update = (
        e: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
    ): void => {
        const field = e.currentTarget.dataset.field as
            | keyof ABT.Contributor
            | undefined;
        if (!field) {
            throw new ReferenceError(
                '"field" property not set on event target',
            );
        }
        this.props.contributor[field] = e.currentTarget.value;
    };

    @action
    toggleLiteral = (): void => {
        this.props.contributor.family = '';
        this.props.contributor.given = '';
        this.props.contributor.literal = '';
        this.isLiteral = !this.isLiteral;
    };

    render(): JSX.Element {
        const { contributorTypes, contributor, index, onRemove } = this.props;
        return (
            <div className={styles.contributor}>
                <select
                    value={contributor.type}
                    onChange={this.update}
                    data-field="type"
                >
                    {contributorTypes.map(p => (
                        <option
                            key={p.type}
                            aria-selected={contributor.type === p.type}
                            value={p.type}
                            children={p.label}
                        />
                    ))}
                </select>
                {this.isLiteral && (
                    <input
                        type="text"
                        placeholder={Contributor.labels.literal}
                        aria-label={Contributor.labels.literal}
                        value={contributor.literal}
                        data-field="literal"
                        onChange={this.update}
                        required={true}
                    />
                )}
                {!this.isLiteral && (
                    <>
                        <input
                            type="text"
                            placeholder={Contributor.labels.surname}
                            aria-label={Contributor.labels.surname}
                            value={contributor.family}
                            data-field="family"
                            onChange={this.update}
                            required={true}
                        />
                        <input
                            type="text"
                            placeholder={Contributor.labels.given}
                            aria-label={Contributor.labels.given}
                            value={contributor.given}
                            data-field="given"
                            onChange={this.update}
                            required={true}
                        />
                    </>
                )}
                <Button
                    flat
                    icon={this.isLiteral ? 'groups' : 'admin-users'}
                    label={Contributor.labels.toggle_literal}
                    onClick={this.toggleLiteral}
                />
                <Button
                    flat
                    icon="no-alt"
                    label={Contributor.labels.remove}
                    onClick={onRemove}
                    data-index={index}
                />
            </div>
        );
    }
}
