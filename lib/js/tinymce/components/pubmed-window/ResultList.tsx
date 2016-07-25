import * as React from 'react';

interface ResultListProps {
    results: PubMed.SingleReference[];
    eventHandler: Function;
}

export class ResultList extends React.Component<ResultListProps, {}> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                { this.props.results.map((result, i: number) =>
                    <div
                        key={i}
                        className={i % 2 === 0 ? 'result-item' : 'result-item even'} >
                        <div className='left-container'>
                            <a
                                href={`http://www.pubmed.com/${result.uid}`}
                                target='_blank'
                                children={result.title} />
                            <div>
                                { result.authors
                                    .filter((_el, j) => j < 3)
                                    .map(el => el.name).join(', ')
                                }
                            </div>
                            <div>
                                <em>{result.source}</em> | {result.pubdate}
                            </div>
                        </div>
                        <div className='right-container'>
                            <input
                                type='button'
                                className='btn'
                                value='Add Reference'
                                onClick={this.props.eventHandler.bind(null, result.uid)} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
