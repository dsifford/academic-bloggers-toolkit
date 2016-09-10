import * as React from 'react';

interface Props {
    /* The length and width in pixels of the spinner*/
    size: string;
    /* If not in a containing element, this is minimum height */
    height?: string;
    /* Add this for a background overlay */
    overlay?: boolean;
}

export class Spinner extends React.PureComponent<Props, {}> {
    render() {
        const cn = this.props.overlay
            ? 'abt-spinner-container abt-overlay'
            : 'abt-spinner-container';
        return (
            <div
                className={cn}
                style={this.props.height ? { minHeight: this.props.height } : null}
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
