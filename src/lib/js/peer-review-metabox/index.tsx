import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PeerReviewMetabox } from './PeerReviewMetabox';

declare const ABT_PR_Metabox_Data: ABT.PRMetaPayload;

ReactDOM.render(
    <PeerReviewMetabox data={ ABT_PR_Metabox_Data } />,
    document.getElementById('abt-peer-review-metabox')
);
