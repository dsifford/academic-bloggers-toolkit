import { decode } from 'he';
import { observer } from 'mobx-react';
import * as React from 'react';

import { colors } from 'utils/styles';

import Button from 'components/button';

interface ResultListProps {
    /** List of results returned from pubmed search */
    results: PubMed.Response[];
    /** Callback to be performed when a result is chosen */
    onSelect(pmid: string): void;
}

@observer
export class ResultList extends React.PureComponent<ResultListProps, {}> {
    static readonly labels = top.ABT_i18n.dialogs.pubmed;

    /** Required so that result list can be scrolled to top after each new search */
    element: HTMLElement;

    bindRefs = (c: HTMLDivElement) => {
        this.element = c;
    };

    handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        this.props.onSelect(e.currentTarget.id);
    };

    componentDidUpdate() {
        this.element.scrollTop = 0;
    }

    render() {
        return (
            <div className="result-list" ref={this.bindRefs}>
                {this.props.results.map(result =>
                    <div key={result.uid} className="result-item">
                        <div className="result-item__row-1">
                            <div className="result-item__source" children={result.source} />
                            <div children={result.pubdate!.slice(0, 4)} />
                        </div>
                        {/* tslint:disable-next-line:react-no-dangerous-html */}
                        <div
                            dangerouslySetInnerHTML={{ __html: decode(result.title!) }}
                            className="result-item__row-2"
                        />
                        <div className="result-item__row-3">
                            <div
                                children={result.authors!.slice(0, 3).map(el => el.name).join(', ')}
                            />
                            <div className="result-item__buttons">
                                <Button
                                    flat
                                    focusable
                                    href={`https://www.ncbi.nlm.nih.gov/pubmed/${result.uid}`}
                                    label={ResultList.labels.viewReference}
                                />
                                <Button
                                    flat
                                    primary
                                    focusable
                                    id={result.uid}
                                    label={ResultList.labels.addReference}
                                    onClick={this.handleClick}
                                />
                            </div>
                        </div>
                    </div>,
                )}
                <style jsx>{`
                    .result-list {
                        max-height: calc(100vh - 240px);
                        overflow-y: auto;
                        overflow-x: hidden;
                    }
                    .result-item {
                        border-bottom: 1px solid ${colors.border};
                    }
                    .result-item__source {
                        font-style: italic;
                    }
                    .result-item__buttons {
                        display: flex;
                    }
                    .result-item__row-1 {
                        padding: 0 16px;
                        padding-top: 16px;
                        font-size: 14px;
                        line-height: 18px;
                        display: flex;
                        justify-content: space-between;
                        color: ${colors.font_light};
                    }
                    .result-item__row-2 {
                        padding: 0 16px;
                        font-size: 16px;
                        line-height: 20px;
                        padding: 8px 16px;
                    }
                    .result-item__row-3 {
                        padding: 0 8px 4px;
                        color: ${colors.font_light};
                        line-height: 18px;
                        font-size: 14px;
                        padding-right: 8px;
                        padding-left: 16px;
                        display: flex;
                        justify-content: space-between;
                    }
                `}</style>
            </div>
        );
    }
}
