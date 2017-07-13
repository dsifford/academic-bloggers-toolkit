import { observer } from 'mobx-react';
import * as React from 'react';

import { colors } from 'utils/styles';
import { createTooltip, destroyTooltip } from 'utils/Tooltips';

interface CardProps extends React.HTMLProps<HTMLDivElement> {
    readonly CSL: CSL.Data;
    readonly id: string;
    readonly index: string;
    readonly isSelected: boolean;
    readonly showTooltip: boolean;
    click(id: string, isSelected: boolean): void;
}

@observer
export class Card extends React.PureComponent<CardProps, {}> {
    timer: NodeJS.Timer;

    constructor(props: CardProps) {
        super(props);
    }

    click = () => {
        this.props.click(this.props.id, this.props.isSelected);
    };

    tooltip = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!this.props.showTooltip) return;
        const t = e.currentTarget;
        this.timer = setTimeout(() => {
            createTooltip(t, this.props.index, 'left');
        }, 700) as any;
    };

    destroyTooltip = () => {
        if (!this.props.showTooltip) return;
        clearTimeout(this.timer);
        destroyTooltip();
    };

    render() {
        const { CSL, isSelected } = this.props;
        return (
            <div
                data-reference-id={this.props.id}
                role="menuitem"
                className={isSelected ? 'abt-card abt-card_selected' : 'abt-card'}
                onClick={this.click}
                onDoubleClick={this.props.onDoubleClick}
                onMouseEnter={this.tooltip}
                onMouseLeave={this.destroyTooltip}
            >
                <div>
                    {CSL.title}
                </div>
                <div className="abt-card__people">
                    {parsePeople(CSL.author)}
                </div>
                <div className="abt-card__meta-container">
                    <div className="abt-card__date">
                        ({parseDate(CSL.issued)})
                    </div>
                    <div className="abt-card__source">
                        {CSL.journalAbbreviation || CSL['container-title'] || CSL.publisher || ''}
                    </div>
                    <div className="abt-card__pages">
                        {CSL.page || 'n.p.'}
                    </div>
                </div>
                <style jsx>{`
                    .abt-card {
                        border-bottom: solid 1px ${colors.border};
                        padding: 5px 10px;
                        cursor: pointer;
                        font-weight: 300;
                        user-select: none;
                    }
                    .abt-card_selected {
                        border-left: solid #0073a1 3px;
                        padding: 5px 10px 5px 7.5px;
                    }
                    .abt-card__people {
                        font-size: 0.8em;
                        font-weight: 500;
                    }
                    .abt-card__meta-container {
                        display: flex;
                        font-size: 0.8em;
                        justify-content: space-between;
                        white-space: nowrap;
                    }
                    .abt-card__date {
                        padding-right: 3px;
                    }
                    .abt-card__source {
                        padding: 0 3px;
                        font-style: italic;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                    .abt-card__pages {
                        padding-left: 3px;
                    }
                `}</style>
            </div>
        );
    }
}

function parseDate(date?: CSL.Date | ''): string {
    if (!date) return 'n.d.';
    if (date.year) return `${date.year}`;
    if (
        date['date-parts'] &&
        date['date-parts']![0].length !== 0 &&
        date['date-parts']![0][0] !== undefined
    ) {
        return `${date['date-parts']![0][0]}`;
    }
    return 'n.d.';
}

function parsePeople(p?: CSL.Person[]): string {
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
                return (prev += `${name}${p.length > i + 1 ? ', ' : '.'}`);
            case 2:
            default:
                return (prev += `${name}${p.length > i + 1 ? '...' : '.'}`);
        }
    }, '');
}
