declare var ABT_locationInfo;

/**
 * Opens `reference-window.tsx` and passes the relevant data to a callback function
 *   on close.
 * @param editor   The active TinyMCE instance.
 * @param callback Callback.
 */
export function openReferenceWindow(editor: TinyMCE.Editor, callback: (data: ABT.ReferencePayload) => void): void {
    editor.windowManager.open({
        title: 'Insert Formatted Reference',
        url: ABT_locationInfo.tinymceViewsURL + 'reference-window.html',
        width: 600,
        height: 10,
        params: {
            baseUrl: ABT_locationInfo.tinymceViewsURL,
            preferredStyle: ABT_locationInfo.preferredCitationStyle,
        },
        onclose: (e) => {
            if (!e.target.params.data) return;
            callback(e.target.params.data as ABT.ReferencePayload);
        },
    } as TinyMCE.WindowMangerObject);
};



interface CitationPositions {
    /** The index of the HTMLSpanElement being inserted */
    currentIndex: number;
    /** Tuple type: 0: HTMLSpanElement ID, 1: HTMLSpanElement Index */
    locations: [[string, number][], [string, number][]];
}

/**
 * Iterates the active TinyMCE instance and obtains the citations that come both
 *   before and after the inline citation being inserted currently. Also receives
 *   the index of the current citation within the document (ie, if there's one
 *   citation before and one citation after the current citation, `currentIndex`
 *   will be 1).
 * @param editor The active TinyMCE instance.
 * @return Parsed citation data.
 */
export function getRelativeCitationPositions(editor: TinyMCE.Editor): CitationPositions {
    const selection = editor.selection;
    const doc: Document = editor.dom.doc;

    const cursor = editor.dom.create('span', { id: 'CURSOR', class: 'abt_cite'});
    selection.getNode().appendChild(cursor);

    const citations = doc.getElementsByClassName('abt_cite');
    const payload: CitationPositions = {
        currentIndex: 0,
        locations: [[], []],
    };

    if (citations.length > 1) {
        let key = 0;
        Array.from(citations).forEach((el, i) => {
            if (el.id === 'CURSOR') {
                key = 1;
                payload.currentIndex = i;
                return;
            }
            payload.locations[key].push([el.id, i - key]);
        });
    }
    editor.dom.doc.getElementById('CURSOR').remove();
    return payload;
}

/** TODO */
export function parseInlineCitations(editor: TinyMCE.Editor, data) {
    for (const [i, item] of data.entries()) {
        if (i === 0) {
            editor.insertContent(`<span id='${item[2]}' class='abt_cite noselect mceNonEditable'>${item[1]}</span>`);
            continue;
        }
        const citation: HTMLSpanElement = editor.dom.doc.getElementById(item[2]);
        citation.innerHTML = item[1];
    }
}
