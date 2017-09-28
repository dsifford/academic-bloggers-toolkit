import { action, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { colors } from 'utils/styles';

interface CardProps extends React.HTMLProps<HTMLDivElement> {
    /** Data to be displayed in the card */
    readonly CSL: CSL.Data;
    /** The index of the card in the list (corrected to start at 1) */
    readonly index: number;
    /** Describes whether or not the index badge should be displayed on hover */
    readonly indexOnHover: boolean;
    /** Describes whether or not the card is currently selected */
    readonly isSelected: boolean;
}

@observer
export default class Card extends React.Component<CardProps> {
    /** Controls the visibility state of the index badge, if applicable */
    isShowingIndex = observable(false);

    /** Controls the delay period between hovering and displaying the index badge */
    timer: NodeJS.Timer;

    @action
    hideIndex = () => {
        clearTimeout(this.timer);
        this.isShowingIndex.set(false);
    };

    @action
    showIndex = () => {
        this.timer = setTimeout(() => {
            runInAction(() => this.isShowingIndex.set(true));
        }, 500) as any;
    };

    render() {
        const { CSL, indexOnHover, isSelected } = this.props;
        return (
            <div
                id={CSL.id}
                role="menuitem"
                className={isSelected ? 'abt-card abt-card--selected' : 'abt-card'}
                onClick={this.props.onClick}
                onDoubleClick={this.props.onDoubleClick}
                onMouseEnter={indexOnHover ? this.showIndex : undefined}
                onMouseLeave={indexOnHover ? this.hideIndex : undefined}
            >
                <div
                    aria-hidden={!this.isShowingIndex.get()}
                    className={
                        this.isShowingIndex.get()
                            ? 'item-number item-number--active'
                            : 'item-number'
                    }
                    children={this.props.index}
                />
                <div children={CSL.title} />
                <div className="abt-card__people" children={parsePeople(CSL.author)} />
                <div className="abt-card__meta-container">
                    <div className="abt-card__date" children={`(${parseDate(CSL.issued)})`} />
                    <div
                        className="abt-card__source"
                        children={
                            CSL.journalAbbreviation || CSL['container-title'] || CSL.publisher || ''
                        }
                    />
                    <div className="abt-card__pages" children={CSL.page || 'n.p.'} />
                </div>
                <style jsx>{`
                    .abt-card {
                        position: relative;
                        border-bottom: solid 1px ${colors.border};
                        padding: 5px 10px;
                        cursor: pointer;
                        font-weight: 300;
                        user-select: none;
                    }
                    .abt-card--selected {
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
                    .item-number {
                        position: absolute;
                        right: 0;
                        top: 50%;
                        visibility: hidden;
                        transform: translateY(-50%) translateX(100%);
                        padding: 5px 8px;
                        background: ${colors.tooltip_gray.setAlpha(0.7)};
                        color: white;
                        border-top-left-radius: 2px;
                        border-bottom-left-radius: 2px;
                        font-weight: 500;
                    }
                    .item-number--active {
                        animation: slide-in 200ms cubic-bezier(0, 0, 0.2, 1) forwards;
                    }
                    @keyframes slide-in {
                        0% {
                            transform: translateY(-50%) translateX(100%);
                            opacity: 0;
                        }
                        50% {
                            transform: translateY(-50%) translateX(1%);
                        }
                        100% {
                            transform: translateY(-50%) translateX(0);
                            opacity: 1;
                            visibility: visible;
                        }
                    }
                `}</style>
            </div>
        );
    }
}

function parseDate(date?: CSL.DateType | any): string {
    if (!date) return 'n.d.';
    if (date.year) return `${date.year}`;
    if (
        date['date-parts'] &&
        date['date-parts'][0].length !== 0 &&
        date['date-parts'][0][0] !== undefined
    ) {
        return `${date['date-parts'][0][0]}`;
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
