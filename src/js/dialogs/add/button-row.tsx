import { action, IObservableValue, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { colors, shadows } from 'utils/styles';

import { ToggleSwitch } from 'components/ToggleSwitch';
import Container from '../container';
import PubmedDialog from '../pubmed/';

interface Props {
    addManually: IObservableValue<boolean>;
    attachInline: IObservableValue<boolean>;
    attachInlineToggle: React.EventHandler<React.FormEvent<HTMLInputElement>>;
    toggleManual: React.EventHandler<React.MouseEvent<HTMLInputElement>>;
    pubmedCallback(pmid: string): void;
}

@observer
export class ButtonRow extends React.PureComponent<Props, {}> {
    static readonly labels = top.ABT_i18n.tinymce.referenceWindow.buttonRow;

    currentDialog = observable('');

    @action
    searchPubmedClick = () => {
        this.currentDialog.set('PUBMED');
    };

    @action
    handleSubmit = (data: string) => {
        this.currentDialog.set('');
        this.props.pubmedCallback(data);
    };

    render() {
        return (
            <div className="btn-row">
                {this.currentDialog.get() === 'PUBMED' &&
                    <Container
                        overlayOpacity={0.2}
                        currentDialog={this.currentDialog}
                        title="Search PubMed"
                    >
                        <PubmedDialog onSubmit={this.handleSubmit} />
                    </Container>}
                <input
                    id="addManually"
                    onClick={this.props.toggleManual}
                    type="button"
                    className="abt-btn abt-btn_flat"
                    value={
                        this.props.addManually.get()
                            ? ButtonRow.labels.addWithIdentifier
                            : ButtonRow.labels.addManually
                    }
                />
                <input
                    id="searchPubmed"
                    onClick={this.searchPubmedClick}
                    type="button"
                    className={
                        this.props.addManually.get()
                            ? 'abt-btn abt-btn_flat abt-btn_disabled'
                            : 'abt-btn abt-btn_flat'
                    }
                    value={ButtonRow.labels.searchPubmed}
                />
                <span className="separator" />
                <ToggleSwitch
                    onChange={this.props.attachInlineToggle}
                    label={ButtonRow.labels.insertInline}
                    checked={this.props.attachInline}
                />
                <input
                    form="add-reference"
                    id="submit-btn"
                    type="submit"
                    className="abt-btn abt-btn_submit"
                    value={ButtonRow.labels.addReference}
                />
                <style jsx>{`
                    .btn-row {
                        display: flex;
                        padding: 10px;
                        align-items: center;
                        background: ${colors.light_gray};
                        box-shadow: ${shadows.top_border};
                        border-radius: 0 0 2px 2px;
                        margin: 0;
                        justify-content: space-between;
                    }
                    span {
                        border-right: solid 2px ${colors.border};
                        height: 30px;
                        display: inline-block;
                    }
                `}</style>
            </div>
        );
    }
}
