import * as React from 'react';
const VSelect = require('react-virtualized-select').default;
const citeStyles = require('../../../../vendor/citationstyles');

import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css';
import 'react-select/dist/react-select.min.css';

interface Props extends React.HTMLProps<HTMLDivElement> {
    cslStyle: string;
    submitData(kind: string, data?);
}

interface State {
    style: string;
    selected: {
        value: string;
        label: string;
    };
}

export class Menu extends React.Component<Props, State> {

    public styles = citeStyles;

    constructor(props) {
        super(props);
        this.state = {
            style: this.props.cslStyle,
            selected: null,
        };
    }

    handleSelect(kind: string, data, e?: Event) {

        if (e) e.preventDefault();

        switch (kind) {
            case 'CHANGE_STYLE': {
                this.setState(
                    Object.assign({}, this.state, {
                        style: data.value,
                        selected: data,
                    })
                );
                this.props.submitData(kind, data.value);
                return;
            }
            case 'IMPORT_RIS': {
                return this.props.submitData(kind);
            }
            default:
                return console.log('default hit');
        }
    }

    render() {
        return (
            <div id='abt-reflist-menu'>
                <div id='style-select'>
                    <label children='Style' />
                    <VSelect
                        id='style-select'
                        onChange={this.handleSelect.bind(this, 'CHANGE_STYLE')}
                        value={this.state.selected === null ? this.props.cslStyle : this.state.selected}
                        options={this.styles}
                        clearable={false} />
                </div>
                <div className='option-buttons'>
                    <div
                        className='row-btn'
                        onClick={this.handleSelect.bind(this, 'IMPORT_RIS', null)}
                        children='Import RIS File' />
                </div>
            </div>
        );
    }
}
