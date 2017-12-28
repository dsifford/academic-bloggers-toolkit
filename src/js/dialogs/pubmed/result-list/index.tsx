import { decode } from 'he';
import { observer } from 'mobx-react';
import * as React from 'react';

import Button from 'components/button';
import * as styles from './result-list.scss';

interface Props {
    /** List of results returned from pubmed search */
    results: CSL.Data[];
    /** Callback to be performed when a result is chosen */
    onSelect(pmid: string): void;
}

@observer
export default class ResultList extends React.Component<Props> {
    static readonly labels = top.ABT.i18n.dialogs.pubmed;

    /** Required so that result list can be scrolled to top after each new search */
    element: HTMLElement;

    bindRefs = (c: HTMLDivElement): void => {
        this.element = c;
    };

    componentDidUpdate(): void {
        this.element.scrollTop = 0;
    }

    handleClick = (e: React.MouseEvent<HTMLInputElement>): void => {
        this.props.onSelect(e.currentTarget.id);
    };

    handleWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = !isScrollingDown;
        const isScrollable =
            e.currentTarget.scrollHeight > e.currentTarget.clientHeight;
        const atBottom =
            e.currentTarget.scrollHeight <=
            e.currentTarget.clientHeight + Math.ceil(e.currentTarget.scrollTop);
        const atTop = e.currentTarget.scrollTop === 0;

        if (isScrollable && !atBottom && isScrollingDown) {
            e.cancelable = false;
        }

        if (isScrollable && !atTop && isScrollingUp) {
            e.cancelable = false;
        }
    };

    render(): JSX.Element {
        return (
            <div
                className={styles.main}
                ref={this.bindRefs}
                onWheel={this.handleWheel}
            >
                {this.props.results.map(result => (
                    <div key={result.PMID} className={styles.result}>
                        <div className={styles.row1}>
                            <span className={styles.source}>
                                {result.journalAbbreviation}
                            </span>
                            <span>{result.issued!['date-parts']![0][0]}</span>
                        </div>
                        {/* tslint:disable-next-line:react-no-dangerous-html */}
                        <div
                            dangerouslySetInnerHTML={{
                                __html: decode(result.title!),
                            }}
                            className={styles.row2}
                        />
                        <div className={styles.row3}>
                            <div>
                                {/* FIXME: This should probably be extracted to a component/function */}
                                {result.author!
                                    .slice(0, 3)
                                    .map(
                                        el =>
                                            `${el.family}, ${el.given!
                                                .charAt(0)
                                                .toUpperCase()}`,
                                    )
                                    .join(', ')}
                            </div>
                            <div className={styles.buttonGroup}>
                                <Button
                                    flat
                                    focusable
                                    href={`https://www.ncbi.nlm.nih.gov/pubmed/${
                                        result.PMID
                                    }`}
                                    label={ResultList.labels.view_reference}
                                />
                                <Button
                                    flat
                                    primary
                                    focusable
                                    id={result.PMID}
                                    label={ResultList.labels.add_reference}
                                    onClick={this.handleClick}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}
