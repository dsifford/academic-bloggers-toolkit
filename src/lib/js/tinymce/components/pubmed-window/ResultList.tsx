import * as React from 'react';
import { observer } from 'mobx-react';

interface ResultListProps {
    results: PubMed.SingleReference[];
    select(pmid: string): void;
}

@observer
export class ResultList extends React.PureComponent<ResultListProps, {}> {

    labels = (top as any).ABT_i18n.tinymce.pubmedWindow;

    handleClick = (e) => {
        this.props.select(e.target.dataset['pmid']);
    }

    render() {
        return (
            <div>
                { this.props.results.map((result, i: number) =>
                    <div key={`result-${i}`} className="result-item">
                        <div className="result-item--padded">
                            <div style={{fontStyle: 'italic'}} children={result.source} />
                            <div style={{fontWeight: 'normal'}} children={result.pubdate.substr(0, 4)} />
                        </div>
                        <div children={result.title} className="result-item--padded" />
                        <div className="result-item--padded">
                            <div children={result.authors.slice(0, 3).map(el => el.name).join(', ') /* tslint:disable-line */} />
                            <div>
                                <a
                                    href={`http://www.ncbi.nlm.nih.gov/pubmed/${result.uid}`}
                                    target="_blank"
                                    style={{paddingLeft: 8, paddingRight: 8}}
                                    className="btn-submit btn-flat"
                                    children={this.labels.viewReference}
                                />
                                <input
                                    type="button"
                                    className="btn-submit btn-flat"
                                    value={this.labels.addReference}
                                    data-pmid={result.uid}
                                    onClick={this.handleClick}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
