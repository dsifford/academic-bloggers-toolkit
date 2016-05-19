import * as React from 'react';

interface CardProps {
    dragStart()
    dragOver()
    dragLeave()
    drop()
    onClick()
    num: number
    isSelected: number[]
    html: string
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
        }

        if (this.props.isSelected.indexOf(this.props.num) > -1) {
            style.backgroundColor = 'rgba(243, 255, 62, 0.2)';
            style.textShadow = '0px 0px 0.1px';
        }

        return (
            <div
                className='abt-card'
                draggable={true}
                onDragStart={this.props.dragStart}
                onDragOver={this.props.dragOver}
                onDragLeave={this.props.dragLeave}
                onDrop={this.props.drop}
                onClick={this.props.onClick}
                data-num={this.props.num}
                style={style} >
                <strong
                    children={`${this.props.num+1}. `} />
                <span
                    style={{pointerEvents: 'none'}}
                    dangerouslySetInnerHTML={{ __html: this.props.html }}
                    data-num={this.props.num} />
            </div>
        )
    }

}
