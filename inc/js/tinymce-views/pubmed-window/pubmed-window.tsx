import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Modal from '../../components/Modal.ts';
import { PubmedQuery } from '../../utils/PubmedAPI.ts';

interface P {

}

interface S {
  query: string
  results: Object[]
  page: number
}

class PubmedWindow extends React.Component<P, S> {

  private modal: Modal = new Modal('Search PubMed for Reference');

  constructor() {
    super();
    this.state = {
      query: '',
      results: [],
      page: 0,
    };
  }

  componentDidMount() {
    this.modal.resize();
  }

  _handleSubmit(e: Event) {
    e.preventDefault();
    PubmedQuery(this.state.query, (data) => {
      console.log(data)
      this.setState({
        query: '',
        results: data,
        page: 1,
      })
      this.modal.resize();
    });

  }

  _changeHandler(e: Event) {
    this.setState({
      query: (e.target as HTMLInputElement).value,
      results: this.state.results,
      page: this.state.page,
    });
  }

  _handlePagination(e: Event) {
    e.preventDefault();

    let page: number = this.state.page;
    page  = (e.target as HTMLInputElement).id === 'next'
          ? page + 1
          : page - 1;

    this.setState({
      query: this.state.query,
      results: this.state.results,
      page
    });
    setTimeout(() => {
      this.modal.resize();
    }, 200);
  }

  render() {
    return (
      <div>
        <form id="query" onSubmit={this._handleSubmit.bind(this)}>
          <div className="row" style={{display: 'flex'}}>
            <input
              type="text"
              style={{flexGrow: '1'}}
              onChange={this._changeHandler.bind(this)}
            />
            <input type="submit" value="Search" className="submit-btn" disabled={!this.state.query} />
          </div>
        </form>
        <ResultList results={this.state.results.filter((result, i) => {
          if ( i < (this.state.page * 5) && ((this.state.page * 5) - 6) < i ) {
            return true;
          }
        })} />
        <Paginate page={this.state.page} onClick={this._handlePagination.bind(this)} />
      </div>
    )
  }
}

const ResultList = ({
  results
}) => {
  return(
    <div>
      <ol>
        {results.map((result, i: number) => <li key={i}>{result.title}</li> )}
      </ol>
    </div>
  )
}

const Paginate = ({
  page,
  onClick
}) => {
  return (
    <div style={{display: 'flex'}}>
      <div style={{flex: '1'}}>
        <input id='prev' type='button' className='btn' disabled={page < 2} onClick={onClick} value='Previous' />
      </div>
      <div style={{flex: '1', textAlign: 'right'}}>
        <input id='next' type='button' className='btn' disabled={page > 3} onClick={onClick} value='Next' />
      </div>
    </div>
  )
}


ReactDOM.render(
  <PubmedWindow />,
  document.getElementById('main-container')
);
