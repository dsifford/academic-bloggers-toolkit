import * as React from 'react';
import { citeStyles } from '../../../../vendor/citationstyles';
import VSelect from 'react-virtualized-select';
import { observer } from 'mobx-react';

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

@observer
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
            case 'IMPORT_RIS':
            case 'REFRESH_PROCESSOR':
            case 'DESTROY_PROCESSOR': {
                return this.props.submitData(kind);
            }
            default:
                return console.error('Could not determine what menu item was selected');
        }
    }

    render() {
        return (
            <div id='abt-reflist-menu'>
                <div className='inner'>
                    <div className='option-buttons'>
                        <div
                            className='row-btn'
                            id='import-ris'
                            onClick={this.handleSelect.bind(this, 'IMPORT_RIS', null)}
                            children='Import RIS File' />
                        <div
                            className='row-btn'
                            id='refresh-processor'
                            onClick={this.handleSelect.bind(this, 'REFRESH_PROCESSOR', null)}
                            children='Refresh Reference List' />
                        <div
                            className='row-btn'
                            id='destroy-processor'
                            onClick={this.handleSelect.bind(this, 'DESTROY_PROCESSOR', null)}
                            children='Delete All References' />
                    </div>
                    <div id='style-select'>
                        <VSelect
                            id='style-select'
                            onChange={this.handleSelect.bind(this, 'CHANGE_STYLE')}
                            value={this.state.selected}
                            placeholder='Choose citation style...'
                            options={this.styles}
                            clearable={false} />
                    </div>
                </div>
            </div>
        );
    }
}
