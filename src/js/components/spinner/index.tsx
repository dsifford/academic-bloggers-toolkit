import React from 'react';
import styles from './spinner.scss';

interface Props {
    /**
     * Set background color of container
     */
    bgColor?: string;
    /**
     * If not in a containing element, this is minimum height
     */
    height?: string | number | (() => string | number);
    /**
     * Add this for a background overlay
     */
    overlay?: boolean;
    /**
     * The length and width in pixels of the spinner
     */
    size: string;
    /**
     * Additional style properties for the containing div
     */
    style?: React.CSSProperties;
}

interface DefaultProps {
    bgColor: string;
}

export default class Spinner extends React.PureComponent<Props> {
    static defaultProps: DefaultProps = {
        bgColor: 'transparent',
    };

    style: React.CSSProperties;

    constructor(props: Props & DefaultProps) {
        super(props);
        this.style = { ...props.style };
        if (this.props.height) {
            if (typeof props.height === 'function') {
                this.style.height = props.height();
                this.style.minHeight = props.height();
            } else {
                this.style.height = props.height;
                this.style.minHeight = props.height;
            }
        }
        this.style.backgroundColor = props.overlay ? undefined : props.bgColor;
    }

    render(): JSX.Element {
        const { overlay, size } = this.props;
        const cn = `${styles.spinner} ${overlay ? styles.spinnerOverlay : ''}`;
        return (
            <div className={cn} style={this.style}>
                <svg width={size} height={size} viewBox="0 0 66 66">
                    <circle
                        fill="none"
                        strokeWidth="6"
                        strokeLinecap="round"
                        cx="33"
                        cy="33"
                        r="30"
                    />
                </svg>
            </div>
        );
    }
}
