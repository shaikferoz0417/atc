sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller ,JSONModel, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("invoice.demo.controller.View2", {
        onInit: function () {
            var successArray = [];
            var successId = [];
            var dataObj = [];

            this.getData().then((data) => {
                console.log(data);
                successArray = data;
                for (var i = 0; i < successArray.length; i++) {
                    if (successArray[i].status == "RUNNING") {
                        successId.push(successArray[i].id);
                    }
                }
                console.log(successId);

                return this._getToken();
            }).then((token) => {
                console.log(token);
                var promises = successId.map((id) => {
                    var proxyUrl = 'http://localhost:8080/';
                    var targetUrl = 'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/public/workflow/rest/v1/workflow-instances';
                    var successUrl = '/' + id + '/' + 'context';

                    return new Promise((resolve, reject) => {
                        jQuery.ajax({
                            url: proxyUrl + targetUrl + successUrl,
                            type: "GET",
                            contentType: "application/json",
                            headers: {
                                "Authorization": "Bearer " + token,
                                "Origin": window.location.host,
                                "X-Requested-With": "XMLHttpRequest"
                            },
                            success: function (response) {
                             
                                console.log(response.startEvent);
                                console.log(response.automation_extractInvoiceData_1);
                            
                                // Create a mergedData object manually combining properties
                                var mergedData = {};
                            
                                // Add properties from startEvent
                                if (response.startEvent) {
                                    mergedData.employeeName = response.startEvent.employeeName;
                                    mergedData.filePath = response.startEvent.filePath;
                                    mergedData.currentDate = response.startEvent.currentDate;
                                    mergedData.itemId = response.startEvent.itemId;
                                    mergedData.itemDescription = response.startEvent.itemDescription;
                                    mergedData.department = response.startEvent.department;
                                    mergedData.base64string = response.startEvent.base64string;
                                    mergedData.action = "In Progress";
                                }
                            
                                // Add properties from InvoiceDetails if they exist
                                if (response.automation_extractInvoiceData_1 && response.automation_extractInvoiceData_1.InvoiceDetails) {
                                    mergedData.SenderName = response.automation_extractInvoiceData_1.InvoiceDetails.SenderName;
                                    mergedData.DocumentNumber = response.automation_extractInvoiceData_1.InvoiceDetails.DocumentNumber;
                                    mergedData.GrossAmount = response.automation_extractInvoiceData_1.InvoiceDetails.GrossAmount;
                                    if((mergedData.GrossAmount >=1000) || (mergedData.SenderName == "ABC Communication" && mergedData.SenderName == "Telecommunications"))
                                    {
                                        mergedData.action = "Approval Needed";
                                        mergedData.status = "Approved Pending"
                                    }
                                    else{
                                        mergedData.action = "Auto Approved";
                                        mergedData.status = "NIL"
                                    }
                                }

                                if(response.form_invoiceApprovalForm_1){
                                    mergedData.status = "Approved"
                                }
                                dataObj.push(mergedData);
                                resolve();
                            },
                            error: function (error) {
                                MessageToast.show("Failed to save data.");
                                console.log(error);
                                reject(error);
                            }
                        });
                    });
                });

                return Promise.all(promises);
            }).then(() => {
                var test = { data: dataObj };
                console.log(dataObj);
                console.log(test);

                var oModel1 = new JSONModel(test);
                this.getView().setModel(oModel1, "successIdModel");

                console.log(oModel1);
            }).catch(function (error) {
                console.error(error);
            });
        },
        getData: function () {
            return this._getToken().then(function (token) {
                var proxyUrl = 'http://localhost:8080/';
                var targetUrl = 'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/public/workflow/rest/v1/workflow-instances';
                return new Promise(function (resolve, reject) {
                    jQuery.ajax({
                        url: proxyUrl + targetUrl,
                        type: "GET",
                        contentType: "application/json",
                        headers: {
                            "Authorization": "Bearer " + token,
                            "Origin": window.location.host,
                            "X-Requested-With": "XMLHttpRequest"
                        },
                        success: function (response) {
                            console.log(response);
                            MessageToast.show("Data saved successfully.");
                            resolve(response);
                        },
                        error: function (error) {
                            MessageToast.show("Failed to save data.");
                            reject(error);
                        }
                    });
                });
            }.bind(this));
        },

        _getToken: function () {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: "https://0df5892btrial.authentication.us10.hana.ondemand.com/oauth/token",
                    type: "POST",
                    data: {
                        client_id: "sb-583b1f20-7805-4695-8da8-dedab5816250!b292370|xsuaa!b49390",
                        client_secret: "bb4749e1-b9f4-4561-a8c5-51884d1a0225$XBhxna-iVWRZ0pfYEVbD5DR1pDKIjwvpEbofqIQlIlg=",
                        grant_type: "client_credentials"
                    },
                    success: function (data) {
                        resolve(data.access_token);
                    },
                    error: function (error) {
                        MessageToast.show("Failed to fetch token.");
                        reject(error);
                    }
                });
            });
        },
        onNavToSecondView1: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteView1");
          },
          onPreviewFileInProgress: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oContext = oItem.getBindingContext("successIdModel");
            var oApprover = oContext.getObject();
            console.log(oApprover);

            if (oApprover.base64string) {
                var sPdfData = "data:application/pdf;base64," + oApprover.base64string;
                var oPdfWindow = window.open("");
                oPdfWindow.document.write(
                    "<iframe width='100%' height='100%' src='" + sPdfData + "'></iframe>"
                );
            } else {
                MessageToast.show("No PDF available to preview.");
            }
        
            // if (oApprover.base64string) {
            //     try {
            //         // Validate and clean base64 string
            //         var base64String = oApprover.base64string.trim();
            //         var isValidBase64 = /^[A-Za-z0-9+/]+[=]{0,2}$/.test(base64String);
                    
            //         if (!isValidBase64) {
            //             throw new Error("Invalid base64 string");
            //         }
        
            //         var byteCharacters = atob(base64String);
            //         var byteNumbers = new Array(byteCharacters.length);
            //         for (var i = 0; i < byteCharacters.length; i++) {
            //             byteNumbers[i] = byteCharacters.charCodeAt(i);
            //         }
            //         var byteArray = new Uint8Array(byteNumbers);
            //         var blob = new Blob([byteArray], { type: 'application/pdf' });
            //         var url = URL.createObjectURL(blob);
        
            //         var oDialog = new sap.m.Dialog({
            //             title: 'PDF Preview',
            //             contentWidth: "500px",
            //             contentHeight: "600px",
            //             resizable: true,
            //             content: new sap.ui.core.HTML({
            //                 content: "<iframe src='" + url + "' width='100%' height='100%'></iframe>"
            //             }),
            //             endButton: new sap.m.Button({
            //                 text: 'Close',
            //                 press: function () {
            //                     oDialog.close();
            //                 }
            //             }),
            //             afterClose: function () {
            //                 oDialog.destroy();
            //             }
            //         });
        
            //         oDialog.open();
            //     } catch (e) {
            //         console.error("Failed to decode base64 string:", e);
            //         sap.m.MessageToast.show("Failed to preview file. The file may be corrupted.");
            //     }
            // } else {
            //     sap.m.MessageToast.show("No file available for preview.");
            // }
        }
      
    });
});
