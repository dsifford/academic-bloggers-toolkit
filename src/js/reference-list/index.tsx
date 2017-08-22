import { useStrict } from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'react-select/dist/react-select.css';

import logger from 'utils/logger';
import { colors, shadows, transitions } from 'utils/styles';
import ReferenceList from './components/reference-list';
import Store from './store';

(window as any)['Rollbar'] = logger;

useStrict(false);

declare const ABT_Reflist_State: BackendGlobals.ABT_Reflist_State;
const store: Store = new Store(ABT_Reflist_State);

const ABTRoot = () =>
    <div>
        <ReferenceList store={store} editor={import('drivers/tinymce').then(mod => mod.default)} />
        <style jsx global>{`
            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                font-weight: 500;
            }
            #abt-reflist {
                z-index: 1;
                transition: box-shadow ${transitions.shadows};
            }
            #abt-reflist.fixed {
                position: fixed;
                box-shadow: ${shadows.depth_4};
                border: solid ${colors.border} 1px;
                margin-right: 10px;
            }
            #abt-reflist h2.hndle {
                box-shadow: ${shadows.depth_1};
            }
            #abt-reflist .inside {
                margin: 0;
                min-width: 254px;
            }
            #abt-reflist #HW_badge_cont {
                display: inline-block;
                height: auto;
                top: -2px;
                line-height: 1.4em;
            }
            #abt-reflist #HW_badge {
                position: relative;
                top: 0;
            }
            #abt-reflist #HW_badge.HW_softHidden {
                top: 5px;
            }
            #wp-content-editor-tools,
            #adminmenuwrap,
            #adminmenuback {
                z-index: 1 !important;
            }
            .wp-editor-expand div.mce-toolbar-grp {
                z-index: initial;
            }
            .is-focused:not(.is-open) > .Select-control {
                border-color: #5b9dd9;
                box-shadow: 0 0 2px rgba(30, 140, 190, .8);
            }
            @media screen and (min-width: 782px) {
                #abt-reflist.fixed {
                    margin-right: 25px;
                }
            }
        `}</style>
    </div>;

ReactDOM.render(<ABTRoot />, document.getElementById('abt-reflist__root'));
