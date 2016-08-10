import * as React from 'react';
import { observer } from 'mobx-react';

interface CardProps extends React.HTMLProps<HTMLDivElement> {
    isSelected: boolean;
    CSL: CSL.Data;
    id: string;
    click(id: string, isSelected: boolean);
}

@observer
export class Card extends React.Component<CardProps, {}> {

    constructor(props) {
        super(props);
    }

    click = () => {
        this.props.click(this.props.id, this.props.isSelected);
    }

    /* FIXME: Yuuuuuck! Ugly. */
    parsePeople = (p: CSL.Person[]): string => {
        if (!p) return '';
        return p.slice(0,4).reduce((prev, curr, i) => {
            if (i > 2) return prev;
            let name: string = '';
            if (curr.family && curr.given) {
                name = `${curr.family}, ${curr.given[0]}`;
            }
            if (curr.literal) {
                name = curr.literal;
            }
            if (name === '') return prev;
            switch (i) {
                case 0:
                case 1:
                    return prev += `${name}${p.length > i + 1 ? ', ' : '.'}`;
                case 2:
                    return prev += `${name}${p.length > i + 1 ? '...' : '.'}`;
            }
        }, '');
    }

    parseDate = (date: CSL.Date): string|number => {
        if (!date) return 'n.d.';
        return date.year
        ? date.year
        : date['date-parts'][0][0];
    }

    render() {
        const { CSL, isSelected } = this.props;
        return (
            <div
                className={isSelected ? 'abt-card selected' : 'abt-card'}
                onClick={this.click}
            >
                <div>{CSL.title}</div>
                <div className="abt-card-people">{this.parsePeople(CSL.author)}</div>
                <div className="abt-card-meta-container">
                    <div className="abt-card-date">({this.parseDate(CSL.issued)})</div>
                    <div className="abt-card-source"><em>{CSL.journalAbbreviation || CSL['container-title'] || CSL.publisher || ''}</em></div>
                    <div className="abt-card-pages">{CSL.page || 'n.p.'}</div>
                </div>
            </div>
        );
    }

}
