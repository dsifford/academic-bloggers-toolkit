import * as React from 'react';
import { observer } from 'mobx-react';

interface ResultListProps {
    results: PubMed.SingleReference[];
    select(pmid: string): void;
}

@observer
export class ResultList extends React.PureComponent<ResultListProps, {}> {

    labels = (top as any).ABT_i18n.tinymce.pubmedWindow;
    element: HTMLElement;

    bindRefs = (c: HTMLDivElement) => {
        this.element = c;
    }

    handleClick = (e) => {
        this.props.select(e.target.getAttribute('data-pmid'));
    }

    handleWheel = (e: React.WheelEvent<HTMLElement>) => {
        const atTopAndScrollingUp: boolean = this.element.scrollTop === 0 && e.deltaY < 0;
        const atBottomAndScollingDown: boolean =
            ((this.element.scrollTop + this.element.offsetHeight) === this.element.scrollHeight)
            && e.deltaY > 0;
        if (atTopAndScrollingUp || atBottomAndScollingDown) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        e.stopPropagation();
    }

    componentDidUpdate() {
        this.element.scrollTop = 0;
    }

    render() {
        return (
            <div
                className="abt-scroll-y"
                style={{maxHeight: 'calc(100vh - 156px)'}}
                onWheel={this.handleWheel}
                ref={this.bindRefs}
            >
                { this.props.results.map((result) =>
                    <div key={result.uid} className="result-item">
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
                                    className="abt-btn-submit abt-btn-flat"
                                    children={this.labels.viewReference}
                                />
                                <input
                                    type="button"
                                    className="abt-btn-submit abt-btn-flat"
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
