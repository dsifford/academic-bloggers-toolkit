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
        return (
            <div
                className={this.props.isSelected ? 'abt-card selected' : 'abt-card'}
                onClick={this.props.onClick}
                dangerouslySetInnerHTML={{ __html: this.props.html }} />
        );
    }

}
