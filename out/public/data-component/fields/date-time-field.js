(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./custom-data-field"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const custom_data_field_1 = require("./custom-data-field");
    function dateTimeField(args) {
        return custom_data_field_1.customDataField({
            // dataField: args.dataField,
            headerText: args.headerText,
            headerStyle: { textAlign: 'center', width: '160px' },
            itemStyle: { textAlign: 'center', width: `160px` },
            // dataFormatString: "{gg}"
            render: (dataItem) => {
                let value = dataItem[args.dataField];
                // if (typeof value == 'number')
                return toDateTimeString(value);
            }
        });
    }
    exports.dateTimeField = dateTimeField;
    function toDateTimeString(datetime) {
        if (datetime == null)
            return null;
        let d;
        if (typeof datetime == 'number')
            d = new Date(datetime);
        else
            d = datetime;
        let month = `${d.getMonth() + 1}`;
        month = month.length == 1 ? '0' + month : month;
        let date = `${d.getDate()}`;
        date = date.length == 1 ? '0' + date : date;
        let hours = `${d.getHours()}`;
        hours = hours.length == 1 ? '0' + hours : hours;
        let minutes = `${d.getMinutes()}`;
        minutes = minutes.length == 1 ? '0' + minutes : minutes;
        return `${d.getFullYear()}-${month}-${date} ${hours}:${minutes}`;
    }
});
