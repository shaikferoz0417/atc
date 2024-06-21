sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

],
	function (Controller, JSONModel, MessageToast, Filter, FilterOperator) {
		"use strict";

		return Controller.extend("invoiceautomation.invoiceautomation.controller.View1", {


			onInit: function () {

				var oData = {
					Approvers: []
				};

				var oModel = new JSONModel(oData);
				this.getView().setModel(oModel, "vendorModel");

				var sFilePath = "model/Vendor.json";

				var oModel = new sap.ui.model.json.JSONModel();

				oModel.loadData(sFilePath);

				oModel.attachRequestCompleted(function () {

					if (oModel.getData()) {

						var oView = this.getView();
						oView.setModel(oModel, "vendorModel");

						sap.m.MessageToast.show("Data fetched successfully.");
					} else {

						sap.m.MessageToast.show("Failed to fetch data.");
					}

				}.bind(this));


				var sFilePathh = "model/Trade.json";

				var oModell = new sap.ui.model.json.JSONModel();

				oModell.loadData(sFilePathh);
				oModell.attachRequestCompleted(function () {

					if (oModell.getData()) {

						var oView = this.getView();
						oView.setModel(oModell, "tradeModel");

						sap.m.MessageToast.show("Data fetched successfully.");
					} else {

						sap.m.MessageToast.show("Failed to fetch data.");
					}

				}.bind(this));

			},

			onAdd: function () {
				var oModel = this.getView().getModel("vendorModel");
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


			onVendorChange: function (oEvent) {
				var oComboBox = oEvent.getSource();
				var sSelectedKey = oComboBox.getSelectedKey();
				var sSelectedItem = oComboBox.getSelectedItem();
				var sSelectedItemText = sSelectedItem.getText();
				var sVendorCategory = sSelectedItem.getBindingContext("vendorModel").getProperty("VENDORCATEGORY");
				var oContext = oComboBox.getBindingContext("tradeModel");
				var oTradeModel = this.getView().getModel("tradeModel");
				var sPath = oContext.getPath();

				oTradeModel.setProperty(sPath + "/VENDORNAME", sSelectedItemText);
				oTradeModel.setProperty(sPath + "/VENDORID", sSelectedKey);
				oTradeModel.setProperty(sPath + "/VENDORCATEGORY", sVendorCategory);
			}
		});
	});
