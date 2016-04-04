import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Modal from '../utils/Modal.ts';

interface Author {
  firstname: string
  lastname: string
  middleinitial: string
}

interface CommonMeta {
  title: string
  source: string
  pubdate: string
}

interface JournalMeta extends CommonMeta {
  volume: string
  issue: string
  pages: string
}

interface WebsiteMeta extends CommonMeta {
  url: string
  updated: string
  accessed: string
}

interface BookMeta extends CommonMeta {
  chapter: string
  edition: string
  location: string
  pages: string
}

interface ManualMeta {
  journal: JournalMeta,
  website: WebsiteMeta,
  book: BookMeta,
}

interface ManualPayload {
  type: 'journal'|'website'|'book'
  authors: Author[]
  meta: ManualMeta
}

interface State {
  pmidList: string
  citationFormat: string
  includeLink: boolean
  attachInline: boolean
  addManually: boolean
  manualData: ManualPayload
}


class ReferenceWindow extends React.Component<{}, State> {

  private modal: Modal = new Modal('Insert Formatted Reference');
  private smartBibIsEnabled =
    (top.tinyMCE.activeEditor.dom.doc as Document).getElementById('abt-smart-bib');

  constructor() {
    super();
    this.state = {
      pmidList: '',
      citationFormat: top.tinyMCE.activeEditor.windowManager.windows[0].settings.params.preferredStyle || 'ama',
      includeLink: false,
      attachInline: false,
      addManually: false,
      manualData: {
        type: 'journal',
        authors: [
          { firstname: '', lastname: '', middleinitial: '', },
        ],
        meta: {
          journal: {
            title: '',
            source: '',
            pubdate: '',
            volume: '',
            issue: '',
            pages: '',
          },
          website: {
            title: '',
            source: '',
            pubdate: '',
            url: '',
            updated: '',
            accessed: '',
          },
          book: {
            title: '',
            source: '',
            pubdate: '',
            chapter: '',
            edition: '',
            location: '',
            pages: '',
          },
        }
      },
    }
  }

  componentDidMount() {
    this.modal.resize();
  }

  componentDidUpdate() {
    this.modal.resize();
  }

  handleButtonClick(e: MouseEvent) {
    let id = (e.target as HTMLInputElement).id;

    switch(id) {
      case 'searchPubmed':
        let wm = top.tinyMCE.activeEditor.windowManager;
        wm.open({
          title: 'Search PubMed for Reference',
          url: wm.windows[0].settings.params.baseUrl + 'pubmed-window.html',
          width: 600,
          height: 100,
          onsubmit: (e: any) => {
            let newList: string = e.target.data.pmid;

            // If the current PMID List is not empty, add PMID to it
            if (this.state.pmidList !== '') {
              let combinedInput = this.state.pmidList.split(',');
              combinedInput.push(e.target.data.pmid);
              newList = combinedInput.join(',');
            }

            this.setState(Object.assign({}, this.state, { pmidList: newList }));
          }}
        );
        break;
      case 'addManually':
        this.setState(Object.assign({}, this.state, { addManually: !this.state.addManually }));
        break;
    }

  }

  handleSubmit(e: Event) {
    e.preventDefault();
    let wm = top.tinyMCE.activeEditor.windowManager;
    wm.setParams({ data: this.state });
    wm.close();
  }

  consumeChange(e: Event) {

    // Switch on the type of input element and create a new, non-mutated
    // state object to apply the result of the state change.
    let id: string = (e.target as HTMLElement).id;
    let tagName: string = (e.target as HTMLElement).tagName;
    let newState = {};

    switch (tagName) {
      case 'INPUT':
        let type: string = (e.target as HTMLInputElement).type;

        switch(type) {
          case 'text':
            newState[id] = (e.target as HTMLInputElement).value;
            break;
          case 'checkbox':
            newState[id] = (e.target as HTMLInputElement).checked;
            break;
        }
        break;
      case 'SELECT':
        newState[id] = (e.target as HTMLSelectElement).value;
        break;
    }

    this.setState(Object.assign({}, this.state, newState));
  }

