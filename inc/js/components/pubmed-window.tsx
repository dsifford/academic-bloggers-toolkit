import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Modal from '../utils/Modal.ts';
import { PubmedQuery } from '../utils/PubmedAPI.ts';

declare var wm;


class PubmedWindow extends React.Component
<{}, {query: string, results: Object[], page: number}> {

  private modal: Modal = new Modal('Search PubMed for Reference');
  private wm: any = top.window.tinyMCE.activeEditor.windowManager.windows[top.window.tinyMCE.activeEditor.windowManager.windows.length - 1];

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
    PubmedQuery(this.state.query, (data: Object[]|Error) => {
      if ((data as Error).name == 'Error') {
        top.tinyMCE.activeEditor.windowManager.alert((data as Error).message);
        return;
      }
      this.setState({
        query: '',
        results: (data as Object[]),
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

  _insertPMID(e: Event) {
    this.wm.data['pmid'] = (e.target as HTMLInputElement).dataset['pmid'];
    this.wm.submit();
  }

  render() {
    return (
      <div>
        <form id='query' onSubmit={this._handleSubmit.bind(this)} style={{margin: 0}}>
          <div className='row' style={{display: 'flex'}}>
            <input
              type='text'
              style={{flexGrow: '1'}}
              onChange={this._changeHandler.bind(this)}
              autoFocus={true}
              placeholder={generatePlaceholder()}
              value={this.state.query}
            />
            <input type='submit' value='Search' className='submit-btn' disabled={!this.state.query} />
          </div>
        </form>
        { this.state.results.length !== 0 &&
          <ResultList onClick={this._insertPMID.bind(this)} results={this.state.results.filter((result, i) => {
            if ( i < (this.state.page * 5) && ((this.state.page * 5) - 6) < i ) {
              return true;
            }
          })} />
        }
        { this.state.results.length !== 0 &&
          <Paginate
            page={this.state.page}
            onClick={this._handlePagination.bind(this)}
            resultLength={this.state.results.length } />
        }
      </div>
    )
  }
}

const ResultList = ({
  results,
  onClick
}) => {
  return(
    <div>
      {results.map((result, i: number) =>
        <div key={i} style={
          {
            background: i % 2 == 0 ? '#fafafa' : 'white',
            minHeight: 100,
            display: 'flex',
            alignItems: 'center',
          }
        }>
          <div style={{display: 'flex', flex: '1', flexDirection: 'column', fontSize: '0.85em'}}>
              <div>
                <a href={`http://www.pubmed.com/${result.uid}`} target='_blank'>{result.title}</a>
              </div>
              <div>
                {result.authors.filter((el, i) => i < 3).map(el => el.name).join(', ')}
              </div>
              <div style={{fontSize: '0.9em'}}>
                <em>{result.source}</em> | {result.pubdate}
              </div>
          </div>
          <div style={{padding: '0 10px'}}>
            <input
              type='button'
              className='btn'
              data-pmid={result.uid}
              value='Add Reference'
              style={{
                whiteSpace: 'normal',
                width: 90,
                height: 'auto',
                lineHeight: '1em',
                padding: '10px'}
              }
              onClick={onClick} />
          </div>
        </div>
      )}
    </div>
  )
}

const Paginate = ({
  page,
  onClick,
  resultLength,
}) => {
  return (
    <div style={{display: 'flex', paddingTop: '5px'}}>
      <div style={{flex: '1'}}>
        <input
          id='prev'
          type='button'
          className='btn'
          disabled={page < 2}
          onClick={onClick}
          value='Previous' />
      </div>
      <div style={{flex: '1', textAlign: 'right'}}>
        <input
          id='next'
          type='button'
          className='btn'
          disabled={page > 3 || page === 0 || ((page + 1) * 5) > resultLength }
          onClick={onClick}
          value='Next' />
      </div>
    </div>
  )
}


function generatePlaceholder(): string {

  let options = [
    "Ioannidis JP[Author - First] AND meta research",
    'Brohi K[Author - First] AND "acute traumatic coagulopathy"',
    "Dunning[Author] AND Kruger[Author] AND incompetence",
    "parachute use AND death prevention AND BMJ[Journal]",
    "obediance AND Milgram S[Author - First]",
    "tranexamic acid AND trauma NOT arthroscopy AND Lancet[Journal]",
    'Watson JD[Author] AND Crick FH[Author] AND "nucleic acid"',
    'innovation OR ("machine learning" OR "deep learning") AND healthcare',
    "injuries NOT orthopedic AND hemorrhage[MeSH]",
    "resident OR student AND retention",
  ];

  return options[Math.ceil(Math.random() * 10) - 1];

}


ReactDOM.render(
  <PubmedWindow />,
  document.getElementById('main-container')
);
