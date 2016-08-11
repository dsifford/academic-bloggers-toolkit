import * as React from 'react';
import VSelect from 'react-virtualized-select';
import { observer } from 'mobx-react';
import { PanelButton } from './PanelButton';

declare const ABT_i18n: BackendGlobals.ABT_i18n;

interface Props extends React.HTMLProps<HTMLDivElement> {
    cslStyle: string;
    submitData(kind: string, data?: string);
}

interface State {
    style: string;
    selected: {
        label: string;
        value: string;
    };
}

@observer
export class Menu extends React.PureComponent<Props, State> {

    styles: {label: string, value: string}[] = ABT_CitationStyles;
    labels = ABT_i18n.referenceList.menu;

    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            style: this.props.cslStyle,
        };
    }

    handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        this.props.submitData(e.target.id);
    }

    handleSelect = (data: {label: string, value: string}) => {
        this.props.submitData('CHANGE_STYLE', data.value);
    }

    render() {
        return (
            <div id="abt-reflist-menu">
                <div className="inner">
                    <div className="subpanel">
                        <PanelButton
                            id="IMPORT_RIS"
                            onClick={this.handleClick}
                            data-tooltip={this.labels.tooltips.import}
                        >
                            <span className="dashicons dashicons-media-code"/>
                        </PanelButton>
                        <PanelButton
                            id="REFRESH_PROCESSOR"
                            onClick={this.handleClick}
                            data-tooltip={this.labels.tooltips.refresh}
                        >
                            <span className="dashicons dashicons-update" />
                        </PanelButton>
                        <PanelButton
                            id="DESTROY_PROCESSOR"
                            onClick={this.handleClick}
                            data-tooltip={this.labels.tooltips.destroy}
                        >
                            <span className="dashicons dashicons-trash" />
                        </PanelButton>
                        <PanelButton
                            href="https://github.com/dsifford/academic-bloggers-toolkit/blob/master/README.md"
                            target="_blank"
                            data-tooltip={this.labels.tooltips.help}
                        >
                            <span className="dashicons dashicons-editor-help" />
                        </PanelButton>
                    </div>
                    <div id="style-select-container">
                        <VSelect
                            id="style-select"
                            onChange={this.handleSelect}
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
