import * as React from 'react';

interface Props {
    /* The length and width in pixels of the spinner*/
    size: string;
    /* Set background color of container */
    bgColor?: string;
    /* If not in a containing element, this is minimum height */
    height?: string|Function;
    /* Add this for a background overlay */
    overlay?: boolean;
}

export class Spinner extends React.PureComponent<Props, {}> {

    style: React.CSSProperties = {};

    constructor(props) {
        super(props);
        if (this.props.height) {
            if (typeof this.props.height === 'function') {
                this.style.height = this.props.height();
                this.style.minHeight = this.props.height();
            }
            else {
                this.style.height = this.props.height;
                this.style.minHeight = this.props.height;
            }
        }
        if (this.props.bgColor) {
            this.style.backgroundColor = this.props.bgColor;
        }
    }

    render() {
        const cn = this.props.overlay
            ? 'abt-spinner-container abt-overlay'
            : 'abt-spinner-container';
        return (
            <div
                className={cn}
                style={this.style}
            >
                <div style={{lineHeight: 0}}>
                    <svg
                        className="abt-spinner"
                        width={this.props.size}
                        height={this.props.size}
                        viewBox="0 0 66 66"
                    >
                        <circle
                            className="abt-spinner-path"
                            fill="none"
                            strokeWidth="6"
                            strokeLinecap="round"
                            cx="33"
                            cy="33"
                            r="30"
                        />
                    </svg>
                </div>
            </div>
        );
    }
}
