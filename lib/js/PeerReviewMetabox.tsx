import * as React from 'react'
import * as ReactDOM from 'react-dom'

declare var ABT_PR_Metabox_Data: PR_Meta_Payload;
declare var wp;

interface PR_Meta_Payload {
    1: PeerReviewTableData
    2: PeerReviewTableData
    3: PeerReviewTableData
    selection: '0'|'1'|'2'|'3'
}

interface PeerReviewTableData {
    heading: string
    response: PeerReviewSingleData
    review: PeerReviewSingleData
}

interface PeerReviewSingleData {
    background: string
    content: string
    image: string
    name: string
    twitter: string
}

interface Props {
    data: PR_Meta_Payload
}

interface State {
    selection: number
    1: PeerReviewTableData
    2: PeerReviewTableData
    3: PeerReviewTableData
    hidden: {
        1: boolean
        2: boolean
        3: boolean
    }
}

interface ReviewRowProps extends React.HTMLProps<HTMLDivElement> {
    rowData: PeerReviewTableData
    num: '1'|'2'|'3'
    hidden: boolean
    onChange()
    toggleHidden()
    uploadHandler()
}

interface CommonReviewContentProps extends React.HTMLProps<HTMLDivElement> {
    rowData: PeerReviewTableData
    num: string
    reviewer: boolean
    onChange()
    uploadHandler()
}


class PeerReviewMetabox extends React.Component<Props, State> {

    public optionText: string[] = [
        'Select Number of Reviewers',
        'One Reviewer',
        'Two Reviewers',
        'Three Reviewers',
    ];

    constructor(props) {
        super(props);
        wp.media.frames.abt_reviewer_photos = {
            1: {
                review: null,
                response: null,
            },
            2: {
                review: null,
                response: null,
            },
            3: {
                review: null,
                response: null,
            },
        };
    }

    componentWillMount() {
        this.setState({
            selection: parseInt(this.props.data.selection),
            1: this.props.data[1],
            2: this.props.data[2],
            3: this.props.data[3],
            hidden: {
                1: this.props.data['1'].response.name === ''
                    || !this.props.data['1'].response.name,
                2: this.props.data['2'].response.name === ''
                    || !this.props.data['2'].response.name,
                3: this.props.data['3'].response.name === ''
                    || !this.props.data['3'].response.name,
            }
        });
    }

    private convertHTML(content: string): string {
        return '';
    }

    handleSelectChange(e: React.UIEvent) {
        this.setState(
            Object.assign({}, this.state, {
                selection: (e.target as HTMLSelectElement).value
            })
        );
    }

    handleInputChange(e: React.UIEvent) {
        let target = (e.target as HTMLInputElement);
        let num = target.dataset['num'];
        let topfield = target.dataset['topfield'];
        let newState = Object.assign({}, this.state);

        if (topfield === 'heading') {
            newState[num][topfield] = target.value;
            this.setState(newState);
            return;
        }

        let field = target.dataset['fieldname'];
        newState[num][topfield][field] = target.value;

        this.setState(newState);
    }

    toggleHidden(e: React.UIEvent) {
        let num = (e.target as HTMLInputElement).dataset['num'];
        let newState = Object.assign({}, this.state);
        newState.hidden[num] = !newState.hidden[num];
        this.setState(newState);
    }

    handleUpload(e: React.UIEvent) {
        let num = (e.target as HTMLInputElement).dataset['num'];
        let topfield = (e.target as HTMLInputElement).dataset['topfield'];

        if (wp.media.frames.abt_reviewer_photos[num][topfield]) {
            wp.media.frames.abt_reviewer_photos[num][topfield].open();
            return;
        }

        wp.media.frames.abt_reviewer_photos[num][topfield] = wp.media({
            title: 'Choose or Upload an Image',
            button: { text:  'Use this image' },
            library: { type: 'image' }
        });

        wp.media.frames.abt_reviewer_photos[num][topfield].on('select', () => {
            let mediaAttachment = wp.media.frames.abt_reviewer_photos[num][topfield]
                .state().get('selection').first().toJSON();
            let newState = Object.assign({}, this.state);
            newState[num][topfield].image = mediaAttachment.url;
            this.setState(newState);
        });

        wp.media.frames.abt_reviewer_photos[num][topfield].open();
    }


