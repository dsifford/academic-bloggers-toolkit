import * as React from 'react';

interface Props {
    /* The length and width in pixels of the spinner*/
    size: string;
    /* Set background color of container */
    bgColor?: string;
    /* If not in a containing element, this is minimum height */
    height?: string | number | (() => string | number);
    /* Add this for a background overlay */
    overlay?: boolean;
    /* Additional style properties for the containing DIV */
    style?: React.CSSProperties;
}

export class Spinner extends React.PureComponent<Props> {
    static defaultProps: Partial<Props> = {
        bgColor: 'transparent',
    };

    style: React.CSSProperties = { ...this.props.style };

    constructor(props: Props) {
        super(props);
        if (this.props.height) {
            if (typeof this.props.height === 'function') {
                this.style.height = this.props.height();
                this.style.minHeight = this.props.height();
            } else {
                this.style.height = this.props.height;
                this.style.minHeight = this.props.height;
            }
        }
        this.style.backgroundColor = this.props.bgColor;
    }

    render() {
        const cn = this.props.overlay
            ? 'abt-spinner abt-spinner_overlay'
            : 'abt-spinner';
        return (
            <div className={cn} style={this.style}>
                <svg
                    width={this.props.size}
                    height={this.props.size}
                    viewBox="0 0 66 66"
                >
                    <circle
                        fill="none"
                        strokeWidth="6"
                        strokeLinecap="round"
                        cx="33"
                        cy="33"
                        r="30"
                    />
                </svg>
                <style jsx>{`
                    @keyframes colors {
                        0% {
                            stroke: #4285f4;
                        }
                        25% {
                            stroke: #de3e35;
                        }
                        50% {
                            stroke: #f7c223;
                        }
                        75% {
                            stroke: #1b9a59;
                        }
                        100% {
                            stroke: #4285f4;
                        }
                    }
                    @keyframes dash {
                        0% {
                            stroke-dashoffset: 187;
                        }
                        50% {
                            stroke-dashoffset: 46.75;
                            -webkit-transform: rotate(135deg);
                            transform: rotate(135deg);
                        }
                        100% {
                            stroke-dashoffset: 187;
                            -webkit-transform: rotate(450deg);
                            transform: rotate(450deg);
                        }
                    }
                    @keyframes rotator {
                        0% {
                            -webkit-transform: rotate(0deg);
                            transform: rotate(0deg);
                        }
                        100% {
                            -webkit-transform: rotate(270deg);
                            transform: rotate(270deg);
                        }
                    }
                    .abt-spinner {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        pointer-events: none;
                        align-items: center;
                        justify-content: center;
                    }
                    .abt-spinner_overlay {
                        position: absolute;
                        background: rgba(0, 0, 0, 0.2);
                    }
                    svg {
                        animation: rotator 1.4s linear infinite;
                    }
                    circle {
                        stroke-dasharray: 187;
                        stroke-dashoffset: 0;
                        transform-origin: center;
                        animation: dash 1.4s ease-in-out infinite,
                            colors 5.6s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }
}
