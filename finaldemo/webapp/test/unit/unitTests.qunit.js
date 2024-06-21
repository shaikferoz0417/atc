/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"invoice/finaldemo/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
