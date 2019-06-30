(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./list-page", "./fields/custom-data-field", "./fields/date-time-field", "./fields/operation-field", "./fields/value-text-field", "./item-page", "./fields/input-field", "./fields/dropdown-field", "./fields/radio-field"], factory);
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
    var operation_field_1 = require("./fields/operation-field");
    exports.operationField = operation_field_1.operationField;
    var value_text_field_1 = require("./fields/value-text-field");
    exports.valueTextField = value_text_field_1.valueTextField;
    var item_page_1 = require("./item-page");
    exports.ItemPage = item_page_1.ItemPage;
    exports.ItemPageContext = item_page_1.ItemPageContext;
    var input_field_1 = require("./fields/input-field");
    exports.InputField = input_field_1.InputField;
    var dropdown_field_1 = require("./fields/dropdown-field");
    exports.DropdownField = dropdown_field_1.DropdownField;
    var radio_field_1 = require("./fields/radio-field");
    exports.RadioField = radio_field_1.RadioField;
});
