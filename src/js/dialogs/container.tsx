import * as FocusTrap from 'focus-trap-react';
import { action, IObservableValue, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { outline, shadows } from 'utils/styles';

interface Props {
    /** Content to display in dialog */
    children: React.ReactElement<any>;
    /** Boxed observable that controls the dialog view state in parent */
    currentDialog: IObservableValue<string>;
    /** Opacity of background overlay */
    overlayOpacity?: number;
    /** Title for dialog */
    title: string;
    /** Width of dialog */
    width?: number;
    /** Callback to be called when dialog is closed */
    onClose?(): void;
}

@observer
export default class Container extends React.Component<Props> {
    static readonly closeLabel = top.ABT.i18n.dialogs.closeLabel;
    static defaultProps: Partial<Props> = {
        overlayOpacity: 0.7,
        width: 600,
        onClose: (): void => void 0,
    };

    /** Controls paused state of `FocusTrap`. Needed if nesting `FocusTrap`s */
    focusTrapPaused = observable(false);

    @action
    close = (e?: React.MouseEvent<HTMLButtonElement>): void => {
        if (e) e.preventDefault();
        this.props.currentDialog.set('');
        this.props.onClose!();
    };

    handleKeyEvent = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        switch (e.key) {
            case 'Escape':
                e.stopPropagation();
                return this.close();
            default:
                return;
        }
    };

    preventScrollPropagation = (e: React.WheelEvent<HTMLDivElement>): void => {
        if (e.cancelable) {
            e.preventDefault();
        }
    };

    render(): JSX.Element {
        const overlayStyle = {
            background: `rgba(0, 0, 0, ${this.props.overlayOpacity})`,
        };
        const dialogStyle: React.CSSProperties = {
            width: this.props.width,
        };
        const uniqueId = `dialog-label-${this.props.title.replace(/\s/g, '_')}`;
        return (
            // Disabled `react-a11y-event-has-role` because the div is a background
            // overlay. The "dialog" role is instead given to the first child.
            // tslint:disable-next-line
            <div
                className="dialog"
                style={overlayStyle}
                onWheel={this.preventScrollPropagation}
                onKeyDown={this.handleKeyEvent}
            >
                <FocusTrap paused={this.focusTrapPaused.get()}>
                    <div
                        style={dialogStyle}
                        role="dialog"
                        aria-labelledby={uniqueId}
                        className="dialog__main"
                    >
                        <header>
                            <span id={uniqueId} className="dialog__title">
                                {this.props.title}
                            </span>
                            <button aria-label={Container.closeLabel} onClick={this.close}>
                                <span className="dashicons dashicons-no-alt" />
                            </button>
                        </header>
                        <div className="dialog__body">
                            <this.props.children.type
                                {...this.props.children.props}
                                focusTrapPaused={this.focusTrapPaused}
                            />
                        </div>
                    </div>
                </FocusTrap>
                <style jsx>{`
                    header {
                        height: 40px;
                        font-size: 16px;
                        font-weight: 500;
                        color: #23282d;
                        display: flex;
                        justify-content: space-between;
                        line-height: 40px;
                        background: #f5f5f5;
                        border-radius: 4px 4px 0 0;
                        box-shadow: 0 1px 0 rgba(16, 22, 26, 0.15);
                    }
                    button {
                        cursor: pointer;
                        border: 0;
                        outline: 0;
                        padding: 0;
                        background: transparent;
                        color: #555d66;
                        width: 40px;
                    }
                    button:hover {
                        color: black;
                    }
                    button:focus {
                        outline: ${outline};
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
                    }
                    .dialog__main {
                        height: auto;
                        margin-bottom: -32px;
                        border-radius: 4px;
                        background: white;
                        box-shadow: ${shadows.depth_3};
                    }
                    .dialog__title {
                        margin: 0 10px;
                    }
                    .dashicons-no-alt {
                        font-size: 25px;
                        width: 25px;
                        height: 25px;
                    }
                `}</style>
            </div>
        );
    }
}
