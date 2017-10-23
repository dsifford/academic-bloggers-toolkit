import * as React from 'react';
import { colors } from 'utils/styles';

interface Props {
    /** Badge background color */
    color?: string;
    /** Number to be displayed on badge */
    count: number;
}

export default class Badge extends React.PureComponent<Props> {
    static defaultProps: Partial<Props> = {
        color: `${colors.blue}`,
    };
    render(): JSX.Element {
        const { count, color } = this.props;
        return (
            <div style={{ background: color }}>
                {count < 99 ? count : '99+'}
                <style jsx>{`
                    div {
                        color: #fff;
                        border-radius: 20px;
                        padding: 0 10px;
                        font-size: 11px;
                        font-weight: bold;
                        line-height: 20px;
                        margin-left: 10px;
                        display: inline-block;
                        text-transform: uppercase;
                        position: relative;
                    }
                `}</style>
            </div>
        );
    }
}
