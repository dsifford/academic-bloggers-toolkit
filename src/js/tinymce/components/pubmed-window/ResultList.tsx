import { observer } from 'mobx-react';
import * as React from 'react';
import { preventScrollPropagation } from '../../../utils/helpers/';

interface ResultListProps {
    results: PubMed.DataPMID[];
    select(pmid: string): void;
}

@observer
export class ResultList extends React.PureComponent<ResultListProps, {}> {
    labels = top.ABT_i18n.tinymce.pubmedWindow;
    element: HTMLElement;
    handleWheel = preventScrollPropagation.bind(this);

    bindRefs = (c: HTMLDivElement) => {
        this.element = c;
    };

    handleClick = e => {
        this.props.select(e.target.getAttribute('data-pmid'));
    };

    componentDidUpdate() {
        this.element.scrollTop = 0;
    }

    render() {
        return (
            <div
                className="abt-scroll-y"
                style={{ maxHeight: 'calc(100vh - 156px)' }}
                onWheel={this.handleWheel}
                ref={this.bindRefs}
            >
                {this.props.results.map(result =>
                    <div key={result.uid} className="result-item">
                        <div className="result-item--padded">
                            <div
                                style={{ fontStyle: 'italic' }}
                                children={result.source}
                            />
                            <div
                                style={{ fontWeight: 'normal' }}
                                children={result.pubdate!.substr(0, 4)}
                            />
                        </div>
                        <div
                            children={result.title}
                            className="result-item--padded"
                        />
                        <div className="result-item--padded">
                            <div
                                children={result.authors!
                                    .slice(0, 3)
                                    .map(el => el.name)
                                    .join(', ') /* tslint:disable-line */}
                            />
                            <div>
                                <a
                                    href={`https://www.ncbi.nlm.nih.gov/pubmed/${result.uid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ paddingLeft: 8, paddingRight: 8 }}
                                    className="abt-btn abt-btn_submit abt-btn_flat"
                                    role="button"
                                    children={this.labels.viewReference}
                                />
                                <input
                                    type="button"
                                    className="abt-btn abt-btn_submit abt-btn_flat"
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
