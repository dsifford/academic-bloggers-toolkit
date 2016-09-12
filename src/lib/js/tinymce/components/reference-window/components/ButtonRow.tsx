import * as React from 'react';
import { observer } from 'mobx-react';

import { createTooltip, destroyTooltip } from '../../../../utils/Tooltips';

interface Props {
    addManually: boolean;
    attachInline: boolean;
    attachInlineToggle: React.EventHandler<React.FormEvent<HTMLInputElement>>;
    toggleManual: React.EventHandler<React.MouseEvent<HTMLInputElement>>;
    pubmedCallback(pmid: string): void;
}

@observer
export class ButtonRow extends React.PureComponent<Props, {}> {

    labels = (top as any).ABT_i18n.tinymce.referenceWindow.buttonRow;

    searchPubmedClick() {
        let wm = top.tinyMCE.activeEditor.windowManager;
        wm.open({
            height: 100,
            onsubmit: (e) => {
                this.props.pubmedCallback(e.target.data.pmid);
            },
            title: this.labels.pubmedWindowTitle,
            url: wm.windows[0].settings.params.baseUrl + 'pubmed-window.html',
            width: 600,
        });
    }

    handleMouseOver = (e) => {
        createTooltip(e, e.target.dataset['tooltip'], 'left');
    }

    render() {
        return(
            <div id="button-row" className="row">
                <div>
                    <input
                        id="addManually"
                        onClick={this.props.toggleManual}
                        type="button"
                        className="abt-btn abt-btn-flat"
                        value={
                            this.props.addManually === false
                            ? this.labels.addManually
                            : this.labels.addWithIdentifier}
                    />
                </div>
                <div>
                    <input
                        id="searchPubmed"
                        onClick={this.searchPubmedClick.bind(this)}
                        type="button"
                        className="abt-btn abt-btn-flat"
                        value={this.labels.searchPubmed}
                    />
                </div>
                <div>
                    <span className="separator" />
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="inline-toggle"
                        className="toggle hidden"
                        checked={this.props.attachInline}
                        onChange={this.props.attachInlineToggle}
                    />
                    <label
                        htmlFor="inline-toggle"
                        className="toggle-lbl"
                        data-tooltip="Insert citation inline"
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={destroyTooltip}
                    />
                </div>
                <div>
                    <input
                        id="submit-btn"
                        type="submit"
                        className="abt-btn-submit"
                        value={this.labels.addReference}
                    />
                </div>
            </div>
        );
    }
}
