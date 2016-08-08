import * as React from 'react';
import { CommonRowContent } from './CommonRowContent';

interface Props extends React.HTMLProps<HTMLDivElement> {
    rowData: ABT.PeerReviewTableData;
    num: '1'|'2'|'3';
    hidden: boolean;
    onChange();
    toggleHidden();
    uploadHandler();
}

export class ReviewRow extends React.Component<Props, {}> {

    labels = ABT_i18n.peerReviewMetabox.reviewRow;

    constructor(props) {
        super(props);
    }

    render() {
        const { rowData, num, hidden, onChange, toggleHidden, uploadHandler } = this.props;
        return (
            <div>
                <div className="row-container">
                    <div className="row bordered">
                        <label
                            htmlFor={`peer_review_box_heading_${num}`}
                            children={this.labels.reviewHeading}
                        />
                        <input
                            type="text"
                            className="large-text"
                            name={`peer_review_box_heading_${num}`}
                            value={rowData.heading.value}
                            onChange={onChange.bind(null, 'heading', 'value', num)}
                        />
                    </div>
                </div>
                <CommonRowContent
                    rowData={rowData}
                    num={num}
                    onChange={onChange}
                    reviewer={true}
                    uploadHandler={uploadHandler}
                />
                <div className="row-container" style={{borderBottom: '1px solid #C9C9C9'}}>
                    <div className="row even">
                        <input
                            type="button"
                            className="button button-primary"
                            value={this.labels.toggleResponse}
                            style={{margin: '0 10px'}}
                            onClick={toggleHidden.bind(null, num)}
                        />
                    </div>
                </div>
                { hidden === false &&
                    <CommonRowContent
                        rowData={rowData}
                        onChange={onChange}
                        reviewer={false}
                        num={num}
                        uploadHandler={uploadHandler}
                    />
                }
            </div>
        );
    }
}
