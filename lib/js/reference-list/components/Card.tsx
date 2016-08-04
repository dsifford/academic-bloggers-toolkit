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

    parsePeople = (p: CSL.Person[]): string =>
        p.reduce((prev, curr, i) => {
            if (i < 2)
                return prev += `${curr.family}, ${curr.given[0]}${p.length > i + 1 ? ', ' : `.`}`;
            if (i === 2)
                return prev +=`${curr.family}, ${curr.given[0]}${p.length > i + 1 ? '...' : `.`}`;
            return prev;
        }, '');

    parseDate = (date: CSL.Date): number|string =>
        date.year
        ? date.year
        : date['date-parts'][0][0];

    render() {
        const { CSL, isSelected } = this.props;
        return (
            <div
                className={isSelected ? 'abt-card selected' : 'abt-card'}
                onClick={this.click}>
                <div>{CSL.title}</div>
                <div style={{fontSize: '0.8em', fontWeight: 600}}>{this.parsePeople(CSL.author)}</div>
                <div style={{fontSize: '0.8em', display: 'flex', justifyContent: 'space-between'}}>
                    <div>({this.parseDate(CSL.issued)})</div>
                    <div><em>{CSL.journalAbbreviation}</em></div>
                    <div>{CSL.page}</div>
                </div>
            </div>
        );
    }

}
