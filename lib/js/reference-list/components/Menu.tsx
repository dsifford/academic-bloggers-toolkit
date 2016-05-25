import * as React from 'react';
const VSelect = require('react-virtualized-select').default;
const citeStyles = require('../../../../vendor/citationstyles');

import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css';
import 'react-select/dist/react-select.min.css';

interface Props extends React.HTMLProps<HTMLDivElement> {
    cslStyle: string;
    submitData(data: {style: string});
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

    handleSelect(selection) {
        this.setState(
            Object.assign({}, this.state, {
                style: selection.value,
                selected: selection,
            })
        );
        this.props.submitData({
            style: selection.value,
        });
    }

    handleClick(kind: string, e: Event) {
        e.preventDefault();
        console.log(kind);
    }

    render() {
        return (
            <div id='abt-reflist-menu'>
                <div id='style-select'>
                    <label children='Style' />
                    <VSelect
                        id='style-select'
                        onChange={this.handleSelect.bind(this)}
                        value={this.state.selected === null ? this.props.cslStyle : this.state.selected}
                        options={this.styles}
                        clearable={false} />
                </div>
                <div className='option-buttons'>
                    <div
                        className='row-btn'
                        onClick={this.handleClick.bind(this, 'import')}
                        children='Import RIS File' />
                </div>
            </div>
        );
    }
}
