import * as React from 'react';
import VSelect from 'react-virtualized-select';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PanelButton } from './PanelButton';

import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css';
import 'react-select/dist/react-select.min.css';

declare const ABT_i18n: BackendGlobals.ABT_i18n;
declare const ABT_Custom_CSL: BackendGlobals.ABT_Custom_CSL;

interface Props extends React.HTMLProps<HTMLDivElement> {
    cslStyle: string;
    submitData(kind: string, data?: string): void;
}

@observer
export class Menu extends React.PureComponent<Props, {}> {

    styles: {label: string, value: string}[];
    labels = ABT_i18n.referenceList.menu;

    @observable
    selected = {
        label: '',
        value: '',
    };

    constructor(props) {
        super(props);

        /**
         * ABT_Custom_CSL.value is `null` if there is either no provided file path
         *   or if the path to the file is invalid.
         */
        if (ABT_Custom_CSL.value === null) {
            this.styles = ABT_CitationStyles;
        }
        else {
            this.styles = [
                { label: 'Custom Style', value: 'header' },
                { label: ABT_Custom_CSL.label, value: ABT_Custom_CSL.value },
                { label: 'Pre-defined Styles', value: 'header' },
                ...ABT_CitationStyles,
            ];
        }

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
                            optionRenderer={renderer}
                            optionHeight={50}
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

/**
 * Custom render function for React Virtualized Select
 * @param  {Object} focusedOption The option currently focused in the dropdown
 * @param  {Function} focusOption Callback to update the focused option. (on mouseover)
 * @param  {Object} option        The option to be rendered
 * @param  {Function} selectValue Callback to update the selected values. (on click)
 * @param  {Object[]} valueArray  Array of currently selected options.
 */
function renderer({focusedOption, focusOption, option, selectValue, valueArray}) {
    const style: React.CSSProperties = {
        alignItems: 'center',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        height: 50,
        padding: '0 5px',
    };

    if (option.value === 'header') {
        style.backgroundColor = '#eee';
        style.fontWeight = 'bold';
        style.cursor = 'default';
        return (
            <div
                style={style}
                children={option.label}
            />
        );
    }

    if (option === focusedOption) {
        style.backgroundColor = '#f5f5f5';
    }

    if (valueArray.indexOf(option) >= 0) {
        style.fontWeight = 'bold';
    }

    const click = () => selectValue(option);
    const focus = () => focusOption(option);

    return (
        <div
            style={style}
            onClick={click}
            onMouseOver={focus}
            children={option.label}
        />
    );
}
