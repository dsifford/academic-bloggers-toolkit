import { action, IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
    title: string;
    children: React.ReactElement<any>;
    currentDialog: IObservableValue<string>;
}

@observer
export default class extends React.Component<Props, {}> {
    @action
    close = () => {
        this.props.currentDialog.set('');
        removeEventListener('keydown', this.handleKeyEvent);
    };

    handleKeyEvent = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'Escape':
                return this.close();
            default:
                return;
        }
    }

    componentDidMount() {
        addEventListener('keydown', this.handleKeyEvent);
    }

    render() {
        return (
            <div className="dialog" role="dialog" aria-labelledby="dialog-label">
                <div role="document" className="dialog__main">
                    <header className="dialog__header">
                        <span id="dialog-label">
                            {this.props.title}
                        </span>
                        <button
                            aria-label="close"
                            className="dashicons dashicons-no-alt"
                            onClick={this.close}
                        />
                    </header>
                    <div className="dialog__body">
                        {this.props.children}
                    </div>
                </div>
                <style jsx>{`
                    button {
                        font-size: 25px;
                        line-height: 40px;
                        height: 40px;
                        cursor: pointer;
                        border: 0;
                        outline: 0;
                        padding: 0;
                        background: transparent;
                        color: #555d66;
                    }
                    button:hover {
                        color: black;
                    }
                    .dialog {
                        position: fixed;
                        height: 100vh;
                        width: 100vw;
                        top: 0;
                        left: 0;
                        z-index: 9999;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        background: rgba(0, 0, 0, .7);
                    }
                    .dialog__main {
                        width: 600px;
                        height: auto;
                        min-height: 100px;
                        border-radius: 4px;
                        background: white;
                    }
                    .dialog__header {
                        height: 40px;
                        font-size: 16px;
                        font-weight: 500;
                        color: #23282d;
                        display: flex;
                        justify-content: space-between;
                        padding: 0 15px;
                        line-height: 40px;
                        background: #f5f5f5;
                        border-radius: 4px 4px 0 0;
                        box-shadow: 0 1px 0 rgba(16, 22, 26, .15);
                    }
                `}</style>
            </div>
        );
    }
}
