import * as React from 'react';
import { citeStyles } from '../../../../vendor/citationstyles';
import VSelect from 'react-virtualized-select';
import { observer } from 'mobx-react';
import { PanelButton } from './PanelButton';

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

    styles: {label: string, value: string}[] = citeStyles;

    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            style: this.props.cslStyle,
        };
    }

    handleSelect(kind: string, data, e?: Event) {

        if (e) e.preventDefault();

        switch (kind) {
            case 'CHANGE_STYLE': {
                this.setState(
                    Object.assign({}, this.state, {
                        selected: data,
                        style: data.value,
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
            <div id="abt-reflist-menu">
                <div className="inner">
                    <div className="panel" style={{ background: 'white', margin: '0 -5px'}}>
                        <PanelButton
                            id="import-ris"
                            onClick={this.handleSelect.bind(this, 'IMPORT_RIS', null)}
                            data-tooltip="Import References from RIS File"
                        >
                            <span className="dashicons dashicons-media-code"/>
                        </PanelButton>
                        <PanelButton
                            id="refresh-processor"
                            onClick={this.handleSelect.bind(this, 'REFRESH_PROCESSOR', null)}
                            data-tooltip="Refresh Reference List"
                        >
                            <span className="dashicons dashicons-update" />
                        </PanelButton>
                        <PanelButton
                            id="destroy-processor"
                            onClick={this.handleSelect.bind(this, 'DESTROY_PROCESSOR', null)}
                            data-tooltip="Delete All References"
                        >
                            <span className="dashicons dashicons-trash" />
                        </PanelButton>
                    </div>
                    <div id="style-select">
                        <VSelect
                            id="style-select"
                            onChange={this.handleSelect.bind(this, 'CHANGE_STYLE')}
                            value={this.state.selected}
                            placeholder="Choose citation style..."
                            options={this.styles}
                            clearable={false}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
