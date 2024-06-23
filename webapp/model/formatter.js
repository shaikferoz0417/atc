sap.ui.define([], () => {
    "use strict";
    return {
        statusState(sState) {
            switch (sState) {
                case 'Approved Pending':
                    return 'Indication03';
                case 'Approved':
                    return 'Success';
                case 'Rejected':
                    return 'Error';
                default:
                    return 'None';
            }
        },

        statusIcon(sState) {

            switch (sState) {
                case 'Approved Pending':
                    return 'sap-icon://alert';
                case 'Approved':
                    return 'sap-icon://sys-enter-2';
                case 'Rejected':
                    return 'sap-icon://error';
                default:
                    return 'None';
            }
        },

        ComplaintStatusState(sState) {
            switch (sState) {
                case 'Open':
                    return 'Information';
                case 'Closed':
                    return 'Indication16';
                case 'Rejected':
                    return 'Error';
                case 'Resolved':
                    return 'Success';
                case 'In Process':
                    return 'Warning'
                default:
                    return 'None';
            }
        },
    };

}, /* bExport= */ true);