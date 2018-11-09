import { action, IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, MouseEvent } from 'react';

import ActionBar from 'components/action-bar';
import Button from 'components/button';

interface Props {
    /**
     * Page currently on
     */
    page: IObservableValue<number>;
    /**
     * Total number of pages
     */
    totalPages: number;
}

@observer
export default class Paginate extends Component<Props> {
    static readonly labels = top.ABT.i18n.dialogs.pubmed;

    @action
    handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
        switch (e.currentTarget.id) {
            case 'next':
                return this.props.page.set(this.props.page.get() + 1);
            case 'prev':
                return this.props.page.set(this.props.page.get() - 1);
            default:
                return;
        }
    };

    render(): JSX.Element {
        return (
            <ActionBar>
                <Button
                    flat
                    focusable
                    disabled={this.props.page.get() < 2}
                    id="prev"
                    label={Paginate.labels.previous}
                    onClick={this.handleClick}
                >
                    {Paginate.labels.previous}
                </Button>
                <Button
                    flat
                    focusable
                    disabled={this.props.page.get() === this.props.totalPages}
                    id="next"
                    label={Paginate.labels.next}
                    onClick={this.handleClick}
                >
                    {Paginate.labels.next}
                </Button>
            </ActionBar>
        );
    }
}
