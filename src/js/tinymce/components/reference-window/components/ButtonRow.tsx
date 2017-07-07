import { observer } from 'mobx-react';
import * as React from 'react';

import { ToggleSwitch } from '../../../../components/ToggleSwitch';

interface Props {
    addManually: boolean;
    attachInline: boolean;
    attachInlineToggle: React.EventHandler<React.FormEvent<HTMLInputElement>>;
    toggleManual: React.EventHandler<React.MouseEvent<HTMLInputElement>>;
    pubmedCallback(pmid: string): void;
}

@observer
export class ButtonRow extends React.PureComponent<Props, {}> {
    labels = top.ABT_i18n.tinymce.referenceWindow.buttonRow;

    searchPubmedClick = () => {
        const wm = top.tinyMCE.activeEditor.windowManager;
        wm.open({
            height: 100,
            onsubmit: e => {
                this.props.pubmedCallback(e.target.data.pmid);
            },
            title: this.labels.pubmedWindowTitle,
            url: wm.windows[0].settings.params.baseUrl + 'pubmed-window.html',
            width: 600,
        });
    };

    render() {
        return (
            <div id="button-row" className="row">
                <div>
                    <input
                        id="addManually"
                        onClick={this.props.toggleManual}
                        type="button"
                        className="abt-btn abt-btn_flat"
                        value={
                            this.props.addManually === false
                                ? this.labels.addManually
                                : this.labels.addWithIdentifier
                        }
                    />
                </div>
                <div>
                    <input
                        id="searchPubmed"
                        onClick={this.searchPubmedClick}
                        type="button"
                        className="abt-btn abt-btn_flat"
                        value={this.labels.searchPubmed}
                    />
                </div>
                <div>
                    <span className="separator" />
                </div>
                <ToggleSwitch
                    onChange={this.props.attachInlineToggle}
                    label={this.labels.insertInline}
                    checked={this.props.attachInline}
                />
                <div>
                    <input
                        id="submit-btn"
                        type="submit"
                        className="abt-btn abt-btn_submit"
                        value={this.labels.addReference}
                    />
                </div>
            </div>
        );
    }
}
