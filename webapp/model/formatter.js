sap.ui.define([], ()=> {
    "use strict";
    return {
        statusState(sState) {
            switch (sState) {
                case 'Approved Pending':
                    return 'Warning';
                case 'Approved':
                    return 'Success';
                case 'Rejected':
                    return 'Error';
                default:
                    return 'None';
            }
        }
    };

}, /* bExport= */ true);