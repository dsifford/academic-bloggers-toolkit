import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Modal from '../../components/Modal.ts';

interface P {

}

interface S {
  test: string
}

class PubmedWindow extends React.Component<P, S> {

  private modal: Modal = new Modal('Search PubMed for Reference');

  constructor() {
    super();
    this.state = {
      test: ''
    };
  }

  _handleSubmit(e) {
    console.log(e);
    this.modal.resize();
  }

  _changeHandler(e: Event) {
    this.setState({ test: (e.target as HTMLInputElement).value });
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
            <input type="submit" value="Search" className="submit-btn" />
          </div>
        </form>
        <div style={{fontSize: 20}}>{this.state.test}</div>
      </div>
    )
  }
}



ReactDOM.render(
  <PubmedWindow />,
  document.getElementById('main-container')
);
