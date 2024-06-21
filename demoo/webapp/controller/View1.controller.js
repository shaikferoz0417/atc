sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "jquery.sap.global"
],
function (Controller, JSONModel, MessageToast, jQuery) {
    "use strict";

    return Controller.extend("invoice.demoo.controller.View1", {
        onInit: function () {
            var oData = {
                Approvers: []
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "approverDataModel");
        },

        onAdd: function () {
            var oModel = this.getView().getModel("approverDataModel");
            var aApprovers = oModel.getProperty("/Approvers");

            aApprovers.push({
                employeeName: "",
                filePath: "",
                currentDate: null
            });

            oModel.setProperty("/Approvers", aApprovers);
        },

        saveSelectedToModel: function () {
            var oModel = this.getView().getModel("approverDataModel");
            var aApprovers = oModel.getProperty("/Approvers");

            if (aApprovers.length === 0) {
                MessageToast.show("No data to save.");
                return;
            }

            var aPromises = aApprovers.map(function (oApprover) {
                var sEmployeeName = oApprover.employeeName;
                var sFilePath = "C:\\Users\\Gokul\\Downloads\\" + oApprover.filePath;
                var sCurrentDate = new Date(oApprover.currentDate).toISOString().split('T')[0];

                var oPayload = {
                    definitionId: "us10.0df5892btrial.invoiceapprovalprocessdemo.getInvoiceDetails",
                    context: {
                        employeeName: sEmployeeName,
                        filePath: sFilePath,
                        currentDate: sCurrentDate
                    }
                };

                console.log("Payload:", oPayload);

                function fetchTokenAndPostPayload(retryCount = 3) {
                    var clientId = encodeURIComponent("sb-583b1f20-7805-4695-8da8-dedab5816250!b292370|xsuaa!b49390");
                    var clientSecret = encodeURIComponent("bb4749e1-b9f4-4561-a8c5-51884d1a0225$XBhxna-iVWRZ0pfYEVbD5DR1pDKIjwvpEbofqIQlIlg=");
                    var tokenServiceUrl = "https://0df5892btrial.authentication.us10.hana.ondemand.com/oauth/token";

                    return new Promise(function (resolve, reject) {
                        fetch(tokenServiceUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Token fetch failed with status ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(tokenData => {
                            console.log("Token fetched successfully:", tokenData);

                            fetch("/public/workflow/rest/v1/workflow-instances", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${tokenData.access_token}`
                                },
                                body: JSON.stringify(oPayload)
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`API request failed with status ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                resolve(data);
                            })
                            .catch(error => {
                                console.error("API request error:", error);
                                if (error.message.includes('503') && retryCount > 0) {
                                    console.log(`Retrying... Attempts left: ${retryCount - 1}`);
                                    setTimeout(() => {
                                        fetchTokenAndPostPayload(retryCount - 1).then(resolve).catch(reject);
                                    }, 2000); // Wait for 2 seconds before retrying
                                } else {
                                    reject(error);
                                }
                            });
                        })
                        .catch(error => {
                            console.error("Token fetch error:", error);
                            reject(error);
                        });
                    });
                }

                return fetchTokenAndPostPayload();
            });

            Promise.all(aPromises)
                .then(function (results) {
                    MessageToast.show("Data saved successfully!");
                    console.log("Results:", results);
                })
                .catch(function (errors) {
                    MessageToast.show("Error saving data.");
                    console.error("Errors:", errors);
                });
        }
    });
});
