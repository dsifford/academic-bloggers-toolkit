import * as React from 'react';

interface CardProps extends React.HTMLProps<HTMLDivElement> {
    isSelected: boolean;
    html: string;
}

export class Card extends React.Component<CardProps, {}> {

    constructor(props) {
        super(props);
    }

    render() {

        let style: React.CSSProperties = {
            borderBottom: '1px solid #E5E5E5',
            padding: 5,
            cursor: 'pointer',
        };

        if (this.props.isSelected) {
            style.backgroundColor = 'rgba(243, 255, 62, 0.2)';
            style.textShadow = '0px 0px 0.1px';
        }

        return (
            <div
                className='abt-card'
                onClick={this.props.onClick}
                style={style}
                dangerouslySetInnerHTML={{ __html: this.props.html }} />
        );
    }

}