  consumeManualDataChange(e: Event) {

    let type: string = e.type;
    let newData = Object.assign({}, this.state.manualData);

    switch(type) {
      case 'AUTHOR_DATA_CHANGE':
        newData.authors = (e as CustomEvent).detail;
        break;
      case 'ADD_AUTHOR':
        newData.authors = [...newData.authors, { firstname: '', lastname: '', middleinitial: '', }];
        break
      case 'REMOVE_AUTHOR':
        let removeNum: number = parseInt((e as CustomEvent).detail);
        newData.authors = [
          ...newData.authors.slice(0, removeNum),
          ...newData.authors.slice(removeNum + 1),
        ];
        break;
      case 'TYPE_CHANGE':
        newData.type = (e as CustomEvent).detail;
        break;
      case 'META_CHANGE':
        newData.meta = (e as CustomEvent).detail;
        break;
    }

    this.setState(Object.assign({}, this.state, { manualData: newData }));

  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
        { !this.state.addManually &&
          <PMIDInput
            pmidList={this.state.pmidList}
            onChange={this.consumeChange.bind(this)} />
        }
        { this.state.addManually &&
          <ManualEntryContainer
            manualData={this.state.manualData}
            onChange={this.consumeManualDataChange.bind(this)} />
        }
        <RefOptions
          smartBibIsEnabled={this.smartBibIsEnabled}
          attachInline={this.state.attachInline}
          citationFormat={this.state.citationFormat}
          onChange={this.consumeChange.bind(this)} />
        <ActionButtons
          addManually={this.state.addManually}
          onClick={this.handleButtonClick.bind(this)} />
        </form>
      </div>
    );
  }

}


class PMIDInput extends React.Component<{pmidList: string, onChange: Function},{}> {

  refs: {
    [key: string]: Element
    pmidInput: HTMLInputElement
  }

  componentDidMount() {
    (ReactDOM.findDOMNode(this.refs.pmidInput) as HTMLInputElement).focus()
  }

  render() {
    let sharedStyle = {
      padding: '5px',
    }
    return(
      <div className='row' style={{display: 'flex', alignItems: 'center'}}>
        <div style={sharedStyle}>
          <label htmlFor='pmidList'>PMID</label>
        </div>
          <input
            type='text'
            id='pmidList'
            style={{width: '100%'}}
            onChange={this.props.onChange}
            ref='pmidInput'
            required={true}
            value={this.props.pmidList} />
        <div style={sharedStyle}>
          <label
            style={{whiteSpace: 'nowrap'}}
            htmlFor='includeLink' >
              Include Link?
          </label>
        </div>
        <div style={sharedStyle}>
          <input
            type="checkbox"
            onChange={this.props.onChange}
            id="includeLink" />
        </div>
      </div>
    )
  }

}


const RefOptions = ({
  attachInline,
  citationFormat,
  onChange,
  smartBibIsEnabled,
}) => {
  let commonStyle = { padding: '5px' }
  return(
    <div className='row'>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={commonStyle}>
          <label htmlFor='citationFormat'>Format </label>
        </div>
        <div style={Object.assign({}, commonStyle, {flex: 1})}>
          <select
            id='citationFormat'
            style={{width: '100%'}}
            onChange={onChange}
            value={citationFormat} >
            <option value='ama'>American Medical Association (AMA)</option>
            <option value='apa'>American Psychological Association (APA)</option>
          </select>
        </div>
      </div>
      { smartBibIsEnabled &&
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={commonStyle}>
            <label htmlFor='attachInline'>Also add inline citation at current cursor position?</label>
          </div>
          <div style={commonStyle}>
            <input type='checkbox' id='attachInline' checked={attachInline} onChange={onChange} />
          </div>
        </div>
      }
    </div>
  );
}


const ActionButtons = ({
  addManually,
  onClick
}) => {

  const rowStyle = {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  };

  const spanStyle = {
    borderRight: 'solid 2px #ccc',
    height: 25,
    margin: '0 15px 0 10px',
  };

  const buttonStyle = { margin: '0 5px' };

  const submitStyle = {
    flexGrow: 1,
    margin: '0 15px 0 0'
  };

  return(
    <div className='row' style={rowStyle}>
      <input
        id='addManually'
        style={buttonStyle}
        onClick={onClick}
        type='button'
        className='btn'
        value={ addManually === false ? 'Add Reference Manually' : 'Add Reference with PMID'} />
      <input
        id='searchPubmed'
        style={buttonStyle}
        onClick={onClick}
        type='button'
        className='btn'
        value='Search Pubmed' />
      <span style={spanStyle}>
      </span>
      <input
        style={submitStyle}
        type='submit'
        className='submit-btn'
        value='Insert Reference' />
    </div>
  )
}




