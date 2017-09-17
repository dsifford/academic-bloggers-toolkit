import { action, IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { colors, shadows } from 'utils/styles';

import Button from 'components/button';

interface Props {
    /** Page currently on */
    page: IObservableValue<number>;
    /** Total number of pages */
    totalPages: number;
}

@observer
export class Paginate extends React.PureComponent<Props> {
    static readonly labels = top.ABT.i18n.dialogs.pubmed;

    @action
    handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        switch (e.currentTarget.id) {
            case 'next':
                return this.props.page.set(this.props.page.get() + 1);
            case 'prev':
                return this.props.page.set(this.props.page.get() - 1);
            default:
                return;
        }
    };

    render() {
        return (
            <div>
                <Button
                    flat
                    focusable
                    disabled={this.props.page.get() < 2}
                    id="prev"
                    label={Paginate.labels.previous}
                    onClick={this.handleClick}
                />
                <Button
                    flat
                    focusable
                    disabled={this.props.page.get() === this.props.totalPages}
                    id="next"
                    label={Paginate.labels.next}
                    onClick={this.handleClick}
                />
                <style jsx>{`
                    div {
                        display: flex;
                        padding: 10px;
                        align-items: center;
                        justify-content: space-between;
                        background: ${colors.light_gray};
                        box-shadow: ${shadows.depth_1}, ${shadows.top_border};
                        border-radius: 0 0 2px 2px;
                    }
                `}</style>
            </div>
        );
    }
}
