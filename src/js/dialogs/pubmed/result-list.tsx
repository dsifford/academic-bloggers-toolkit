import { decode } from 'he';
import { observer } from 'mobx-react';
import * as React from 'react';

import { colors } from 'utils/styles';

interface ResultListProps {
    results: PubMed.Response[];
    onSelect(pmid: string): void;
}

@observer
export class ResultList extends React.PureComponent<ResultListProps, {}> {
    static readonly labels = top.ABT_i18n.tinymce.pubmedWindow;
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
            <div className="bounded-rect" ref={this.bindRefs}>
                {this.props.results.map(result =>
                    <div key={result.uid} className="result-item">
                        <div className="source-row">
                            <div className="source-row__source" children={result.source} />
                            <div children={result.pubdate!.substr(0, 4)} />
                        </div>
                        {/* tslint:disable-next-line:react-no-dangerous-html */}
                        <div
                            dangerouslySetInnerHTML={{ __html: decode(result.title!) }}
                            className="result-title"
                        />
                        <div className="author-row">
                            <div
                                children={result.authors!.slice(0, 3).map(el => el.name).join(', ')}
                            />
                            <div>
                                <a
                                    href={`https://www.ncbi.nlm.nih.gov/pubmed/${result.uid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="abt-btn abt-btn_submit abt-btn_flat"
                                    role="button"
                                    children={ResultList.labels.viewReference}
                                />
                                <input
                                    type="button"
                                    className="abt-btn abt-btn_submit abt-btn_flat"
                                    value={ResultList.labels.addReference}
                                    id={result.uid}
                                    onClick={this.handleClick}
                                />
                            </div>
                        </div>
                    </div>,
                )}
                <style jsx>{`
                    .bounded-rect {
                        max-height: calc(100vh - 240px);
                        overflow-y: auto;
                        overflow-x: hidden;
                    }
                    .result-item {
                        border-bottom: 1px solid ${colors.border};
                    }
                    .source-row {
                        padding: 0 16px;
                        padding-top: 16px;
                        font-size: 14px;
                        line-height: 18px;
                        display: flex;
                        justify-content: space-between;
                        color: ${colors.font_light};
                    }
                    .source-row__source {
                        font-style: italic;
                    }
                    .result-title {
                        padding: 0 16px;
                        font-size: 16px;
                        line-height: 20px;
                        padding: 8px 16px;
                    }
                    .author-row {
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
