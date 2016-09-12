import * as React from 'react';
import { observer } from 'mobx-react';

interface Props {
    page: number;
    resultLength: number;
    paginate(page: number): void;
}

@observer
export class Paginate extends React.PureComponent<Props, {}> {

    labels = (top as any).ABT_i18n.tinymce.pubmedWindow;

    handleClick = (e) => {
        this.props.paginate(parseInt(e.target.dataset['page'], 10));
    }

    render() {
        const { page, resultLength } = this.props;
        return (
            <div className="row" id="pagination-row">
                <div>
                    <input
                        id="prev"
                        type="button"
                        className="abt-btn abt-btn-flat"
                        disabled={page < 2}
                        data-page={page - 1}
                        onClick={this.handleClick}
                        value={this.labels.previous}
                    />
                </div>
                <div>
                    <input
                        id="next"
                        type="button"
                        className="abt-btn abt-btn-flat"
                        disabled={page > 3 || page === 0 || ((page + 1) * 5) > resultLength }
                        data-page={page + 1}
                        onClick={this.handleClick}
                        value={this.labels.next}
                    />
                </div>
            </div>
        );
    }
}
