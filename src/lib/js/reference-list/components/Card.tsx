import * as React from 'react';
import { observer } from 'mobx-react';

interface CardProps extends React.HTMLProps<HTMLDivElement> {
    isSelected: boolean;
    CSL: CSL.Data;
    id: string;
    click(id: string, isSelected: boolean);
}

@observer
export class Card extends React.PureComponent<CardProps, {}> {

    constructor(props) {
        super(props);
    }

    click = () => {
        this.props.click(this.props.id, this.props.isSelected);
    }

    parsePeople = (p: CSL.Person[]): string => {
        if (!p) return '';
        return p.slice(0, 4).reduce((prev, curr, i) => {
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
                default:
                    return prev += `${name}${p.length > i + 1 ? '...' : '.'}`;
            }
        }, '');
    }

    parseDate = (date: CSL.Date): string|number => {
        if (!date) return 'n.d.';
        if (date.year) return date.year;
        if (date['date-parts'] && date['date-parts'][0].length !== 0 && date['date-parts'][0][0] !== undefined)
            return date['date-parts'][0][0];
        return 'n.d.';
    }

    render() {
        const { CSL, isSelected } = this.props;
        return (
            <div
                role="menuitem"
                className={isSelected ? 'abt-card abt-card_selected' : 'abt-card'}
                onClick={this.click}
            >
                <div>{CSL.title}</div>
                <div className="abt-card__people">{this.parsePeople(CSL.author)}</div>
                <div className="abt-card__meta-container">
                    <div className="abt-card__date">({this.parseDate(CSL.issued)})</div>
                    <div className="abt-card__source">
                        {CSL.journalAbbreviation || CSL['container-title'] || CSL.publisher || ''}
                    </div>
                    <div className="abt-card__pages">{CSL.page || 'n.p.'}</div>
                </div>
            </div>
        );
    }

}
