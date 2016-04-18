import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Modal from '../utils/Modal';

interface Props {

}

interface State {

}

class BibtexWindow extends React.Component<Props, State> {

    private modal: Modal = new Modal('Import BibTeX');

    constructor() {
        super();
    }

    componentDidMount() {
        this.modal.resize();
    }

    componentDidUpdate() {
        this.modal.resize();
    }


    render() {
        return <h1>Hello World!</h1>
    }
}


ReactDOM.render(
    <BibtexWindow />,
    document.getElementById('main-container')
);
