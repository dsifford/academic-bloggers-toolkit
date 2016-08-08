import * as React from 'react';

interface Props {
    page: number;
    resultLength: number;
    onClick: Function;
}

export class Paginate extends React.Component<Props, {}> {

    labels = (top as any).ABT_i18n.tinymce.pubmedWindow;

    constructor(props) {
        super(props);
    }

    render() {
        const { onClick, page, resultLength } = this.props;
        return (
            <div style={{display: 'flex', paddingTop: '5px' }}>
                <div style={{flex: '1'}}>
                    <input
                        id="prev"
                        type="button"
                        className="btn"
                        disabled={page < 2}
                        onClick={onClick.bind(null, page - 1)}
                        value={this.labels.previous}
                    />
                </div>
                <div style={{ flex: '1', textAlign: 'right' }}>
                    <input
                        id="next"
                        type="button"
                        className="btn"
                        disabled={page > 3 || page === 0 || ((page + 1) * 5) > resultLength }
                        onClick={onClick.bind(null, page + 1)}
                        value={this.labels.next}
                    />
                </div>
            </div>
        );
    }
}
