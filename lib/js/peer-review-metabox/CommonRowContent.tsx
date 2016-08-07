import * as React from 'react';

interface Props extends React.HTMLProps<HTMLDivElement> {
    rowData: ABT.PeerReviewTableData;
    num: string;
    reviewer: boolean;
    onChange();
    uploadHandler();
}

export class CommonRowContent extends React.Component<Props, {}> {

    labels = ABT_i18n.peerReviewMetabox.commonRowContent;

    constructor(props) {
        super(props);
    }

    render() {
        const { rowData, num, reviewer, onChange, uploadHandler } = this.props;

        const labelname = reviewer ? 'reviewer' : 'author';
        const prLabel = reviewer ? 'peer_review_content' : 'author_content';
        const topfield = reviewer ? 'review' : 'response';

        const labels = [
            `${labelname}_name_${num}`,
            `${labelname}_twitter_${num}`,
            `${labelname}_background_${num}`,
            `${prLabel}_${num}`,
            `${labelname}_headshot_image_${num}`,
        ];

        return (
            <div className="row-container">
                <div className={reviewer ? 'row even' : 'row'}>
                    <label
                        htmlFor={labels[0]}
                        children={this.labels.name}
                    />
                    <input
                        type="text"
                        className="large-text"
                        name={labels[0]}
                        value={rowData[topfield]['name']}
                        onChange={onChange.bind(null, topfield, 'name', num)}
                    />
                    <label
                        htmlFor={labels[1]}
                        children={this.labels.twitter}
                    />
                    <input
                        type="text"
                        className="large-text"
                        name={labels[1]}
                        value={rowData[topfield].twitter}
                        onChange={onChange.bind(null, topfield, 'twitter', num)}
                    />
                </div>
                <div className={reviewer ? 'row' : 'row even'}>
                    <label
                        htmlFor={labels[2]}
                        children={this.labels.background}
                    />
                    <input
                        type="text"
                        name={labels[2]}
                        className="large-text"
                        value={rowData[topfield].background}
                        onChange={onChange.bind(null, topfield, 'background', num)}
                    />
                </div>
                <div className={reviewer ? 'row even' : 'row'}>
                    <label
                        htmlFor={labels[3]}
                        children={this.labels.content}
                    />
                    <textarea
                        name={labels[3]}
                        className="large-text"
                        rows={5}
                        value={rowData[topfield].content}
                        onChange={onChange.bind(null, topfield, 'content', num)}
                    />
                </div>
                <div
                    className={ reviewer ? 'row' : 'row even' }
                    style={ reviewer ? {} : { borderBottom: '1px solid #C9C9C9' }}
                >
                    <label
                        htmlFor={labels[4]}
                        children={this.labels.photo}
                    />
                    <input
                        type="text"
                        name={labels[4]}
                        className="large-text"
                        value={rowData[topfield].image}
                        onChange={onChange.bind(null, topfield, 'image', num)}
                    />
                    <input
                        type="button"
                        id={`${labelname}-upload-button-${num}`}
                        className="button"
                        style={{ marginLeft: 10 }}
                        value={this.labels.imageButton}
                        onClick={uploadHandler.bind(null, topfield, num)}
                    />
                </div>
            </div>
        );
    }
}
