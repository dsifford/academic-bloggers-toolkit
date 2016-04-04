import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Modal from '../utils/Modal'
import {
  parseInlineCitationString,
  parseCitationNumArray
} from '../utils/HelperFunctions';

interface State {
  citeText: string
  citeArray: number[]
}

export default class CitationWindow extends React.Component<{}, State> {

  private modal: Modal = new Modal('Inline Citation');
  private editorDOM: HTMLDocument = top.tinyMCE.activeEditor.dom.doc;
  private wm = top.tinyMCE.activeEditor.windowManager;
  private refList: HTMLOListElement|boolean;

  constructor() {
    super();
    let smartBib = this.editorDOM.getElementById('abt-smart-bib');
    this.refList = (smartBib as HTMLOListElement) || false;
    this.state = {
      citeText: '',
      citeArray: [],
    }
  }

  componentDidMount() {
    this.modal.resize();
  }

  parser(input: number[]|string): string|number[] {
    if (Array.isArray(input)) {
      return parseInlineCitationString(input);
    }
    return parseCitationNumArray(input as string);
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    this.wm.setParams({ data: this.state.citeArray.sort((a, b) => a - b) });
    this.wm.close();
  }

  handleChange(e: Event) {
    let val = (e.currentTarget as HTMLInputElement).value;
    let newStateArr = Array.from(new Set(this.parser(val) as number[]));
    this.setState(Object.assign({}, this.state, { citeText: val, citeArray: newStateArr }));
  }

  handleClick(e: Event) {
    let selected = e.currentTarget as HTMLDivElement;
    let selectedNum: number = parseInt(selected.dataset['citenum']);
    let indexOfNum: number = this.state.citeArray.indexOf(selectedNum);
    let newStateArray: number[];
    let newStateString: string;

    // Take care of the number array first
    switch (indexOfNum) {
      case -1:
        newStateArray =
          this.state.citeArray
          .concat(selectedNum)
          .sort((a, b) => a - b );
        break;
      default:
        newStateArray = [
          ...this.state.citeArray.slice(0, indexOfNum),
          ...this.state.citeArray.slice(indexOfNum + 1)
        ];
    }

    // Parse new input string
    newStateString = this.parser(newStateArray) as string;

    this.setState({
      citeText: newStateString,
      citeArray: newStateArray,
    });
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div>
            <label htmlFor='citation-input'>Enter Citation Number</label>
          </div>
          <div style={{display: 'flex', width: '100%'}}>
            <div style={{flex: 1}}>
              <input
              type='text'
              id='citation-input'
              style={{fontSize: '1em', width: '100%', margin: '2px', padding: '5px'}}
              autoFocus={true}
              value={this.state.citeText}
              onChange={this.handleChange.bind(this)} />
            </div>
            <div>
              <input
                type='submit'
                className='submit-btn'
                value='Insert' />
            </div>
          </div>
        </form>
        { this.refList &&
          <ReferenceList
            list={(this.refList as HTMLOListElement).children}
            modal={this.modal}
            clickHandler={this.handleClick.bind(this)}
            citeArray={this.state.citeArray} />
        }
      </div>
    )
  }

}

interface RefListProps {
  list: HTMLCollection
  modal: Modal
  clickHandler: Function
  citeArray: number[]
}

class ReferenceList extends React.Component<RefListProps,{}> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.modal.resize();
  }

  render() {

    return(
      <div style={{maxHeight: '400px', overflowY: 'scroll', marginLeft: '-8px', marginRight: '-8px'}}>
        {Object.keys(this.props.list).map((key, i) => {

          let thisClass: string = 'cite-row';
          thisClass += i % 2 === 0 ? ' even' : '';
          thisClass += this.props.citeArray.indexOf(i+1) !== -1 ? ' cite-selected' : '';

          return(
            <div
              key={i}
              className={ thisClass }
              dangerouslySetInnerHTML={
                { __html: `<strong>${i+1}.&nbsp;</strong>` +
                  (this.props.list[key] as HTMLLIElement).innerHTML}
              }
              onClick={this.props.clickHandler}
              data-citenum={i+1} />
          )
        })}
      </div>
    )
  }

}



ReactDOM.render(
  <CitationWindow />,
  document.getElementById('main-container')
);