    render() {
        return (
            <div>
                <select
                    style={{ width: '100%', }}
                    value={this.state.selection}
                    name='reviewer_selector'
                    onChange={this.handleSelectChange.bind(this)}>
                    {
                        this.optionText.map((text: string, i: number) =>
                            <option key={i} value={i}>{text}</option>
                        )
                    }
                </select>
                { this.state.selection > 0 &&
                    <div>
                        <h3 children='Review 1' />
                        <ReviewRow
                            rowData={this.state['1']}
                            num='1'
                            onChange={this.handleInputChange.bind(this)}
                            hidden={this.state.hidden['1']}
                            toggleHidden={this.toggleHidden.bind(this)}
                            uploadHandler={this.handleUpload.bind(this)} />
                    </div>
                }
                { this.state.selection > 1 &&
                    <div>
                        <h3 children='Review 2' />
                        <ReviewRow
                            rowData={this.state['2']}
                            num='2'
                            onChange={this.handleInputChange.bind(this)}
                            hidden={this.state.hidden['2']}
                            toggleHidden={this.toggleHidden.bind(this)}
                            uploadHandler={this.handleUpload.bind(this)} />
                    </div>
                }
                { this.state.selection > 2 &&
                    <div>
                        <h3 children='Review 3' />
                        <ReviewRow
                            rowData={this.state['3']}
                            num='3'
                            onChange={this.handleInputChange.bind(this)}
                            hidden={this.state.hidden['3']}
                            toggleHidden={this.toggleHidden.bind(this)}
                            uploadHandler={this.handleUpload.bind(this)} />
                    </div>
                }
            </div>
        )
    }
}


const ReviewRow = (props: ReviewRowProps) => {

    const evenRow: React.CSSProperties = {
        display: 'flex',
        padding: '15px 10px',
        borderRight: '1px solid #C9C9C9',
        borderLeft: '1px solid #C9C9C9',
        alignItems: 'center',
    }

    const oddRow: React.CSSProperties =
        Object.assign({}, evenRow, { backgroundColor: '#f9f9f9' });

    const flex1: React.CSSProperties = {
        flex: 1,
        padding: '0 5px',
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                flexDirection: 'column'
                }}>
                <div style={
                    Object.assign({}, oddRow, {
                        border: '1px solid #C9C9C9',
                        borderBottom: 0 }
                    )}>
                    <div>
                        <label
                            htmlFor={`peer_review_box_heading_${props.num}`}
                            children='Review Heading'/>
                    </div>
                    <div style={flex1}>
                        <input type='text'
                            className='large-text'
                            data-num={props.num}
                            data-topfield='heading'
                            data-fieldname={false}
                            name={`peer_review_box_heading_${props.num}`}
                            id={`peer_review_box_heading_${props.num}`}
                            value={props.rowData.heading}
                            onChange={props.onChange} />
                    </div>
                </div>
            </div>
            <CommonReviewContent
                rowData={props.rowData}
                num={props.num}
                onChange={props.onChange}
                reviewer={true}
                uploadHandler={props.uploadHandler} />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                borderBottom: '1px solid #C9C9C9',
                }}>
                <div style={evenRow}>
                    <div>
                        <input
                            type="button"
                            data-num={props.num}
                            className='button button-primary'
                            id={`author_response_button_${props.num}`}
                            value="Toggle Author Response"
                            onClick={props.toggleHidden} />
                    </div>
                </div>
            </div>
            { props.hidden === false &&
                <CommonReviewContent
                    rowData={props.rowData}
                    onChange={props.onChange}
                    reviewer={false}
                    num={props.num}
                    uploadHandler={props.uploadHandler} />
            }
        </div>
    )
}


