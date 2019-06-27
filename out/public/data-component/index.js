(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./list-page", "./fields/custom-data-field", "./fields/date-time-field", "./fields/operationField", "./fields/value-text-field"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var list_page_1 = require("./list-page");
    exports.ListPage = list_page_1.ListPage;
    exports.ListPageContext = list_page_1.ListPageContext;
    var custom_data_field_1 = require("./fields/custom-data-field");
    exports.customDataField = custom_data_field_1.customDataField;
    var date_time_field_1 = require("./fields/date-time-field");
    exports.dateTimeField = date_time_field_1.dateTimeField;
    var operationField_1 = require("./fields/operationField");
    exports.operationField = operationField_1.operationField;
    var value_text_field_1 = require("./fields/value-text-field");
    exports.valueTextField = value_text_field_1.valueTextField;
});
