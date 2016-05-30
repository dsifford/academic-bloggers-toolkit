import * as React from 'react';
import { referenceWindowEvents } from '../../../utils/Constants';
const { PUBMED_DATA_SUBMIT, TOGGLE_MANUAL, TOGGLE_INLINE_ATTACHMENT } = referenceWindowEvents;

interface ButtonRowProps {
    addManually: boolean;
    eventHandler: Function;
    attachInline: boolean;
}

export class ButtonRow extends React.Component<ButtonRowProps, {}> {

    constructor(props: ButtonRowProps) {
        super(props);
    }

    searchPubmedClick() {
        let wm = top.tinyMCE.activeEditor.windowManager;
        wm.open({
            title: 'Search PubMed for Reference',
            url: wm.windows[0].settings.params.baseUrl + 'pubmed-window.html',
            width: 600,
            height: 100,
            onsubmit: (e) => {
                this.props.eventHandler(
                    new CustomEvent(PUBMED_DATA_SUBMIT, { detail: e.target.data.pmid, })
                );
            },
        });
    }

    addManuallyClick() {
        this.props.eventHandler(
            new CustomEvent(TOGGLE_MANUAL)
        );
    }

    handleToggleInlineAttachment() {
        this.props.eventHandler(
            new CustomEvent(TOGGLE_INLINE_ATTACHMENT)
        );
    }

    render() {
        return(
            <div className='row' style={{
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
            }}>
                <input
                    id='addManually'
                    style={{ margin: '0 5px', }}
                    onClick={this.addManuallyClick.bind(this)}
                    type='button'
                    className='btn'
                    value={
                        this.props.addManually === false
                        ? 'Add Manually'
                        : 'Add with Identifier'} />
                <input
                    id='searchPubmed'
                    style={{ margin: '0 5px', }}
                    onClick={this.searchPubmedClick.bind(this)}
                    type='button'
                    className='btn'
                    value='Search Pubmed' />
                <span style={{
                    borderRight: 'solid 2px #ccc',
                    height: 25, margin: '0 10px',
                }} />
                <input
                    style={{ margin: '0 5px', }}
                    id='submit-btn'
                    type='submit'
                    className='submit-btn'
                    value='Insert Reference' />
                <div>
                    <label
                        htmlFor='attachInline'
                        style={{ padding: '5px', whiteSpace: 'nowrap', }}
                        children='Attach Inline' />
                    <input
                        type='checkbox'
                        id='attachInline'
                        checked={this.props.attachInline}
                        onChange={this.handleToggleInlineAttachment.bind(this)} />
                </div>
            </div>
        );
    }

}
