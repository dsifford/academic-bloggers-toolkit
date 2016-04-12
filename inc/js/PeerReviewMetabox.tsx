import * as React from 'react'
import * as ReactDOM from 'react-dom'

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

declare var ABT_PR_Metabox_Data: PR_Meta_Payload;

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

class PeerReviewMetabox extends React.Component<Props, State> {

  public optionText: string[] = [
    'Select Number of Reviewers',
    'One Reviewer',
    'Two Reviewers',
    'Three Reviewers',
  ];

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      selection: parseInt(this.props.data.selection),
      1: this.props.data[1],
      2: this.props.data[2],
      3: this.props.data[3],
      hidden: {
        1: this.props.data['1'].response.name === '',
        2: this.props.data['2'].response.name === '',
        3: this.props.data['3'].response.name === '',
      }
    });
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
              data={this.state['1']}
              num='1'
              onChange={this.handleInputChange.bind(this)}
              hidden={this.state.hidden['1']}
              toggleHidden={this.toggleHidden.bind(this)} />
          </div>
        }
        { this.state.selection > 1 &&
          <div>
            <h3 children='Review 2' />
            <ReviewRow
              data={this.state['2']}
              num='2'
              onChange={this.handleInputChange.bind(this)}
              hidden={this.state.hidden['2']}
              toggleHidden={this.toggleHidden.bind(this)} />
          </div>
        }
        { this.state.selection > 2 &&
          <div>
            <h3 children='Review 3' />
            <ReviewRow
              data={this.state['3']}
              num='3'
              onChange={this.handleInputChange.bind(this)}
              hidden={this.state.hidden['3']}
              toggleHidden={this.toggleHidden.bind(this)} />
          </div>
        }

      </div>
    )
  }

}




const ReviewRow = ({
  data,
  num,
  onChange,
  toggleHidden,
  hidden,
}) => {

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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={Object.assign({}, oddRow, { border: '1px solid #C9C9C9', borderBottom: 0 })}>
          <div>
            <label htmlFor={`peer_review_box_heading_${num}`} children='Review Heading'/>
          </div>
          <div style={flex1}>
            <input type='text'
              className='large-text'
              data-num={num}
              data-topfield='heading'
              data-fieldname={false}
              name={`peer_review_box_heading_${num}`}
              id={`peer_review_box_heading_${num}`}
              value={data.heading}
              onChange={onChange} />
          </div>
        </div>
      </div>
      <CommonReviewContent data={data} num={num} onChange={onChange} reviewer={true} />
      <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #C9C9C9', }}>
        <div style={evenRow}>
          <div>
            <input
              type="button"
              data-num={num}
              className='button button-primary'
              id={`author_response_button_${num}`}
              value="Toggle Author Response"
              onClick={toggleHidden} />
          </div>
        </div>
      </div>
      { hidden === false &&
        <CommonReviewContent data={data} onChange={onChange} reviewer={false} num={num} />
      }
    </div>
  )
}

const CommonReviewContent = ({
  data,
  num,
  onChange,
  reviewer,
}) => {

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

  let labelname = reviewer ? 'reviewer' : 'author';
  let prLabel = reviewer ? 'peer_review_content' : 'author_content';
  let topfield = reviewer ? 'review' : 'response';

  let labels = [
    `${labelname}_name_${num}`,
    `${labelname}_twitter_${num}`,
    `${labelname}_background_${num}`,
    `${prLabel}_${num}`,
    `${labelname}_headshot_image_${num}`,
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={reviewer ? evenRow : oddRow}>
        <div>
          <label htmlFor={labels[0]} children='Name'/>
        </div>
        <div style={flex1}>
          <input
            type="text"
            name={labels[0]}
            id={labels[0]}
            value={data[topfield].name}
            data-num={num}
            data-topfield={topfield}
            data-fieldname='name'
            onChange={onChange}/>
        </div>
        <div>
          <label htmlFor={labels[1]} children='Twitter Handle' />
        </div>
        <div style={flex1}>
          <input
            type="text"
            name={labels[1]}
            id={labels[1]}
            value={data[topfield].twitter}
            data-num={num}
            data-topfield={topfield}
            data-fieldname='twitter'
            onChange={onChange} />
        </div>
      </div>
      <div style={reviewer ? oddRow : evenRow}>
        <div>
          <label htmlFor={labels[2]} children='Background' />
        </div>
        <div style={flex1}>
          <input
            type="text"
            name={labels[2]}
            id={labels[2]}
            className='large-text'
            value={data[topfield].background}
            data-num={num}
            data-topfield={topfield}
            data-fieldname='background'
            onChange={onChange} />
        </div>
      </div>
      <div style={reviewer ? evenRow : oddRow}>
        <div>
          <label htmlFor={labels[3]} children='Content' />
        </div>
        <div style={flex1}>
          <textarea
            name={labels[3]}
            id={labels[3]}
            cols="60"
            rows="5"
            value={data[topfield].content}
            data-num={num}
            data-topfield={topfield}
            data-fieldname='content'
            onChange={onChange} />
        </div>
      </div>
      <div style={ reviewer
        ? oddRow
        : Object.assign({}, evenRow, {borderBottom: '1px solid #C9C9C9'})}>
        <div>
          <label htmlFor={labels[4]} children='Photo' />
        </div>
        <div style={flex1}>
          <input
            type="text"
            name={labels[4]}
            id={labels[4]}
            className='large-text'
            value={data[topfield].image}
            data-num={num}
            data-topfield={topfield}
            data-fieldname='image'
            onChange={onChange} />
        </div>
        <div>
          <input type="button" className="button" value="Choose or Upload an Image" />
        </div>
      </div>
    </div>
  )
}


ReactDOM.render(
  <PeerReviewMetabox data={ABT_PR_Metabox_Data} />,
  document.getElementById('abt-peer-review-metabox')
);