const CommonReviewContent = (props: CommonReviewContentProps) => {

    const evenRow: React.CSSProperties = {
        display: 'flex',
        padding: '15px 10px',
        borderRight: '1px solid #C9C9C9',
        borderLeft: '1px solid #C9C9C9',
        alignItems: 'center',
    }

    const oddRow: React.CSSProperties =
        Object.assign({}, evenRow, { backgroundColor: '#f9f9f9' });

    const flex1: React.CSSProperties = {
        flex: 1,
        padding: '0 5px',
    };

    let labelname = props.reviewer ? 'reviewer' : 'author';
    let prLabel = props.reviewer ? 'peer_review_content' : 'author_content';
    let topfield = props.reviewer ? 'review' : 'response';

    let labels = [
        `${labelname}_name_${props.num}`,
        `${labelname}_twitter_${props.num}`,
        `${labelname}_background_${props.num}`,
        `${prLabel}_${props.num}`,
        `${labelname}_headshot_image_${props.num}`,
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={props.reviewer ? evenRow : oddRow}>
                <div>
                    <label htmlFor={labels[0]} children='Name'/>
                </div>
                <div style={flex1}>
                    <input
                        type="text"
                        name={labels[0]}
                        id={labels[0]}
                        value={props.rowData[topfield].name}
                        data-num={props.num}
                        data-topfield={topfield}
                        data-fieldname='name'
                        onChange={props.onChange}/>
                </div>
                <div>
                    <label htmlFor={labels[1]} children='Twitter Handle' />
                </div>
                <div style={flex1}>
                    <input
                        type="text"
                        name={labels[1]}
                        id={labels[1]}
                        value={props.rowData[topfield].twitter}
                        data-num={props.num}
                        data-topfield={topfield}
                        data-fieldname='twitter'
                        onChange={props.onChange} />
                </div>
            </div>
            <div style={props.reviewer ? oddRow : evenRow}>
                <div>
                    <label htmlFor={labels[2]} children='Background' />
                </div>
                <div style={flex1}>
                    <input
                        type="text"
                        name={labels[2]}
                        id={labels[2]}
                        className='large-text'
                        value={props.rowData[topfield].background}
                        data-num={props.num}
                        data-topfield={topfield}
                        data-fieldname='background'
                        onChange={props.onChange} />
                </div>
            </div>
            <div style={props.reviewer ? evenRow : oddRow}>
                <div>
                    <label htmlFor={labels[3]} children='Content' />
                </div>
                <div style={flex1}>
                    <textarea
                        name={labels[3]}
                        id={labels[3]}
                        cols="60"
                        rows="5"
                        value={props.rowData[topfield].content}
                        data-num={props.num}
                        data-topfield={topfield}
                        data-fieldname='content'
                        onChange={props.onChange} />
                </div>
            </div>
            <div
                style={
                    props.reviewer
                    ? oddRow
                    : Object.assign({}, evenRow, {
                        borderBottom: '1px solid #C9C9C9'
                    })
                }>
                <div>
                    <label htmlFor={labels[4]} children='Photo' />
                </div>
                <div style={flex1}>
                    <input
                        type="text"
                        name={labels[4]}
                        id={labels[4]}
                        className='large-text'
                        value={props.rowData[topfield].image}
                        data-num={props.num}
                        data-topfield={topfield}
                        data-fieldname='image'
                        onChange={props.onChange} />
                </div>
                <div>
                    <input type="button"
                    className="button"
                    value="Choose or Upload an Image"
                    onClick={props.uploadHandler}
                    data-num={props.num}
                    data-topfield={topfield} />
                </div>
            </div>
        </div>
    )
}


ReactDOM.render(
    <PeerReviewMetabox data={ABT_PR_Metabox_Data} />,
    document.getElementById('abt-peer-review-metabox')
);
