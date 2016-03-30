var InlineCitationModal = (function () {
    function InlineCitationModal() {
        this._getModal();
        this.initialSize = {
            outer: parseInt(this.outer.style.height.substr(0, this.outer.style.height.length - 2)),
            inner: parseInt(this.inner.style.height.substr(0, this.inner.style.height.length - 2)),
        };
    }
    InlineCitationModal.prototype.resize = function () {
        var height = this.mainRect.getBoundingClientRect().height;
        var position = "calc(50% - " + (height + 66) / 2 + "px)";
        this.outer.style.height = height + 66 + 'px';
        this.inner.style.height = height + 30 + 'px';
        this.outer.style.top = position;
    };
    ;
    InlineCitationModal.prototype._getModal = function () {
        var outerModalID = top.document.querySelector('div.mce-floatpanel[aria-label="Inline Citation"]').id;
        var innerModalID = outerModalID + "-body";
        this.outer = top.document.getElementById(outerModalID);
        this.inner = top.document.getElementById(innerModalID);
        this.mainRect = document.getElementById('main-container');
    };
    return InlineCitationModal;
}());
var InlineCitationWindow = (function () {
    function InlineCitationWindow() {
        this.modal = new InlineCitationModal;
        this.editorDOM = top.tinymce.activeEditor.dom.doc;
        var smartBib = this.editorDOM.getElementById('abt-smart-bib');
        this.refList = smartBib || false;
        this.smartBibRender = document.getElementById('smart-bib-render');
        if (this.refList) {
            var orderedList = document.createElement('OL');
            for (var i = 0; i < this.refList.childElementCount; i++) {
                var liContent = this.refList.children[i].innerHTML;
                var listItem = document.createElement('li');
                listItem.innerHTML = liContent;
                orderedList.appendChild(listItem);
            }
            this.smartBibRender.appendChild(orderedList);
        }
        this.modal.resize();
    }
    return InlineCitationWindow;
}());
new InlineCitationWindow;
