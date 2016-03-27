HTMLElement.prototype.showHide = function (option) {
    switch (option) {
        case 'show':
            this.style.display = '';
            break;
        case 'hide':
            this.style.display = 'none';
            break;
        default:
            this.style.display = this.style.display == 'none' ? '' : 'none';
    }
    return this.style.display;
};
var Modal = (function () {
    function Modal() {
        this._getModal();
        this.initialSize = {
            outer: parseInt(this.outer.style.height.substr(0, this.outer.style.height.length - 2)),
            inner: parseInt(this.inner.style.height.substr(0, this.inner.style.height.length - 2)),
        };
    }
    Modal.prototype.resize = function () {
        var height = this.mainRect.getBoundingClientRect().height;
        this.outer.style.height = height + 66 + 'px';
        this.inner.style.height = height + 30 + 'px';
    };
    ;
    Modal.prototype._getModal = function () {
        var outerModalID = top.document.querySelector('div.mce-floatpanel[aria-label="Insert Formatted Reference"]').id;
        var innerModalID = outerModalID + "-body";
        this.outer = top.document.getElementById(outerModalID);
        this.inner = top.document.getElementById(innerModalID);
        this.mainRect = document.getElementById('main-container');
    };
    return Modal;
}());
var ReferenceWindow = (function () {
    function ReferenceWindow() {
        this.modal = new Modal;
        this.buttons = {
            toggleAddManually: document.getElementById('add-manually'),
            addAuthor: document.getElementById('add-author'),
        };
        this.containers = {
            mainContainer: document.getElementById('main-container'),
            pubmedContainer: document.getElementById('pubmed-container'),
            manualContainer: document.getElementById('manual-container'),
        };
        this.form = document.getElementById('main-form');
        this.tables = {
            authorTable: document.getElementById('author-table'),
        };
        this.inputs = {
            pmidInput: document.getElementById('pmid-input'),
            includeLink: document.getElementById('include-link'),
        };
        this.manualComponents = {
            journal: document.getElementById('manual-journal'),
            blog: document.getElementById('manual-blog'),
            website: document.getElementById('manual-website'),
        };
        this.selections = {
            manualCitationType: document.getElementById('manual-type-selection'),
        };
        this.modal.resize();
        this._addAuthorRow();
        this.buttons.toggleAddManually.addEventListener('click', this._toggleAddManually.bind(this));
        this.buttons.addAuthor.addEventListener('click', this._addAuthorRow.bind(this));
        this.selections.manualCitationType.addEventListener('change', this._manualCitationChange.bind(this));
        this.form.addEventListener('submit', this._submitForm.bind(this));
    }
    ReferenceWindow.prototype._manualCitationChange = function (e) {
        var selection = this.selections.manualCitationType.value;
        for (var key in this.manualComponents) {
            if (key == selection || key == '') {
                continue;
            }
            this.manualComponents[key].showHide('hide');
        }
        if (selection !== '') {
            this.manualComponents[selection].showHide('show');
        }
        this.modal.resize();
    };
    ReferenceWindow.prototype._toggleAddManually = function () {
        this.containers.pubmedContainer.showHide();
        this.containers.manualContainer.showHide();
        this.inputs.pmidInput.disabled = !this.inputs.pmidInput.disabled;
        this.inputs.includeLink.disabled = !this.inputs.includeLink.disabled;
        this.selections.manualCitationType.disabled = !this.selections.manualCitationType.disabled;
        this.modal.resize();
    };
    ReferenceWindow.prototype._addAuthorRow = function () {
        var _this = this;
        var newRow = this.tables.authorTable.insertRow();
        newRow.insertCell().appendChild(document.createTextNode('First Name'));
        var rowNum = this.tables.authorTable.rows.length;
        var firstNameInput = document.createElement('input');
        firstNameInput.type = 'text';
        firstNameInput.id = "author-fname-" + rowNum;
        newRow.insertCell().appendChild(firstNameInput);
        newRow.insertCell().appendChild(document.createTextNode('Last Name'));
        var lastNameInput = document.createElement('input');
        lastNameInput.type = 'text';
        lastNameInput.id = "author-lname-" + rowNum;
        newRow.insertCell().appendChild(lastNameInput);
        var removeRowButton = document.createElement('input');
        removeRowButton.type = 'button';
        removeRowButton.className = 'btn';
        removeRowButton.value = 'x';
        removeRowButton.addEventListener('click', function (e) {
            var row = e.srcElement.parentElement.parentElement;
            row.remove();
            _this.modal.resize();
        });
        newRow.insertCell().appendChild(removeRowButton);
        this.modal.resize();
    };
    ReferenceWindow.prototype._submitForm = function (e) {
        e.preventDefault();
        var wm = top.tinymce.activeEditor.windowManager;
        var formElement = e.srcElement;
        var payload = {};
        var skippedFields = [];
        for (var i = 0; i < formElement.length; i++) {
            var el = formElement[i];
            if (el.type == 'button'
                || el.type == 'submit'
                || el.value == ''
                || el.disabled) {
                continue;
            }
            if (el.type == 'checkbox') {
                payload[el.id] = el.checked;
                continue;
            }
            payload[el.id] = el.value;
        }
        console.log(payload);
        wm.setParams({ data: payload });
        wm.close();
    };
    return ReferenceWindow;
}());
new ReferenceWindow;
