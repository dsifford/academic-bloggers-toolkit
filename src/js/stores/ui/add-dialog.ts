import { computed, observable, toJS } from 'mobx';

import { DialogType } from 'dialogs';
import ManualData from 'stores/data/manual-data-store';

export interface AddDialogPayload {
    addManually: boolean;
    attachInline: boolean;
    identifierList: string;
    manualData: CSL.Data;
}

export default class Store {
    @observable addManually = false;
    @observable attachInline = true;
    @observable currentDialog: DialogType = DialogType.NONE;
    @observable errorMessage = '';
    @observable isLoading = false;
    @observable identifierList = '';
    // identifierList = observable.shallow<string>([]);
    data: ManualData;

    constructor(citationType: CSL.ItemType) {
        this.data = new ManualData(citationType);
    }

    @computed
    get payload(): AddDialogPayload {
        return toJS({
            addManually: this.addManually,
            attachInline: this.attachInline,
            identifierList: this.identifierList,
            manualData: this.data.CSL,
        });
    }
}