class ManualEntryContainer extends React.Component<{
  manualData: ManualPayload,
  onChange
},{}> {

  constructor(props) {
    super(props);
  }


  typeChange(e) {
    let event = new CustomEvent('TYPE_CHANGE', { detail: e.target.value });
    this.props.onChange(event);
  }

  authorChange(e) {
    let type = e.target.dataset['nametype'];
    let authNumber: number = parseInt(e.target.dataset['authornum']);
    let newAuthorList = [...this.props.manualData.authors];
    newAuthorList[authNumber][type] = e.target.value;
    let event = new CustomEvent('AUTHOR_DATA_CHANGE', {detail: newAuthorList})
    this.props.onChange(event);

  }

  addAuthor(e) {
    let event = new CustomEvent('ADD_AUTHOR');
    this.props.onChange(event);
  }

  removeAuthor(e) {
    let authornum = e.target.dataset['authornum'];
    let event = new CustomEvent('REMOVE_AUTHOR', { detail: authornum });
    this.props.onChange(event);
  }

  handleMetaChange(e) {
    let newMeta = Object.assign({}, this.props.manualData.meta);
    newMeta[this.props.manualData.type][e.target.dataset['metakey']] = e.target.value;
    let event = new CustomEvent('META_CHANGE', { detail: newMeta });
    this.props.onChange(event);
  }

  render() {
    return(
      <div>
        <ManualSelection
          value={this.props.manualData.type}
          onChange={this.typeChange.bind(this)} />
        <Authors
          authorList={this.props.manualData.authors}
          onChange={this.authorChange.bind(this)}
          addAuthor={this.addAuthor.bind(this)}
          removeAuthor={this.removeAuthor.bind(this)}
          type={this.props.manualData.type} />
        <MetaFields
          type={this.props.manualData.type}
          meta={this.props.manualData.meta}
          onChange={this.handleMetaChange.bind(this)} />
      </div>
    )
  }

}

const ManualSelection = ({
  value,
  onChange,
}) => {
  const commonStyle = { padding: '5px' };
  return(
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div style={commonStyle}>
        <label
          htmlFor="type"
          style={{whiteSpace: 'nowrap'}}>
            Select Citation Type
        </label>
      </div>
      <div style={Object.assign({}, commonStyle, {flex: 1})}>
        <select
          id="type"
          style={{width: '100%'}}
          onChange={onChange}
          value={value} >
            <option value="journal">Journal Article</option>
            <option value="website">Website</option>
            <option value="book">Book</option>
        </select>
      </div>
    </div>
  )
}

const Authors = ({
  authorList,
  removeAuthor,
  onChange,
  addAuthor,
  type,
}) => {
  const inputStyle = {
    flex: 1,
    padding: '0 5px',
  };
  const commonStyle = {
    padding: '0 5px'
  }
  return(
    <div>
      <div className='row'>
        <strong>Author Name(s)</strong>
      </div>
      {authorList.map((author: Author, i: number) =>
        <div key={`author-list-${i}`} style={{display: 'flex', alignItems: 'center'}}>
          <div style={commonStyle}>
            <label
              htmlFor={`auth-FN-${i}`}
              style={{whiteSpace: 'nowrap'}} >
                First
            </label>
          </div>
          <div style={inputStyle} >
            <input
              type='text'
              data-nametype='firstname'
              data-authornum={i}
              style={{width: '100%'}}
              pattern='^[a-zA-Z]+$'
              id={`auth-FN-${i}`}
              value={author.firstname}
              onChange={onChange}
              required={ type !== 'website' } />
          </div>
          <div style={commonStyle}>
            <label
              htmlFor={`auth-MI-${i}`}
              style={{whiteSpace: 'nowrap'}} >
                M.I.
            </label>
          </div>
          <div style={Object.assign({}, inputStyle, { maxWidth: '30px' })} >
            <input
              type='text'
              data-nametype='middleinitial'
              style={{width: '100%'}}
              pattern='[a-zA-Z]'
              data-authornum={i}
              id={`auth-MI-${i}`}
              value={author.middleinitial}
              onChange={onChange} />
          </div>
          <div style={commonStyle}>
            <label
              htmlFor={`auth-LN-${i}`}
              style={{whiteSpace: 'nowrap'}} >
                Last
            </label>
          </div>
          <div style={inputStyle} >
            <input
              type='text'
              data-nametype='lastname'
              style={{width: '100%'}}
              pattern='^[a-zA-Z]+$'
              data-authornum={i}
              id={`auth-LN-${i}`}
              value={author.lastname}
              onChange={onChange}
              required={ type !== 'website' } />
          </div>
          <div style={commonStyle}>
            <input
              type='button'
              className='btn'
              data-authornum={i}
              value='x'
              onClick={removeAuthor} />
          </div>
        </div>
      )}
      <div className='row' style={{textAlign: 'center'}}>
        <input type='button' className='btn' value='Add Another Author' onClick={addAuthor}/>
      </div>
    </div>
  )
}


