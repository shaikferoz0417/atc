sap.ui.define(["../model/Constants"], function (Constants) {
	"use strict";

	/**
	 *
	 * @namespace
	 * @public
	 * 
	 */
	return {
		getToken: function () {
			var that = this;
			var oPayload = {
				client_id: Constants.client_id,
				client_secret: Constants.client_secret,
				grant_type: "client_credentials"
			}

			alert
			new Promise(function (resolve, reject) {

				//oAuth -- Request to get Tokens
				$.ajax({

					url: "https://0df5892btrial.authentication.us10.hana.ondemand.com/oauth/token",
					type: "POST",
					data: oPayload,
					success: function (data) {
						localStorage.setItem("token", data.access_token);
						that.getData().then(function (aResponse) {
							console.log(aResponse);
						});
						resolve(data.access_token);

					},
					error: function (oError) {
						reject(oError);
					}
				});

			})

		},

		postData: function (token) {
			var oPayload = {
				"definitionId": "us10.0df5892btrial.invoiceapprovalprocessdemo.getInvoiceDetails",
				"context": {
					"filePath": "Users\\shaikferozhussain\\Downloads\\Simple Invoice_1.pdf",
					"base64string": "kshfkjs",
					"tradeId": "T0011"
				}
			}

			new Promise(function (resolve, reject) {
				//oAuth -- Request to get Tokens
				var token = localStorage.getItem('token');
				var proxyUrl = 'http://localhost:8080/';
				var targetUrl = 'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/public/workflow/rest/v1/workflow-instances';
				$.ajax({
					headers: {
						"Authorization": `Bearer ${token}`,
						"Origin": window.location.host,
						"X-Requested-With": "XMLHttpRequest"
					},

					url: proxyUrl + targetUrl,
					// url:'/api',
					type: "POST",
					contentType: "application/json",
					data: JSON.stringify(oPayload),
					success: function (data) {
						resolve(data.access_token)
					},
					error: function (oError) {
						reject(oError);
					}
				});

			})
		},

		getData: function () {
			var token = localStorage.getItem('token');
			var dataObj = [];
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
					success: function (successId) {
						console.log(successId);
						const id = "6298333d-28c3-11ef-8671-eeee0a9c1901";
						var successUrl = '/' + id + '/' + 'context';

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
									if ((mergedData.GrossAmount >= 1000) || (mergedData.SenderName == "ABC Communication" && mergedData.SenderName == "Telecommunications")) {
										mergedData.action = "Approval Needed";
										mergedData.status = "Approved Pending"
									} else {
										mergedData.action = "Auto Approved";
										mergedData.status = "NIL"
									}
								}

								if (response.form_invoiceApprovalForm_1) {
									mergedData.status = "Approved"
								}

								dataObj.push(mergedData);
								resolve(dataObj);
							},
							error: function (error) {
								console.log(error);
								reject(error);
							}
						});
					},
					error: function (error) {
						MessageToast.show("Failed to save data.");
						reject(error);
					}
				});
			});
		}


		// getData: async function () {
		// 	var token = localStorage.getItem('token');
		// 	var dataObj = [];
		// 	var proxyUrl = 'http://localhost:8080/';
		// 	var targetUrl = 'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/public/workflow/rest/v1/workflow-instances';
		// 	return new Promise(function (resolve, reject) {
		// 		jQuery.ajax({
		// 			url: proxyUrl + targetUrl,
		// 			type: "GET",
		// 			contentType: "application/json",
		// 			headers: {
		// 				"Authorization": "Bearer " + token,
		// 				"Origin": window.location.host,
		// 				"X-Requested-With": "XMLHttpRequest"
		// 			},
		// 			success: async function (successId) {
		// 				console.log(successId);
		// 				// const id = successId[0].id;
		// 				const id = "6298333d-28c3-11ef-8671-eeee0a9c1901";
		// 				var proxyUrl = 'http://localhost:8080/';
		// 				var targetUrl = 'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/public/workflow/rest/v1/workflow-instances';
		// 				var successUrl = '/' + id + '/' + 'context';
		// 				return new Promise((resolve, reject) => {
		// 					jQuery.ajax({
		// 						url: proxyUrl + targetUrl + successUrl,
		// 						type: "GET",
		// 						contentType: "application/json",
		// 						headers: {
		// 							"Authorization": "Bearer " + token,
		// 							"Origin": window.location.host,
		// 							"X-Requested-With": "XMLHttpRequest"
		// 						},
		// 						success: function (response) {
		// 							console.log(response.startEvent);
		// 							console.log(response.automation_extractInvoiceData_1);

		// 							// Create a mergedData object manually combining properties
		// 							var mergedData = {};

		// 							// Add properties from startEvent
		// 							if (response.startEvent) {
		// 								mergedData.employeeName = response.startEvent.employeeName;
		// 								mergedData.filePath = response.startEvent.filePath;
		// 								mergedData.currentDate = response.startEvent.currentDate;
		// 								mergedData.itemId = response.startEvent.itemId;
		// 								mergedData.itemDescription = response.startEvent.itemDescription;
		// 								mergedData.department = response.startEvent.department;
		// 								mergedData.base64string = response.startEvent.base64string;
		// 								mergedData.action = "In Progress";
		// 							}

		// 							// Add properties from InvoiceDetails if they exist
		// 							if (response.automation_extractInvoiceData_1 && response.automation_extractInvoiceData_1.InvoiceDetails) {
		// 								mergedData.SenderName = response.automation_extractInvoiceData_1.InvoiceDetails.SenderName;
		// 								mergedData.DocumentNumber = response.automation_extractInvoiceData_1.InvoiceDetails.DocumentNumber;
		// 								mergedData.GrossAmount = response.automation_extractInvoiceData_1.InvoiceDetails.GrossAmount;
		// 								if ((mergedData.GrossAmount >= 1000) || (mergedData.SenderName == "ABC Communication" && mergedData.SenderName == "Telecommunications")) {
		// 									mergedData.action = "Approval Needed";
		// 									mergedData.status = "Approved Pending"
		// 								}
		// 								else {
		// 									mergedData.action = "Auto Approved";
		// 									mergedData.status = "NIL"
		// 								}
		// 							}

		// 							if (response.form_invoiceApprovalForm_1) {
		// 								mergedData.status = "Approved"
		// 							}
		// 							dataObj.push(mergedData);
		// 							resolve(dataObj);
		// 						},
		// 						error: function (error) {
		// 							console.log(error);
		// 							reject(error);
		// 						}
		// 					})
		// 				});
		// 			},
		// 			error: function (error) {
		// 				MessageToast.show("Failed to save data.");
		// 				reject(error);
		// 			}
		// 		});
		// 	});
		// },
	};

}, /* bExport= */ true);