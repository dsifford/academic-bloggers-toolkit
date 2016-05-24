import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import { ReferenceList, } from './ReferenceList';


interface State {
    cache: {
        style: string;
        locale: string;
    };
    citations: Citeproc.CitationRegistry;
    view: {
        loading: boolean;
        selected: string[];
    };
    bibliography: string[];
}


ReactDOM.render(
    <ReferenceList />,
    document.getElementById('abt-reflist')
);
