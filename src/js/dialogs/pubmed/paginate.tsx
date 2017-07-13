import { action, computed, IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { colors, shadows } from 'utils/styles';

interface Props {
    page: IObservableValue<number>;
    totalPages: number;
}

@observer
export class Paginate extends React.PureComponent<Props> {
    static readonly labels = top.ABT_i18n.tinymce.pubmedWindow;

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

    @computed
    get nextClassName(): string {
        return this.props.page.get() === this.props.totalPages
            ? 'abt-btn abt-btn_flat abt-btn_disabled'
            : 'abt-btn abt-btn_flat';
    }

    @computed
    get prevClassName(): string {
        return this.props.page.get() < 2
            ? 'abt-btn abt-btn_flat abt-btn_disabled'
            : 'abt-btn abt-btn_flat';
    }

    render() {
        return (
            <div>
                <input
                    id="prev"
                    type="button"
                    className={this.prevClassName}
                    onClick={this.handleClick}
                    value={Paginate.labels.previous}
                />
                <input
                    id="next"
                    type="button"
                    className={this.nextClassName}
                    onClick={this.handleClick}
                    value={Paginate.labels.next}
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
