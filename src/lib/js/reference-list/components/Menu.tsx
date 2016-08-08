import * as React from 'react';
import VSelect from 'react-virtualized-select';
import { observer } from 'mobx-react';
import { PanelButton } from './PanelButton';

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

    styles: {label: string, value: string}[] = ABT_CitationStyles;
    labels = ABT_i18n.referenceList.menu;

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
                return;
        }
    }

    render() {
        return (
            <div id="abt-reflist-menu">
                <div className="inner">
                    <div className="subpanel">
                        <PanelButton
                            id="import-ris"
                            onClick={this.handleSelect.bind(this, 'IMPORT_RIS', null)}
                            data-tooltip={this.labels.tooltips.import}
                        >
                            <span className="dashicons dashicons-media-code"/>
                        </PanelButton>
                        <PanelButton
                            id="refresh-processor"
                            onClick={this.handleSelect.bind(this, 'REFRESH_PROCESSOR', null)}
                            data-tooltip={this.labels.tooltips.refresh}
                        >
                            <span className="dashicons dashicons-update" />
                        </PanelButton>
                        <PanelButton
                            id="destroy-processor"
                            onClick={this.handleSelect.bind(this, 'DESTROY_PROCESSOR', null)}
                            data-tooltip={this.labels.tooltips.destroy}
                        >
                            <span className="dashicons dashicons-trash" />
                        </PanelButton>
                        <PanelButton
                            id="usage-instructions"
                            href="https://github.com/dsifford/academic-bloggers-toolkit/blob/master/README.md"
                            target="_blank"
                            data-tooltip={this.labels.tooltips.help}
                        >
                            <span className="dashicons dashicons-editor-help" />
                        </PanelButton>
                    </div>
                    <div id="style-select">
                        <VSelect
                            id="style-select"
                            onChange={this.handleSelect.bind(this, 'CHANGE_STYLE')}
                            value={this.state.selected}
                            placeholder={this.labels.stylePlaceholder}
                            options={this.styles}
                            clearable={false}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
