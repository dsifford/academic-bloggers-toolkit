import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
    page: number;
    resultLength: number;
    paginate(page: number): void;
}

@observer
export class Paginate extends React.PureComponent<Props, {}> {
    labels = top.ABT_i18n.tinymce.pubmedWindow;
    handleClick = e => {
        this.props.paginate(parseInt(e.target.getAttribute('data-page'), 10));
    };

    render() {
        const { page, resultLength } = this.props;
        const prevCls =
            page < 2
                ? 'abt-btn abt-btn_flat abt-btn_disabled'
                : 'abt-btn abt-btn_flat';
        const nextCls =
            page > 3 || page === 0 || (page + 1) * 5 > resultLength
                ? 'abt-btn abt-btn_flat abt-btn_disabled'
                : 'abt-btn abt-btn_flat';
        return (
            <div className="row" id="pagination-row">
                <div>
                    <input
                        id="prev"
                        type="button"
                        className={prevCls}
                        data-page={page - 1}
                        onClick={this.handleClick}
                        value={this.labels.previous}
                    />
                </div>
                <div>
                    <input
                        id="next"
                        type="button"
                        className={nextCls}
                        data-page={page + 1}
                        onClick={this.handleClick}
                        value={this.labels.next}
                    />
                </div>
            </div>
        );
    }
}
