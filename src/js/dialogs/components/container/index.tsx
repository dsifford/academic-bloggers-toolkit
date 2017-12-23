// tslint:disable:max-classes-per-file
import * as FocusTrap from 'focus-trap-react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import * as styles from './container.scss';

interface Props {
    /** Content to display in dialog */
    children: React.ReactElement<any>;
    /** Opacity of background overlay */
    overlayOpacity?: number;
    /** Title for dialog */
    title: string;
    /** Width of dialog */
    width?: number;
    /** Callback to be called when dialog is closed */
    onClose(): void;
}

interface DefaultProps {
    overlayOpacity: number;
    width: number;
}

@observer
export default class Container extends React.Component<Props> {
    static readonly closeLabel = top.ABT.i18n.dialogs.closeLabel;
    static defaultProps: DefaultProps = {
        overlayOpacity: 0.7,
        width: 600,
    };

    /** Controls paused state of `FocusTrap`. Needed if nesting `FocusTrap`s */
    @observable focusTrapPaused = false;

    @action
    toggleFocusTrap = (): void => {
        this.focusTrapPaused = !this.focusTrapPaused;
    };

    @action
    close = (e?: React.MouseEvent<HTMLButtonElement>): void => {
        if (e) e.preventDefault();
        this.props.onClose();
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
        const { children: ChildElement, overlayOpacity, title, width } = this.props as Props &
            DefaultProps;
        const overlayStyle = {
            background: `rgba(0, 0, 0, ${overlayOpacity})`,
        };
        const uniqueId = `dialog-label-${title.replace(/\s/g, '_')}`;
        return (
            // Disabled because the div is a background overlay.
            // The "dialog" role is instead given to the first child.
            // tslint:disable-next-line:react-a11y-event-has-role
            <div
                className={styles.container}
                style={overlayStyle}
                onWheel={this.preventScrollPropagation}
                onKeyDown={this.handleKeyEvent}
            >
                <FocusTrap paused={this.focusTrapPaused}>
                    {/* <FocusTrap paused={this.focusTrapPaused.get()}> */}
                    <div
                        style={{ width, position: 'relative' }}
                        role="dialog"
                        aria-labelledby={uniqueId}
                        className={styles.dialog}
                    >
                        <header className={styles.header}>
                            <span id={uniqueId} className={styles.dialogTitle}>
                                {title}
                            </span>
                            <button
                                className={styles.button}
                                aria-label={Container.closeLabel}
                                onClick={this.close}
                            >
                                <span className="dashicons dashicons-no-alt" />
                            </button>
                        </header>
                        <ChildElement.type
                            {...ChildElement.props}
                            toggleFocusTrap={this.toggleFocusTrap}
                        />
                    </div>
                </FocusTrap>
            </div>
        );
    }
}
