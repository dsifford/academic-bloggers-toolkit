import { action, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import * as styles from './item.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {
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
export default class Item extends React.Component<Props> {
    /** Controls the visibility state of the index badge, if applicable */
    isShowingIndex = observable(false);

    /** Controls the delay period between hovering and displaying the index badge */
    timer: NodeJS.Timer;

    @action
    hideIndex = (): void => {
        clearTimeout(this.timer);
        this.isShowingIndex.set(false);
    };

    @action
    showIndex = (): void => {
        this.timer = setTimeout(() => {
            runInAction(() => this.isShowingIndex.set(true));
        }, 500) as any;
    };

    render(): JSX.Element {
        const { CSL, indexOnHover, isSelected } = this.props;
        return (
            <div
                id={CSL.id}
                role="menuitem"
                className={isSelected ? styles.itemSelected : styles.item}
                onClick={this.props.onClick}
                onDoubleClick={this.props.onDoubleClick}
                onMouseEnter={indexOnHover ? this.showIndex : undefined}
                onMouseLeave={indexOnHover ? this.hideIndex : undefined}
            >
                <div
                    aria-hidden={!this.isShowingIndex.get()}
                    className={this.isShowingIndex.get() ? styles.numberActive : styles.number}
                    children={this.props.index}
                />
                <div children={CSL.title} />
                <div className={styles.people} children={parsePeople(CSL.author)} />
                <div className={styles.container}>
                    <div className={styles.date} children={`(${parseDate(CSL.issued)})`} />
                    <div
                        className={styles.source}
                        children={
                            CSL.journalAbbreviation || CSL['container-title'] || CSL.publisher || ''
                        }
                    />
                    <div className={styles.pages} children={CSL.page || 'n.p.'} />
                </div>
            </div>
        );
    }
}

function parseDate(date?: CSL.Date | any): string {
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