const MetaFields = ({type, meta, onChange,} :
{
  type: string
  meta: ManualMeta
  onChange: Function
}) => {

  const outerFlex = {
    display: 'flex',
    flexDirection: 'column',
  }

  const innerFlex = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }

  let displayMeta: Object[] = [];
  let title: string = type[0].toUpperCase() + type.substring(1, type.length);

  switch(type) {
    case 'journal':
      displayMeta = [
        { meta: meta.journal.title, key: 'title', label: 'Title', required: true },
        { meta: meta.journal.source, key: 'source', label: 'Journal Name', required: true },
        { meta: meta.journal.pubdate, key: 'pubdate', label: 'Year Published', pattern: '[1-2][0-9]{3}', required: true },
        { meta: meta.journal.volume, key: 'volume', label: 'Volume', pattern: '[0-9]{1,5}', required: false },
        { meta: meta.journal.issue, key: 'issue', label: 'Issue', pattern: '^[0-9]{1,4}', required: false },
        { meta: meta.journal.pages, key: 'pages', label: 'Pages', pattern: '^([0-9]{1,4}(?:-[0-9]{1,4}$)?)', required: true }
      ];
      break;
    case 'website':
      displayMeta = [
        { meta: meta.website.title, key: 'title', label: 'Content Title', required: true },
        { meta: meta.website.source, key: 'source', label: 'Website Title', required: true },
        { meta: meta.website.pubdate, key: 'pubdate', label: 'Published Date', placeholder: 'MM/DD/YYYY', pattern: '[0-1][0-9][-/][0-3][0-9][-/][1-2][0-9]{3}', required: true },
        { meta: meta.website.url, key: 'url', label: 'URL', required: true },
        { meta: meta.website.updated, key: 'updated', label: 'Updated Date', placeholder: 'MM/DD/YYYY', pattern: '[0-1][0-9][-/][0-3][0-9][-/][1-2][0-9]{3}', required: false },
        { meta: meta.website.accessed, key: 'accessed', label: 'Accessed Date', placeholder: 'MM/DD/YYYY', pattern: '[0-1][0-9][-/][0-3][0-9][-/][1-2][0-9]{3}', required: false },
      ];
      break;
    case 'book':
      displayMeta = [
        { meta: meta.book.title, key: 'title', label: 'Book Title', required: true },
        { meta: meta.book.source, key: 'source', label: 'Publisher', required: true },
        { meta: meta.book.pubdate, key: 'pubdate', label: 'Copyright Year', pattern: '[1-2][0-9]{3}', required: true },
        { meta: meta.book.chapter, key: 'chapter', label: 'Chapter/Section', required: false },
        { meta: meta.book.edition, key: 'edition', label: 'Edition', required: false },
        { meta: meta.book.location, key: 'location', label: 'Publisher Location', required: false },
        { meta: meta.book.pages, key: 'pages', label: 'Pages', pattern: '^([0-9]{1,4}(?:-[0-9]{1,4}$)?)', required: false },
      ];
      break;
  }

  return(
    <div>
      <div className='row'>
        <strong>{title} Information </strong>
      </div>
      <div style={outerFlex}>
        {displayMeta.map((item, i: number) =>
          <div key={`${title}-meta-${i}`} style={innerFlex}>
            <div style={{padding: '0 5px', flex: 1}}>
              <label
                htmlFor={`${title}-${item.label}`}
                style={{padding: '5px'}} >
                  {item.label}
              </label>
            </div>
            <div style={{padding: '0 5px', flex: 2}}>
              <input
                type='text'
                pattern={item.pattern}
                placeholder={item.placeholder}
                style={{width: '100%'}}
                required={item.required}
                id={`${title}-${item.label}`}
                data-metakey={item.key}
                onChange={onChange}
                value={item.meta} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



ReactDOM.render(
  <ReferenceWindow />,
  document.getElementById('main-container')
)
