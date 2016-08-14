import * as React from 'react';
import VSelect from 'react-virtualized-select';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PanelButton } from './PanelButton';

declare const ABT_i18n: BackendGlobals.ABT_i18n;

interface Props extends React.HTMLProps<HTMLDivElement> {
    cslStyle: string;
    submitData(kind: string, data?: string): void;
}

@observer
export class Menu extends React.PureComponent<Props, {}> {

    styles: {label: string, value: string}[] = ABT_CitationStyles;
    labels = ABT_i18n.referenceList.menu;

    @observable
    selected = {
        label: '',
        value: '',
    };

    constructor(props) {
        super(props);
        this.selected.value = this.props.cslStyle;
        this.selected.label = this.styles.find(d => d.value === this.props.cslStyle).label;
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
                            value={this.selected}
                            placeholder={this.labels.stylePlaceholder}
                            options={this.styles}
                            clearable={false}
                            backspaceRemoves={false}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
