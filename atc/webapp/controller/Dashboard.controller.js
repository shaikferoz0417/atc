sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"../service/WorkflowService"

], function (Controller, JSONModel, Fragment, WorkflowService) {
	"use strict";

	return Controller.extend("com.atc.sd.atc.controller.Dashboard", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.atc.hr.E-Invoicing.view.Dashboard
		 */
		onInit: function () {
			WorkflowService.getToken();

			var aInvoices = [{
				"DocumentNumber": "INV-00001",
				"GrossAmount": 2903.545,
				"SenderName": "Telecommunications",
				"action": "closed",
				"base64string": "kshfkjs",
				"currentDate": null,
				"department": null,
				"employeeName": null,
				"filePath": "C:\\Users\\sasanthoshkumar\\Downloads\\Simple Invoice_1.pdf",
				"itemDescription": null,
				"itemId": null,
				"status": "Approved Pending"
			},
			{
				"DocumentNumber": "INV-00002",
				"GrossAmount": 2893.51,
				"SenderName": "Telecommunications",
				"action": "closed",
				"base64string": "kshfkjs",
				"currentDate": null,
				"department": null,
				"employeeName": null,
				"filePath": "C:\\Users\\sasanthoshkumar\\Downloads\\Simple Invoice_1.pdf",
				"itemDescription": null,
				"itemId": null,
				"status": "Approved"
			},
			{
				"DocumentNumber": "INV-00003",
				"GrossAmount": 2189.51,
				"SenderName": "Telecommunications",
				"action": "closed",
				"base64string": "kshfkjs",
				"currentDate": null,
				"department": null,
				"employeeName": null,
				"filePath": "C:\\Users\\sasanthoshkumar\\Downloads\\Simple Invoice_1.pdf",
				"itemDescription": null,
				"itemId": null,
				"status": "Approved"
			}]


			// Sample data
			var data = {
				ProductCollection: aInvoices,
				ComplaintList: {

					"data": [{
						"ComplaintID": "C001",
						"InvoiceNumber": "INV001",
						"Customer": "Customer A",
						"ComplaintReason": "Incorrect billing amount",
						"Status": "Open"
					}, {
						"ComplaintID": "C002",
						"InvoiceNumber": "INV002",
						"Customer": "Customer B",
						"ComplaintReason": "Product not delivered",
						"Status": "In Process"
					}, {
						"ComplaintID": "C003",
						"InvoiceNumber": "INV003",
						"Customer": "Customer C",
						"ComplaintReason": "Damaged product received",
						"Status": "Closed"
					}, {
						"ComplaintID": "C004",
						"InvoiceNumber": "INV004",
						"Customer": "Customer D",
						"ComplaintReason": "Late delivery",
						"Status": "Open"
					}, {
						"ComplaintID": "C005",
						"InvoiceNumber": "INV005",
						"Customer": "Customer E",
						"ComplaintReason": "Incorrect product delivered",
						"Status": "Resolved"
					}]
				},

				outstandingInvoices: {
					total: "$10,000",
					data: [{
						"InvoiceID": "INV001",
						"CustomerName": "Customer A",
						"Amount": 1000,
						"DueDate": "2023-01-15",
						"Status": "Unpaid"
					}, {
						"InvoiceID": "INV002",
						"CustomerName": "Customer B",
						"Amount": 2000,
						"DueDate": "2023-02-10",
						"Status": "Unpaid"
					}, {
						"InvoiceID": "INV003",
						"CustomerName": "Customer C",
						"Amount": 1500,
						"DueDate": "2023-03-05",
						"Status": "Partially Paid"
					}, {
						"InvoiceID": "INV004",
						"CustomerName": "Customer D",
						"Amount": 2500,
						"DueDate": "2023-04-20",
						"Status": "Unpaid"
					}, {
						"InvoiceID": "INV005",
						"CustomerName": "Customer E",
						"Amount": 3000,
						"DueDate": "2023-05-15",
						"Status": "Paid"
					}]
				},
				invoices: {
					total: "$10,000",
					data: [{
						"InvoiceID": "INV001",
						"CustomerName": "Customer A",
						"Count": 1000,
						"DueDate": "2023-01-15",
						"Status": "All Invoices"
					}, {
						"InvoiceID": "INV002",
						"CustomerName": "Customer B",
						"Amount": 250,
						"DueDate": "2023-02-10",
						"Status": "Approved"
					}, {
						"InvoiceID": "INV003",
						"CustomerName": "Customer C",
						"Amount": 500,
						"DueDate": "2023-03-05",
						"Status": "Pending"
					}, {
						"InvoiceID": "INV004",
						"CustomerName": "Customer D",
						"Amount": 250,
						"DueDate": "2023-04-20",
						"Status": "Rejected"
					}]
				},
				upcomingPayments: {
					total: "$9,500",
					data: [{
						date: "2024-06-15",
						amount: 200
					}, {
						date: "2024-06-20",
						amount: 500
					}, {
						date: "2024-06-25",
						amount: 300
					}, {
						date: "2024-07-01",
						amount: 400
					}]
				},
				customerInteractions: {
					total: 15,
					data: [{
						month: "Jan",
						interactions: 5
					}, {
						month: "Feb",
						interactions: 3
					}, {
						month: "March",
						interactions: 7
					}, {
						month: "April",
						interactions: 7
					}, {
						month: "May",
						interactions: 7
					}]
				},
				PaymentForecast: [{
					"Date": "2024-06-01",
					"ForecastAmount": 5000
				}, {
					"Date": "2024-06-02",
					"ForecastAmount": 6000
				}, {
					"Date": "2024-06-03",
					"ForecastAmount": 5500
				}, {
					"Date": "2024-06-04",
					"ForecastAmount": 7000
				}, {
					"Date": "2024-06-05",
					"ForecastAmount": 6500
				}, {
					"Date": "2024-06-06",
					"ForecastAmount": 7500
				}, {
					"Date": "2024-06-07",
					"ForecastAmount": 8000
				}, {
					"Date": "2024-06-08",
					"ForecastAmount": 8500
				}, {
					"Date": "2024-06-09",
					"ForecastAmount": 9000
				}, {
					"Date": "2024-06-10",
					"ForecastAmount": 9500
				}]
			};

			// Create a JSON model and set it to the view
			var oModel = new JSONModel(data);
			this.getView().setModel(oModel);

			/*	var oVizFrameOutstandingInvoices = this.byId("idVizFrameOutstandingInvoices");
				var oPopOver = this.getView().byId("idOutstandingInvoicesPopOver");
				oPopOver.connect(oVizFrameOutstandingInvoices.getVizUid());*/

			var oVizFrameCustomerInteractions = this.byId("customerInteractionsChart");
			var oPopOver = this.getView().byId("idCustomerInteractionsPopOver");
			oPopOver.connect(oVizFrameCustomerInteractions.getVizUid());

			var oVizFrameCustomerInteractions = this.byId("customerInteractionsChart");
			var oPopOver = this.getView().byId("idCustomerInteractionsPopOver");
			oPopOver.connect(oVizFrameCustomerInteractions.getVizUid());

		},
		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			var bSideExpanded = oToolPage.getSideExpanded();

			// 			this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
		},

		onEdit: function () {
			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new Input({
						value: "{Name}"
					}), new Input({
						value: "{Quantity}",
						description: "{UoM}"
					}), new Input({
						value: "{WeightMeasure}",
						description: "{WeightUnit}"
					}), new Input({
						value: "{Price}",
						description: "{CurrencyCode}"
					})
				]
			});

			this.byId("editButton").setVisible(false);
			this.byId("saveButton").setVisible(true);
			this.byId("cancelButton").setVisible(true);
			this.rebindTable(this.oEditableTemplate, "Edit");
		},
		createInvoice: function () {

			if (!this.oUploadDialog) {
				Fragment.load({
					id: "uploadDialog",
					name: "com.atc.sd.atc.view.fragments.InvoiceUploader",
					controller: this
				}).then(function (oDialog) {
					this.getView().addDependent(oDialog);
					this.oUploadDialog = oDialog;
					this.oUploadDialog.open();
					this.oUploadCollection = this.byId("uploadCollection");
				}.bind(this));
			} else {
				this.oUploadDialog.open();
			}
		},
		onFileChange: function (oEvent) {
			// Handle file selection event
			var oUploadCollection = oEvent.getSource();
			var aFiles = oEvent.getParameter("files");
			for (let i = 0; i < aFiles.length; i++) {
				// Add file to UploadCollection
				oUploadCollection.addItem(new sap.m.UploadCollectionItem({
					fileName: aFiles[i].name
				}));
			}

		},

		onUpload: function () {
			// Perform the upload
			if (this.oUploadCollection) {
				this.oUploadCollection.upload();
			}
		},

		onUploadComplete: function (oEvent) {
			// Handle upload completion event
			var aUploadedFiles = oEvent.getParameter("files");

			aUploadedFiles.forEach(function (oFile) {
				// MessageToast.show("Uploaded file: " + oFile.fileName);
			});

			// Clear the UploadCollection after upload
			if (this.oUploadCollection) {
				this.oUploadCollection.removeAllItems();
			}
			// this.oUploadDialog.close();
			WorkflowService.postData();
			var that = this;
			WorkflowService.getData().then(function (oResponse) {
				console.log(oResponse);
                
				var aPrev = that.getView().getModel().getProperty("/ProductCollection")
                aPrev.push(oResponse[0]);
				that.getView().getModel().setProperty("/ProductCollection",aPrev)
			});
		},

		onCancel: function () {
			// Close the dialog without uploading
			this.oUploadDialog.close();
		},
		onEditInvoice: function () {

			this.byId("idEditInvoice").setVisible(false);
			this.byId("idSaveInvoice").setVisible(true);

			this.getOwnerComponent().getModel("ui").setProperty("/UIState", "Edit");
		},

		onSaveInvoice: function () {

			this.byId("idEditInvoice").setVisible(true);
			this.byId("idSaveInvoice").setVisible(false);

			this.getOwnerComponent().getModel("ui").setProperty("/UIState", "Display");

		},

		onPress: function () {

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.atc.hr.E-Invoicing.view.Dashboard
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.atc.hr.E-Invoicing.view.Dashboard
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.atc.hr.E-Invoicing.view.Dashboard
		 */
		//	onExit: function() {
		//
		//	}

	});

});