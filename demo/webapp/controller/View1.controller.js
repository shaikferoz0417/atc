sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (Controller, JSONModel, MessageToast, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("invoice.demo.controller.View1", {
            onInit: function () {
                var oData = {
                    Approvers: []
                };

                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "approverDataModel");

                var sFilePath = "model/Vendor.json";
                var oVendorModel = new JSONModel();
                oVendorModel.loadData(sFilePath);
                oVendorModel.attachRequestCompleted(function () {
                    if (oVendorModel.getData()) {
                        this.getView().setModel(oVendorModel, "vendorModel");
                        MessageToast.show("Data fetched successfully.");
                    } else {
                        MessageToast.show("Failed to fetch data.");
                    }
                }.bind(this));

                this.fetchData();
            },

            fetchData: function () {
                sap.ui.core.BusyIndicator.show(0); // Show the loader
                Promise.all([this.getData(), this.getData()]).then(([storeData, invoiceData]) => {
                    var successArray = storeData;
                    var successId = successArray.filter(item => item.status === "RUNNING" && item.subject === "store").map(item => item.id);
                    
                    var successArray1 = invoiceData;
                    var successId1 = successArray1.filter(item => item.status === "RUNNING" && item.subject === "Get Invoice Details").map(item => item.id);

                    return Promise.all([
                        this.fetchWorkflowInstances(successId),
                        this.fetchWorkflowInstances(successId1)
                    ]);
                }).then(([storeInstances, invoiceInstances]) => {

                    console.log(storeInstances);
                    console.log(invoiceInstances);
                    var dataObj = storeInstances;
                    var dataObj1 = invoiceInstances;

                    console.log("Data Objects: ", dataObj);
                    console.log("Data Objects 1: ", dataObj1);

                    var dataObj2=[];
                    for(var i=0;i<dataObj.length;i++)
                    {
                        console.log(dataObj[i].startEvent);
                        var flag=0;
                        // console.log(dataObj1[0].startEvent.tradeId);
                        for(var j=0;j<dataObj1.length;j++)
                        {
                            if(dataObj[i].startEvent.tradeId == dataObj1[j].startEvent.tradeId)
                            {
                                flag=1;
                                var mergedData = {};
                                mergedData.base64string = dataObj1[j].startEvent.base64string;
                                mergedData.comments = dataObj1[j].startEvent.comments;
                                mergedData.currentDate = dataObj1[j].startEvent.currentDate;
                                mergedData.tradeId = dataObj1[j].startEvent.tradeId;
                                mergedData.tradeName = dataObj1[j].startEvent.tradeName;
                                mergedData.vendorCategory = dataObj1[j].startEvent.vendorCategory;
                                mergedData.vendorId = dataObj1[j].startEvent.vendorId;
                                mergedData.vendorName = dataObj1[j].startEvent.vendorName;
                                if(dataObj1[j].automation_extractInvoiceData_1)
                                {
                                    mergedData.DocumentNumber = dataObj1[j].automation_extractInvoiceData_1.InvoiceDetails.DocumentNumber;
                                    mergedData.GrossAmount = dataObj1[j].automation_extractInvoiceData_1.InvoiceDetails.GrossAmount;
                                    mergedData.SenderName = dataObj1[j].automation_extractInvoiceData_1.InvoiceDetails.SenderName;
                                    if((mergedData.GrossAmount >=1000) || (mergedData.SenderName == "ABC Communication" || mergedData.SenderName == "Telecommunications"))
                                    {
                                        mergedData.action = "Approval Needed";
                                        mergedData.status = "Approved Pending"
                                    }
                                    else{
                                        mergedData.action = "Auto Approved";
                                        mergedData.status = "NIL"
                                    }
                                    if(dataObj1[j].form_invoiceApprovalForm_1){
                                        mergedData.status = "Approved"
                                    }
                                    console.log(mergedData);

                                }
                                dataObj2.push(mergedData);

                                break;
                            }
                        }
                        if(flag==0)
                        {
                            var mergedData = {};
                            mergedData.comments = dataObj[i].startEvent.comments;
                            mergedData.tradeId = dataObj[i].startEvent.tradeId;
                            mergedData.tradeName = dataObj[i].startEvent.tradeName;
                            mergedData.vendorCategory = dataObj[i].startEvent.vendorCategory;
                            mergedData.vendorId = dataObj[i].startEvent.vendorId;
                            mergedData.vendorName = dataObj[i].startEvent.vendorName;
                            mergedData.action = "In Progress";
                            console.log(mergedData);
                            dataObj2.push(mergedData);
                        }
                    }
                    // var dataObj2 = [];
                    // for(var i=0;i<dataObj.length;i++)
                    // {
                    //     console.log(dataObj[i].tradeId);
                    //     var flag = 0;
                    //     for(var j=0;j<dataObj1.length;j++)
                    //     {
                    //         if(dataObj[i].tradeId == dataObj1[j].tradeId){
                    //             flag=1;
                    //             dataObj2.push(dataObj1[j]);
                    //             break;
                    //         }
                    //     }
                    //     console.log(flag);
                    //     if(flag==0)
                    //     {
                    //         dataObj2.push(dataObj[i]);
                    //     }
                    // }
                    console.log(dataObj2);
                    var test = { data: dataObj2 };
                    console.log(test);

                    var oModel1 = new JSONModel(test);
                    this.getView().setModel(oModel1, "successIdModel");
                    sap.ui.core.BusyIndicator.hide(); // Hide the loader in case of error
                    console.log(oModel1);
                }).catch(function (error) {
                    console.error(error);
                    sap.ui.core.BusyIndicator.hide(); // Hide the loader in case of error
                });
            },

            fetchWorkflowInstances: function (ids) {
                return this._getToken().then(token => {
                    var proxyUrl = 'http://localhost:8080/';
                    var targetUrl = 'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/public/workflow/rest/v1/workflow-instances';

                    var promises = ids.map(id => {
                        var successUrl = `/${id}/context`;
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
                                    // resolve(response.startEvent);
                                    resolve(response);
                                },
                                error: function (error) {
                                    MessageToast.show("Failed to fetch data.");
                                    reject(error);
                                }
                            });
                        });
                    });

                    return Promise.all(promises);
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



            onAdd: function () {
                var oModel = this.getView().getModel("approverDataModel");
                var aApprovers = oModel.getProperty("/Approvers");

                // Add a new empty row
                aApprovers.push({
                    tradeId: "",
                    tradeName: "",
                    vendorId: "",
                    vendorName: "",
                    vendorCategory: "",
                    comments: ""
                });

                // Update the model
                oModel.setProperty("/Approvers", aApprovers);
            },
            onDeleteSelected: function () {
                var oTable = this.getView().byId("idApproverTable");
                var aSelectedItems = oTable.getSelectedItems();

                if (aSelectedItems.length === 0) {
                    sap.m.MessageToast.show("No row is selected");
                    return;
                }

                aSelectedItems.forEach(function (oItem) {
                    oTable.removeItem(oItem);
                });
            },
            onNavToSecondView: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteView2");
            },
            onFileChange: function (oEvent) {
                var oFileUploader = oEvent.getSource();
                var oContext = oFileUploader.getBindingContext("approverDataModel");
                var oApprover = oContext.getObject();
                var file = oEvent.getParameter("files")[0];
                var reader = new FileReader();

                reader.onload = function (e) {
                    var base64String = e.target.result.split(",")[1];
                    oApprover.fileBase64 = base64String;
                    oApprover.filePath = file.name;
                    this.getView().getModel("approverDataModel").refresh(true);
                }.bind(this);

                reader.readAsDataURL(file);
            },

            onSaveRow: function (oEvent) {


                var oItem = oEvent.getSource().getParent();
                var oContext = oItem.getBindingContext("approverDataModel");
                var oApprover = oContext.getObject();

                console.log(oApprover);


                // if (!oApprover.employeeName || !oApprover.itemId || !oApprover.itemDescription || !oApprover.department || !oApprover.currentDate) {
                //     sap.m.MessageToast.show("All fields must be filled out before saving.");
                //     return;
                // }


                oEvent.getSource().setEnabled(false);
                var oModel = this.getView().getModel("approverDataModel");
                var aApprovers = oModel.getProperty("/Approvers");



                // var oFileUploader = oItem.getCells()[5]; // Assuming the file uploader is the 6th cell
                // var file = oFileUploader.oFileUpload.files[0];
                // var reader = new FileReader();

                // reader.onload = function (event) {
                //     var base64String = event.target.result.split(",")[1];

                    // var payload = {
                    //     definitionId: "us10.0df5892btrial.invoiceapprovalprocessdemo.getInvoiceDetails",
                    //     context: {
                    //         employeeName: oApprover.employeeName,
                    //         itemId: oApprover.itemId,
                    //         itemDescription: oApprover.itemDescription,
                    //         department: oApprover.department,
                    //         filePath: "C:\\Users\\sasanthoshkumar\\Downloads\\" + oApprover.filePath,
                    //         base64string: base64String,
                    //         currentDate: this._formatDate(oApprover.currentDate)
                    //     }
                    // };

                    var payload = {
                        
                            definitionId: "us10.0df5892btrial.datastore.store",
                            context: {
                                tradeId: oApprover.tradeId,
                                tradeName: oApprover.tradeName,
                                vendorId: oApprover.VENDORID,
                                vendorName: oApprover.VENDORNAME,
                                vendorCategory: oApprover.VENDORCATEGORY,
                                comments: oApprover.comments
                        }
                    };
                    this._getToken().then(function (token) {
                        this._sendAjaxRequest(payload, token);
                    }.bind(this));
                // }.bind(this);
                // reader.readAsDataURL(file);
            },

            _formatDate: function (date) {
                if (!date) {
                    return null;
                }
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
                return oDateFormat.format(new Date(date));
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

            _sendAjaxRequest: function (payload, token) {
                var proxyUrl = 'http://localhost:8080/';
                var targetUrl = 'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/public/workflow/rest/v1/workflow-instances';
                jQuery.ajax({
                    url: proxyUrl + targetUrl,
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(payload),
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Origin": window.location.host,
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    success: function (response) {
                        console.log(response);
                        var id = response.id;
                        console.log(id);
                        MessageToast.show("Data saved successfully.");
                    },
                    error: function (error) {
                        MessageToast.show("Failed to save data.");
                    }
                });
            },
            saveSelectedToModel: function () {
                var oModel = this.getView().getModel("approverDataModel");
                var aApprovers = oModel.getProperty("/Approvers");

                if (aApprovers.length === 0) {
                    MessageToast.show("No data to save.");
                    return;
                }
                // this._formatDate(aApprovers[0].currentDate)
                var payload = {
                    definitionId: "us10.0df5892btrial.invoiceapprovalprocessdemo.getInvoiceDetails",
                    context: {
                        employeeName: aApprovers.employeeName,
                        itemId: aApprovers.itemId,
                        itemDescription: aApprovers.itemDescription,
                        department: aApprovers.department,
                        filePath: "C:\\Users\\sasanthoshkumar\\Downloads\\" + aApprovers.filePath,
                        base64string: base64String,
                        currentDate: this._formatDate(aApprovers.currentDate)
                    }
                };

                console.log("base64String", base64String);
                this._getToken().then(function (token) {
                    this._sendAjaxRequest(payload, token);
                }.bind(this));
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
                //                 content: "<iframe src='" + url + "' width='100%' height='100%' style='border: none;'></iframe>"
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
            },
            onVendorChange: function (oEvent) {
                var oComboBox = oEvent.getSource();
                var sSelectedKey = oComboBox.getSelectedKey();
                var sSelectedItem = oComboBox.getSelectedItem();
                var sSelectedItemText = sSelectedItem.getText();
                var sVendorCategory = sSelectedItem.getBindingContext("vendorModel").getProperty("VENDORCATEGORY");
                var oContext = oComboBox.getBindingContext("approverDataModel");
                var oTradeModel = this.getView().getModel("approverDataModel");
                var sPath = oContext.getPath();
     
                oTradeModel.setProperty(sPath + "/VENDORID", sSelectedItemText);
                oTradeModel.setProperty(sPath + "/VENDORNAME", sSelectedKey);
                oTradeModel.setProperty(sPath + "/VENDORCATEGORY", sVendorCategory);
            },
            onRefreshTab2: function () {

                this.fetchData();
            
            },







        });
    });
