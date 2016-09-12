var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wuzhui;
(function (wuzhui) {
    var CONTROL_DATA_NAME = 'Control';
    var Control = (function () {
        function Control(element) {
            if (!element)
                throw wuzhui.Errors.argumentNull('element');
            this._element = element;
            $(element).data(CONTROL_DATA_NAME, this);
        }
        Object.defineProperty(Control.prototype, "html", {
            get: function () {
                return $(this.element).html();
            },
            set: function (value) {
                $(this.element).html(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "visible", {
            get: function () {
                return $(this.element).is(':visible');
            },
            set: function (value) {
                if (value)
                    $(this._element).show();
                else
                    $(this._element).hide();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "element", {
            get: function () {
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        Control.prototype.appendChild = function (child) {
            if (child == null)
                throw wuzhui.Errors.argumentNull('child');
            var childElement;
            if (child instanceof Control)
                childElement = child.element;
            else
                childElement = child;
            this.element.appendChild(childElement);
        };
        Control.prototype.style = function (value) {
            wuzhui.applyStyle(this.element, value);
        };
        Control.getControlByElement = function (element) {
            return $(element).data(CONTROL_DATA_NAME);
        };
        return Control;
    }());
    wuzhui.Control = Control;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    var DataSource = (function () {
        function DataSource(primaryKeys) {
            this.inserting = $.Callbacks();
            this.inserted = $.Callbacks();
            this.deleting = $.Callbacks();
            this.deleted = $.Callbacks();
            this.updating = $.Callbacks();
            this.updated = $.Callbacks();
            this.selecting = $.Callbacks();
            this.selected = $.Callbacks();
            this.primaryKeys = primaryKeys;
            this._currentSelectArguments = new DataSourceSelectArguments();
        }
        Object.defineProperty(DataSource.prototype, "selectArguments", {
            get: function () {
                return this._currentSelectArguments;
            },
            enumerable: true,
            configurable: true
        });
        DataSource.prototype.executeInsert = function (item) {
            throw wuzhui.Errors.notImplemented();
        };
        DataSource.prototype.executeDelete = function (item) {
            throw wuzhui.Errors.notImplemented();
        };
        DataSource.prototype.executeUpdate = function (item) {
            throw wuzhui.Errors.notImplemented();
        };
        DataSource.prototype.executeSelect = function (args) {
            throw wuzhui.Errors.notImplemented();
        };
        DataSource.prototype.insert = function (item) {
            var _this = this;
            if (!this.canInsert)
                throw wuzhui.Errors.dataSourceCanntInsert();
            this.checkPrimaryKeys(item);
            this.inserting.fireWith(this, [this, { item: item }]);
            return this.executeInsert(item).done(function (data) {
                $.extend(item, data);
                _this.inserted.fireWith(_this, [_this, { item: item }]);
            });
        };
        DataSource.prototype.delete = function (item) {
            var _this = this;
            if (!this.canDelete)
                throw wuzhui.Errors.dataSourceCanntDelete();
            this.checkPrimaryKeys(item);
            this.deleting.fireWith(this, [this, { item: item }]);
            return this.executeDelete(item).done(function () {
                _this.deleted.fireWith(_this, [_this, { item: item }]);
            });
        };
        DataSource.prototype.update = function (item) {
            if (!this.canUpdate)
                throw wuzhui.Errors.dataSourceCanntDelete();
            this.checkPrimaryKeys(item);
            this.updating.fireWith(this, [this, { item: item }]);
            return this.executeUpdate(item).done(function (data) {
                $.extend(item, data);
            });
        };
        DataSource.prototype.checkPrimaryKeys = function (item) {
            for (var key in item) {
                if (item[key] == null && this.primaryKeys.indexOf(key) >= 0)
                    throw wuzhui.Errors.primaryKeyNull(key);
            }
        };
        DataSource.prototype.select = function () {
            var _this = this;
            var args = this.selectArguments;
            this.selecting.fireWith(this, [this, { selectArguments: args }]);
            return this.executeSelect(args).done(function (data) {
                var data_items;
                var result = data;
                if ($.isArray(data)) {
                    data_items = data;
                    args.totalRowCount = data_items.length;
                }
                else if (result.dataItems !== undefined && result.totalRowCount !== undefined) {
                    data_items = data.dataItems;
                    args.totalRowCount = data.totalRowCount;
                }
                else {
                    throw new Error('Type of the query result is expected as Array or DataSourceSelectResult.');
                }
                _this.selected.fireWith(_this, [_this, { selectArguments: args, items: data_items }]);
            });
        };
        Object.defineProperty(DataSource.prototype, "canDelete", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataSource.prototype, "canInsert", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataSource.prototype, "canUpdate", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        return DataSource;
    }());
    wuzhui.DataSource = DataSource;
    var DataSourceSelectArguments = (function () {
        function DataSourceSelectArguments(params) {
            params = $.extend({
                startRowIndex: 0,
                maximumRows: 2147483647
            }, params || {});
            this._startRowIndex = params.startRowIndex;
            this._totalRowCount = null;
            this._maximumRows = params.maximumRows;
            this._sortExpression = null;
        }
        Object.defineProperty(DataSourceSelectArguments.prototype, "startRowIndex", {
            get: function () {
                return this._startRowIndex;
            },
            set: function (value) {
                this._startRowIndex = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataSourceSelectArguments.prototype, "totalRowCount", {
            get: function () {
                return this._totalRowCount;
            },
            set: function (value) {
                this._totalRowCount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataSourceSelectArguments.prototype, "maximumRows", {
            get: function () {
                return this._maximumRows;
            },
            set: function (value) {
                this._maximumRows = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataSourceSelectArguments.prototype, "sortExpression", {
            get: function () {
                return this._sortExpression;
            },
            set: function (value) {
                this._sortExpression = value;
            },
            enumerable: true,
            configurable: true
        });
        return DataSourceSelectArguments;
    }());
    wuzhui.DataSourceSelectArguments = DataSourceSelectArguments;
    var WebDataSource = (function (_super) {
        __extends(WebDataSource, _super);
        function WebDataSource(args) {
            _super.call(this, args.primaryKeys);
            this.args = args;
        }
        Object.defineProperty(WebDataSource.prototype, "canDelete", {
            get: function () {
                return this.args.deleteUrl != null && this.primaryKeys.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebDataSource.prototype, "canInsert", {
            get: function () {
                return this.args.insertUrl != null && this.primaryKeys.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebDataSource.prototype, "canUpdate", {
            get: function () {
                return this.args.updateUrl != null && this.primaryKeys.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        WebDataSource.prototype.executeInsert = function (item) {
            if (!item)
                throw wuzhui.Errors.argumentNull("item");
            return wuzhui.ajax(this.args.selectUrl, this.formatData(item));
        };
        WebDataSource.prototype.executeDelete = function (item) {
            if (!item)
                throw wuzhui.Errors.argumentNull("item");
            return wuzhui.ajax(this.args.deleteUrl, this.formatData(item));
        };
        WebDataSource.prototype.executeUpdate = function (item) {
            if (!item)
                throw wuzhui.Errors.argumentNull("item");
            return wuzhui.ajax(this.args.updateUrl, this.formatData(item));
        };
        WebDataSource.prototype.executeSelect = function (args) {
            if (!args)
                throw wuzhui.Errors.argumentNull("args");
            return wuzhui.ajax(this.args.selectUrl, args);
        };
        WebDataSource.prototype.formatData = function (data) {
            var obj = $.extend({}, data);
            for (var name_1 in obj) {
                if (data[name_1] instanceof Date) {
                    var date = obj[name_1];
                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;
                    var d = date.getDate();
                    var h = date.getHours();
                    var M = date.getMinutes();
                    var s = date.getSeconds();
                    obj[name_1] = y + "-" + m + "-" + d + " " + h + ":" + M + ":" + s;
                }
            }
            return obj;
        };
        return WebDataSource;
    }(DataSource));
    wuzhui.WebDataSource = WebDataSource;
    var ArrayDataSource = (function (_super) {
        __extends(ArrayDataSource, _super);
        function ArrayDataSource(items, primaryKeys) {
            if (items == null)
                throw wuzhui.Errors.argumentNull('items');
            _super.call(this, primaryKeys);
            this.source = items;
        }
        ArrayDataSource.prototype.executeInsert = function (item) {
            if (item == null)
                throw wuzhui.Errors.argumentNull('item');
            this.source.push(item);
            return $.Deferred().resolve();
        };
        ArrayDataSource.prototype.executeDelete = function (item) {
            if (item == null)
                throw wuzhui.Errors.argumentNull('item');
            var pkValues = this.getPrimaryKeyValues(item);
            var itemIndex = this.findItem(pkValues);
            this.source.filter(function (value, index, array) {
                return index != itemIndex;
            });
            return $.Deferred().resolve();
        };
        ArrayDataSource.prototype.executeUpdate = function (item) {
            if (item == null)
                throw wuzhui.Errors.argumentNull('item');
            var pkValues = this.getPrimaryKeyValues(item);
            var itemIndex = this.findItem(pkValues);
            if (itemIndex >= 0) {
                var sourceItem = this.source[itemIndex];
                for (var key in sourceItem) {
                    sourceItem[key] = item[key];
                }
            }
            return $.Deferred().resolve();
        };
        ArrayDataSource.prototype.executeSelect = function (args) {
            return $.Deferred().resolve(this.source);
        };
        Object.defineProperty(ArrayDataSource.prototype, "canDelete", {
            get: function () {
                return this.primaryKeys.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrayDataSource.prototype, "canInsert", {
            get: function () {
                return this.primaryKeys.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrayDataSource.prototype, "canUpdate", {
            get: function () {
                return this.primaryKeys.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        ArrayDataSource.prototype.getPrimaryKeyValues = function (item) {
            var pkValues = [];
            for (var i = 0; i < this.primaryKeys.length; i++) {
                pkValues[i] = item[this.primaryKeys[i]];
            }
            return pkValues;
        };
        ArrayDataSource.prototype.findItem = function (pkValues) {
            for (var i = 0; i < this.source.length; i++) {
                var item = this.source[i];
                var same = true;
                for (var j = 0; j < this.primaryKeys.length; j++) {
                    var primaryKey = this.primaryKeys[j];
                    if (item[primaryKey] != pkValues[primaryKey]) {
                        same = false;
                        break;
                    }
                }
                if (same) {
                    return i;
                }
            }
            return -1;
        };
        return ArrayDataSource;
    }(DataSource));
    wuzhui.ArrayDataSource = ArrayDataSource;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    var Errors = (function () {
        function Errors(parameters) {
        }
        Errors.notImplemented = function (message) {
            message = message || "Not implemented";
            return new Error(message);
        };
        Errors.argumentNull = function (paramName) {
            return new Error("Argument '" + paramName + "' can not be null.");
        };
        Errors.controllBelonsAnother = function () {
            return new Error("The control is belongs another control.");
        };
        Errors.columnsCanntEmpty = function () {
            return new Error("Columns cannt empty.");
        };
        Errors.dataSourceCanntInsert = function () {
            return new Error("DataSource can not insert.");
        };
        Errors.dataSourceCanntUpdate = function () {
            return new Error("DataSource can not update.");
        };
        Errors.dataSourceCanntDelete = function () {
            return new Error("DataSource can not delete.");
        };
        Errors.primaryKeyNull = function (key) {
            var msg = "Primary key named '" + key + "' value is null.";
            return new Error(msg);
        };
        return Errors;
    }());
    wuzhui.Errors = Errors;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    var GridViewCell = (function (_super) {
        __extends(GridViewCell, _super);
        function GridViewCell(field) {
            _super.call(this, document.createElement('td'));
            this._field = field;
        }
        Object.defineProperty(GridViewCell.prototype, "field", {
            get: function () {
                return this._field;
            },
            enumerable: true,
            configurable: true
        });
        return GridViewCell;
    }(wuzhui.Control));
    wuzhui.GridViewCell = GridViewCell;
    var DataControlField = (function () {
        function DataControlField(params) {
            if (params.visible == null)
                params.visible = true;
            this._params = params;
        }
        Object.defineProperty(DataControlField.prototype, "footerText", {
            get: function () {
                return this._params.footerText;
            },
            set: function (value) {
                this._params.footerText = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "headerText", {
            get: function () {
                return this._params.headerText;
            },
            set: function (value) {
                this._params.headerText = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "itemStyle", {
            get: function () {
                return this._params.itemStyle;
            },
            set: function (value) {
                this._params.itemStyle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "footerStyle", {
            get: function () {
                return this._params.footerStyle;
            },
            set: function (value) {
                this._params.footerStyle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "headerStyle", {
            get: function () {
                return this._params.headerStyle;
            },
            set: function (value) {
                this._params.headerStyle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "visible", {
            get: function () {
                return this._params.visible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "gridView", {
            get: function () {
                return this._gridView;
            },
            set: function (value) {
                this._gridView = value;
            },
            enumerable: true,
            configurable: true
        });
        DataControlField.prototype.createHeaderCell = function () {
            var cell = new GridViewCell(this);
            cell.html = this.headerText || '';
            cell.style(this.headerStyle);
            return cell;
        };
        DataControlField.prototype.createFooterCell = function () {
            var cell = new GridViewCell(this);
            cell.html = this.footerText || '';
            cell.style(this.footerStyle);
            return cell;
        };
        DataControlField.prototype.createItemCell = function (dataItem) {
            if (!dataItem)
                throw wuzhui.Errors.argumentNull('dataItem');
            var cell = new GridViewCell(this);
            cell.style(this.itemStyle);
            return cell;
        };
        return DataControlField;
    }());
    wuzhui.DataControlField = DataControlField;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    var GridViewEditableCell = (function (_super) {
        __extends(GridViewEditableCell, _super);
        function GridViewEditableCell(field, dataItem) {
            if (field == null)
                throw wuzhui.Errors.argumentNull('field');
            if (dataItem == null)
                throw wuzhui.Errors.argumentNull('dataItem');
            _super.call(this, field);
            this._dataItem = dataItem;
            this._valueElement = document.createElement('span');
            if (field.nullText) {
                this._valueElement.innerHTML = field.nullText;
            }
            this._editorElement = this.createControl();
            this.appendChild(this._valueElement);
            this.appendChild(this._editorElement);
            wuzhui.applyStyle(this._editorElement, this.field.controlStyle);
            this.value = dataItem[field.dataField];
            if (this.value instanceof Date)
                this._valueType = 'date';
            else
                this._valueType = typeof this.value;
            $(this._editorElement).hide();
        }
        GridViewEditableCell.prototype.beginEdit = function () {
            $(this._valueElement).hide();
            $(this._editorElement).show();
            var value = this._dataItem[this.field.dataField];
            this.setControlValue(value);
        };
        GridViewEditableCell.prototype.endEdit = function () {
            var value = this.getControlValue();
            this._dataItem[this.field.dataField] = value;
            this._valueElement.innerHTML = this.getCellHtml(value);
            $(this._editorElement).hide();
            $(this._valueElement).show();
        };
        GridViewEditableCell.prototype.cancelEdit = function () {
            $(this._editorElement).hide();
            $(this._valueElement).show();
        };
        Object.defineProperty(GridViewEditableCell.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                if (this._value == value)
                    return;
                this._value = value;
                this.setControlValue(value);
                this._valueElement.innerHTML = this.getCellHtml(value);
            },
            enumerable: true,
            configurable: true
        });
        GridViewEditableCell.prototype.createControl = function () {
            var ctrl = document.createElement('span');
            ctrl.appendChild(document.createElement('input'));
            return ctrl;
        };
        GridViewEditableCell.prototype.setControlValue = function (value) {
            $(this._editorElement).find('input').val(value);
        };
        GridViewEditableCell.prototype.getControlValue = function () {
            var text = $(this._editorElement).find('input').val();
            switch (this._valueType) {
                case 'number':
                    return new Number(text).valueOf();
                case 'date':
                    return new Date(text);
                default:
                    return text;
            }
        };
        GridViewEditableCell.prototype.getCellHtml = function (value) {
            if (value == null)
                return this.field.nullText;
            if (this.field.dataFormatString)
                return this.formatValue(this.field.dataFormatString, value);
            return value;
        };
        GridViewEditableCell.prototype.formatValue = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var result = '';
            var format = args[0];
            for (var i = 0;;) {
                var open = format.indexOf('{', i);
                var close = format.indexOf('}', i);
                if ((open < 0) && (close < 0)) {
                    result += format.slice(i);
                    break;
                }
                if ((close > 0) && ((close < open) || (open < 0))) {
                    if (format.charAt(close + 1) !== '}') {
                        throw new Error('Sys.Res.stringFormatBraceMismatch');
                    }
                    result += format.slice(i, close + 1);
                    i = close + 2;
                    continue;
                }
                result += format.slice(i, open);
                i = open + 1;
                if (format.charAt(i) === '{') {
                    result += '{';
                    i++;
                    continue;
                }
                if (close < 0)
                    throw new Error('Sys.Res.stringFormatBraceMismatch');
                var brace = format.substring(i, close);
                var colonIndex = brace.indexOf(':');
                var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10) + 1;
                if (isNaN(argNumber))
                    throw new Error('Sys.Res.stringFormatInvalid');
                var argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1);
                var arg = args[argNumber];
                if (typeof (arg) === "undefined" || arg === null) {
                    arg = '';
                }
                if (arg instanceof Date)
                    result = result + this.formatDate(arg, argFormat);
                else if (arg instanceof Number || typeof arg == 'number')
                    result = result + this.formatNumber(arg, argFormat);
                else
                    result = result + arg.toString();
                i = close + 1;
            }
            return result;
        };
        GridViewEditableCell.prototype.formatDate = function (value, format) {
            switch (format) {
                case 'd':
                    return value.getFullYear() + "-" + (value.getMonth() + 1) + "-" + value.getDate();
                case 'g':
                    return value.getFullYear() + "-" + (value.getMonth() + 1) + "-" + value.getDate() + " " + value.getHours() + ":" + value.getMinutes();
                case 'G':
                    return value.getFullYear() + "-" + (value.getMonth() + 1) + "-" + value.getDate() + " " + value.getHours() + ":" + value.getMinutes() + ":" + value.getSeconds();
                case 't':
                    return value.getHours() + ":" + value.getMinutes();
                case 'T':
                    return value.getHours() + ":" + value.getMinutes() + ":" + value.getSeconds();
            }
            return value.toString();
        };
        GridViewEditableCell.prototype.formatNumber = function (value, format) {
            var reg = new RegExp('^C[0-9]+');
            if (reg.test(format)) {
                var num = format.substr(1);
                return value.toFixed(num);
            }
            return value.toString();
        };
        return GridViewEditableCell;
    }(wuzhui.GridViewCell));
    wuzhui.GridViewEditableCell = GridViewEditableCell;
    var BoundFieldHeaderCell = (function (_super) {
        __extends(BoundFieldHeaderCell, _super);
        function BoundFieldHeaderCell(field) {
            var _this = this;
            _super.call(this, field);
            this.ascHTML = '↑';
            this.descHTML = '↓';
            this.sortingHTML = '...';
            this.sorting = wuzhui.callbacks();
            this.sorted = wuzhui.callbacks();
            if (field.sortExpression) {
                var labelElement = document.createElement('a');
                labelElement.href = 'javascript:';
                labelElement.innerHTML = this.defaultHeaderText();
                $(labelElement).click(function () { return _this.handleSort(); });
                this._iconElement = document.createElement('span');
                this.appendChild(labelElement);
                this.appendChild(this._iconElement);
                this.sorting.add(function () { return _this._iconElement.innerHTML = _this.sortingHTML; });
                this.sorted.add(function () { return _this.updateSortIcon(); });
            }
            else {
                this.element.innerHTML = this.defaultHeaderText();
            }
            this.style(field.headerStyle);
        }
        BoundFieldHeaderCell.prototype.handleSort = function () {
            var _this = this;
            var selectArguments = this.field.gridView.dataSource.selectArguments;
            var sortType = this.sortType == 'asc' ? 'desc' : 'asc';
            wuzhui.fireCallback(this.sorting, this, { sortType: sortType });
            selectArguments.sortExpression = this.field.sortExpression + ' ' + sortType;
            return this.field.gridView.dataSource.select()
                .done(function () {
                _this.sortType = sortType;
                wuzhui.fireCallback(_this.sorted, _this, { sortType: sortType });
            });
        };
        BoundFieldHeaderCell.prototype.defaultHeaderText = function () {
            return this.field.headerText || this.field.dataField;
        };
        Object.defineProperty(BoundFieldHeaderCell.prototype, "sortType", {
            get: function () {
                return this._sortType;
            },
            set: function (value) {
                this._sortType = value;
            },
            enumerable: true,
            configurable: true
        });
        BoundFieldHeaderCell.prototype.clearSortIcon = function () {
            this._iconElement.innerHTML = '';
        };
        BoundFieldHeaderCell.prototype.updateSortIcon = function () {
            if (this.sortType == 'asc') {
                this._iconElement.innerHTML = '↑';
            }
            else if (this.sortType == 'desc') {
                this._iconElement.innerHTML = '↓';
            }
            else {
                this._iconElement.innerHTML = '';
            }
        };
        return BoundFieldHeaderCell;
    }(wuzhui.GridViewCell));
    wuzhui.BoundFieldHeaderCell = BoundFieldHeaderCell;
    var BoundField = (function (_super) {
        __extends(BoundField, _super);
        function BoundField(params) {
            _super.call(this, params);
            this._params = params;
            this._valueElement = document.createElement('span');
        }
        BoundField.prototype.params = function () {
            return this._params;
        };
        Object.defineProperty(BoundField.prototype, "nullText", {
            get: function () {
                return this.params().nullText;
            },
            enumerable: true,
            configurable: true
        });
        BoundField.prototype.createHeaderCell = function () {
            var cell = new BoundFieldHeaderCell(this);
            return cell;
        };
        BoundField.prototype.createItemCell = function (dataItem) {
            var cell = new GridViewEditableCell(this, dataItem);
            cell.style(this.itemStyle);
            return cell;
        };
        Object.defineProperty(BoundField.prototype, "sortExpression", {
            get: function () {
                return this.params().sortExpression;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoundField.prototype, "dataField", {
            get: function () {
                return this.params().dataField;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoundField.prototype, "dataFormatString", {
            get: function () {
                return this.params().dataFormatString;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoundField.prototype, "controlStyle", {
            get: function () {
                return this.params().controlStyle;
            },
            enumerable: true,
            configurable: true
        });
        return BoundField;
    }(wuzhui.DataControlField));
    wuzhui.BoundField = BoundField;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    var GridViewCommandCell = (function (_super) {
        __extends(GridViewCommandCell, _super);
        function GridViewCommandCell(field) {
            _super.call(this, field);
        }
        return GridViewCommandCell;
    }(wuzhui.GridViewCell));
    var CommandField = (function (_super) {
        __extends(CommandField, _super);
        function CommandField(params) {
            _super.call(this, params);
            this._updating = false;
            this._deleting = false;
            if (!this.params().cancelButtonHTML)
                this.params().cancelButtonHTML = '取消';
            if (!this.params().deleteButtonHTML)
                this.params().deleteButtonHTML = '删除';
            if (!this.params().editButtonHTML)
                this.params().editButtonHTML = '编辑';
            if (!this.params().updateButtonHTML)
                this.params().updateButtonHTML = '更新';
        }
        CommandField.prototype.params = function () {
            return this._params;
        };
        Object.defineProperty(CommandField.prototype, "cancelButtonHTML", {
            get: function () {
                return this.params().cancelButtonHTML;
            },
            set: function (value) {
                this.params().cancelButtonHTML = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "deleteButtonHTML", {
            get: function () {
                return this.params().deleteButtonHTML;
            },
            set: function (value) {
                this.params().deleteButtonHTML = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "editButtonHTML", {
            get: function () {
                return this.params().editButtonHTML;
            },
            set: function (value) {
                this.params().editButtonHTML = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "updateButtonHTML", {
            get: function () {
                return this.params().updateButtonHTML;
            },
            set: function (value) {
                this.params().updateButtonHTML = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "newButtonHTML", {
            get: function () {
                return this.params().newButtonHTML;
            },
            set: function (value) {
                this.params().newButtonHTML = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "insertButtonHTML", {
            get: function () {
                return this.params().insertButtonHTML;
            },
            set: function (value) {
                this.params().insertButtonHTML = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "cancelButtonClass", {
            get: function () {
                return this.params().cancelButtonClass;
            },
            set: function (value) {
                this.params().cancelButtonClass = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "deleteButtonClass", {
            get: function () {
                return this.params().deleteButtonClass;
            },
            set: function (value) {
                this.params().deleteButtonClass = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "editButtonClass", {
            get: function () {
                return this.params().editButtonClass;
            },
            set: function (value) {
                this.params().editButtonClass = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "newButtonClass", {
            get: function () {
                return this.params().newButtonClass;
            },
            set: function (value) {
                this.params().newButtonClass = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "updateButtonClass", {
            get: function () {
                return this.params().updateButtonClass;
            },
            set: function (value) {
                this.params().updateButtonClass = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "insertButtonClass", {
            get: function () {
                return this.params().insertButtonClass;
            },
            set: function (value) {
                this.params().insertButtonClass = value;
            },
            enumerable: true,
            configurable: true
        });
        CommandField.prototype.createItemCell = function (dataItem) {
            var cell = new GridViewCommandCell(this);
            cell.style(this.itemStyle);
            if (this.params().showEditButton) {
                var editButton = this.createEditButton();
                editButton.style.marginRight = '4px';
                if (this.editButtonClass)
                    editButton.className = this.editButtonClass;
                cell.editButton = editButton;
                $(editButton).click(this.on_editButtonClick);
                cell.appendChild(editButton);
                var updateButton = this.createUpdateButton();
                updateButton.style.display = 'none';
                updateButton.style.marginRight = '4px';
                if (this.updateButtonClass)
                    updateButton.className = this.updateButtonClass;
                cell.updateButton = updateButton;
                $(updateButton).click(this.on_updateButtonClick);
                cell.appendChild(updateButton);
                var cancelButton = this.createCancelButton();
                cancelButton.style.display = 'none';
                cancelButton.style.marginRight = '4px';
                if (this.cancelButtonClass)
                    cancelButton.className = this.cancelButtonClass;
                cell.cacelButton = cancelButton;
                $(cancelButton).click(this.on_cancelButtonClick);
                cell.appendChild(cancelButton);
            }
            if (this.params().showDeleteButton) {
                var deleteButton = this.createDeleteButton();
                deleteButton.style.marginRight = '4px';
                if (this.deleteButtonClass)
                    deleteButton.className = this.deleteButtonClass;
                cell.deleteButton = deleteButton;
                $(deleteButton).click(this.on_deleteButtonClick);
                cell.appendChild(deleteButton);
            }
            if (this.params().showNewButton) {
                var newButton = this.createNewButton();
                newButton.style.marginRight = '4px';
                if (this.newButtonClass)
                    newButton.className = this.newButtonClass;
                cell.newButton = newButton;
                cell.appendChild(newButton);
            }
            return cell;
        };
        CommandField.prototype.createEditButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.editButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.createDeleteButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.deleteButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.createInsertButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.insertButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.createUpdateButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.updateButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.createCancelButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.cancelButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.createNewButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.newButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.on_editButtonClick = function (e) {
            var cellElement = $(e.target).parents('td').first()[0];
            var rowElement = cellElement.parentElement;
            for (var i = 0; i < rowElement.cells.length; i++) {
                var cell_1 = wuzhui.Control.getControlByElement(rowElement.cells[i]);
                if (cell_1 instanceof wuzhui.GridViewEditableCell) {
                    cell_1.beginEdit();
                }
            }
            var cell = wuzhui.Control.getControlByElement(cellElement);
            $([cell.cacelButton, cell.updateButton]).show();
            $(cell.editButton).hide();
        };
        CommandField.prototype.on_cancelButtonClick = function (e) {
            var cellElement = $(e.target).parents('td').first()[0];
            var rowElement = cellElement.parentElement;
            for (var i = 0; i < rowElement.cells.length; i++) {
                var cell_2 = wuzhui.Control.getControlByElement(rowElement.cells[i]);
                if (cell_2 instanceof wuzhui.GridViewEditableCell) {
                    cell_2.cancelEdit();
                }
            }
            var cell = wuzhui.Control.getControlByElement(cellElement);
            $([cell.cacelButton, cell.updateButton]).hide();
            $(cell.editButton).show();
        };
        CommandField.prototype.on_updateButtonClick = function (e) {
            var _this = this;
            if (this._updating)
                return;
            this._updating = true;
            var cellElement = $(e.target).parents('td').first()[0];
            var rowElement = cellElement.parentElement;
            var row = wuzhui.Control.getControlByElement(rowElement);
            var dataItem = $.extend({}, row.dataItem || {});
            var dataSource = row.gridView.dataSource;
            var editableCells = new Array();
            for (var i = 0; i < rowElement.cells.length; i++) {
                var cell = wuzhui.Control.getControlByElement(rowElement.cells[i]);
                if (cell instanceof wuzhui.GridViewEditableCell) {
                    dataItem[cell.field.dataField] = cell.getControlValue();
                    editableCells.push(cell);
                }
            }
            dataSource.update(dataItem)
                .done(function () {
                editableCells.forEach(function (item) { return item.endEdit(); });
                var cell = wuzhui.Control.getControlByElement(cellElement);
                $([cell.cacelButton, cell.updateButton]).hide();
                $(cell.editButton).show();
            })
                .always(function () { return _this._updating = false; });
        };
        CommandField.prototype.on_deleteButtonClick = function (e) {
            var _this = this;
            if (this._deleting)
                return;
            this._deleting = true;
            var rowElement = $(e.target).parents('tr').first()[0];
            var row = wuzhui.Control.getControlByElement(rowElement);
            var dataSource = row.gridView.dataSource;
            dataSource.delete(row.dataItem)
                .done(function () {
                $(rowElement).remove();
            })
                .always(function () { return _this._deleting = false; });
        };
        return CommandField;
    }(wuzhui.DataControlField));
    wuzhui.CommandField = CommandField;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    var CustomField = (function (_super) {
        __extends(CustomField, _super);
        function CustomField(params) {
            _super.call(this, params);
        }
        CustomField.prototype.params = function () {
            return this._params;
        };
        CustomField.prototype.createHeaderCell = function () {
            if (this.params().createHeaderCell) {
                var cell = this.params().createHeaderCell();
                cell.style(this.headerStyle);
                return cell;
            }
            return _super.prototype.createHeaderCell.call(this);
        };
        CustomField.prototype.createFooterCell = function () {
            if (this.params().createFooterCell) {
                var cell = this.params().createFooterCell();
                cell.style(this.params().footerStyle);
                return cell;
            }
            return _super.prototype.createFooterCell.call(this);
        };
        CustomField.prototype.createItemCell = function (dataItem) {
            if (this.params().createItemCell) {
                var cell = this.params().createItemCell(dataItem);
                cell.style(this.params().itemStyle);
                return cell;
            }
            return _super.prototype.createItemCell.call(this, dataItem);
        };
        return CustomField;
    }(wuzhui.DataControlField));
    wuzhui.CustomField = CustomField;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    (function (GridViewRowType) {
        GridViewRowType[GridViewRowType["Header"] = 0] = "Header";
        GridViewRowType[GridViewRowType["Footer"] = 1] = "Footer";
        GridViewRowType[GridViewRowType["Data"] = 2] = "Data";
        GridViewRowType[GridViewRowType["Paging"] = 3] = "Paging";
        GridViewRowType[GridViewRowType["Empty"] = 4] = "Empty";
    })(wuzhui.GridViewRowType || (wuzhui.GridViewRowType = {}));
    var GridViewRowType = wuzhui.GridViewRowType;
    var GridViewRow = (function (_super) {
        __extends(GridViewRow, _super);
        function GridViewRow(rowType) {
            var element = document.createElement('tr');
            _super.call(this, element);
            this._rowType = rowType;
        }
        Object.defineProperty(GridViewRow.prototype, "rowType", {
            get: function () {
                return this._rowType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridViewRow.prototype, "gridView", {
            get: function () {
                if (this._gridView == null) {
                    var gridViewElement = $(this.element).parents('table').first()[0];
                    console.assert(gridViewElement != null);
                    this._gridView = wuzhui.Control.getControlByElement(gridViewElement);
                    console.assert(this._gridView != null);
                }
                return this._gridView;
            },
            enumerable: true,
            configurable: true
        });
        return GridViewRow;
    }(wuzhui.Control));
    wuzhui.GridViewRow = GridViewRow;
    var GridViewDataRow = (function (_super) {
        __extends(GridViewDataRow, _super);
        function GridViewDataRow(gridView, dataItem) {
            _super.call(this, GridViewRowType.Data);
            this._dataItem = dataItem;
            for (var i = 0; i < gridView.columns.length; i++) {
                var column = gridView.columns[i];
                var cell = column.createItemCell(dataItem);
                cell.visible = column.visible;
                this.appendChild(cell);
            }
        }
        Object.defineProperty(GridViewDataRow.prototype, "dataItem", {
            get: function () {
                return this._dataItem;
            },
            enumerable: true,
            configurable: true
        });
        return GridViewDataRow;
    }(GridViewRow));
    wuzhui.GridViewDataRow = GridViewDataRow;
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView(params) {
            var _this = this;
            _super.call(this, params.element || document.createElement('table'));
            this.emptyDataText = '暂无记录';
            this.rowCreated = wuzhui.callbacks();
            params = $.extend({
                showHeader: true, showFooter: false,
                allowPaging: false
            }, params);
            this._columns = params.columns || [];
            if (this._columns.length == 0)
                throw wuzhui.Errors.columnsCanntEmpty();
            for (var i = 0; i < this._columns.length; i++) {
                var column = this._columns[i];
                column.gridView = this;
            }
            this._dataSource = params.dataSource;
            this._dataSource.selected.add(function (sender, e) { return _this.on_selectExecuted(e.items, e.selectArguments); });
            if (params.showHeader) {
                this._header = new wuzhui.Control(document.createElement('thead'));
                this.appendChild(this._header);
                this.appendHeaderRow();
            }
            this._body = new wuzhui.Control(document.createElement('tbody'));
            this.appendChild(this._body);
            this.appendEmptyRow();
            if (params.showFooter) {
                this._footer = new wuzhui.Control(document.createElement('tfoot'));
                this.appendChild(this._footer);
                if (params.showFooter)
                    this.appendFooterRow();
            }
        }
        Object.defineProperty(GridView.prototype, "columns", {
            get: function () {
                return this._columns;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridView.prototype, "dataSource", {
            get: function () {
                return this._dataSource;
            },
            enumerable: true,
            configurable: true
        });
        GridView.prototype.appendEmptyRow = function () {
            this._emtpyRow = new GridViewRow(GridViewRowType.Empty);
            this._emtpyRow.element.className = GridView.emptyRowClassName;
            var cell = document.createElement('td');
            cell.colSpan = this.columns.length;
            var textElement = document.createElement('span');
            textElement.innerText = this.emptyDataText;
            cell.appendChild(textElement);
            this._emtpyRow.appendChild(cell);
            this._body.appendChild(this._emtpyRow);
            wuzhui.fireCallback(this.rowCreated, this, { row: this._emtpyRow });
        };
        GridView.prototype.appendDataRow = function (dataItem) {
            var row = new GridViewDataRow(this, dataItem);
            row.element.className = GridView.dataRowClassName;
            this._body.appendChild(row);
            wuzhui.fireCallback(this.rowCreated, this, { row: row });
        };
        GridView.prototype.on_sort = function (sender, args) {
            if (this._currentSortCell != null && this._currentSortCell != sender) {
                this._currentSortCell.clearSortIcon();
            }
            this._currentSortCell = sender;
        };
        GridView.prototype.appendHeaderRow = function () {
            var row = new GridViewRow(GridViewRowType.Header);
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                var cell = column.createHeaderCell();
                if (cell instanceof wuzhui.BoundFieldHeaderCell) {
                    cell.sorting.add(this.on_sort);
                }
                row.appendChild(cell);
                cell.visible = this.columns[i].visible;
            }
            this._header.appendChild(row);
        };
        GridView.prototype.appendFooterRow = function () {
            var row = new GridViewRow(GridViewRowType.Footer);
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                var cell = column.createFooterCell();
                row.appendChild(cell);
                cell.visible = column.visible;
            }
            this._footer.appendChild(row);
        };
        GridView.prototype.on_selectExecuted = function (items, args) {
            var _this = this;
            $("." + GridView.dataRowClassName).each(function (i, e) { return _this._body.element.removeChild(e); });
            if (items.length == 0) {
                this.showEmptyRow();
                return;
            }
            this.hideEmptyRow();
            for (var i = 0; i < items.length; i++) {
                this.appendDataRow(items[i]);
            }
        };
        GridView.prototype.on_updateExecuted = function (items) {
        };
        GridView.prototype.showEmptyRow = function () {
            $(this._emtpyRow.element).show();
        };
        GridView.prototype.hideEmptyRow = function () {
            $(this._emtpyRow.element).hide();
        };
        GridView.emptyRowClassName = 'empty';
        GridView.dataRowClassName = 'data';
        return GridView;
    }(wuzhui.Control));
    wuzhui.GridView = GridView;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    (function (PagerPosition) {
        PagerPosition[PagerPosition["Bottom"] = 0] = "Bottom";
        PagerPosition[PagerPosition["Top"] = 1] = "Top";
        PagerPosition[PagerPosition["TopAndBottom"] = 2] = "TopAndBottom";
    })(wuzhui.PagerPosition || (wuzhui.PagerPosition = {}));
    var PagerPosition = wuzhui.PagerPosition;
    ;
    var PagingBar = (function () {
        function PagingBar() {
        }
        PagingBar.prototype.init = function (dataSource) {
            if (dataSource == null)
                throw wuzhui.Errors.argumentNull('dataSource');
            this._pageIndex = 0;
            this._dataSource = dataSource;
            var pagingBar = this;
            pagingBar.totalRowCount = 1000000;
            dataSource.selected.add(function (source, args) {
                pagingBar._pageSize = args.selectArguments.maximumRows;
                var totalRowCount = args.selectArguments.totalRowCount;
                if (totalRowCount != null && totalRowCount >= 0) {
                    pagingBar.totalRowCount = totalRowCount;
                }
                var startRowIndex = args.selectArguments.startRowIndex;
                if (startRowIndex <= 0)
                    startRowIndex = 0;
                pagingBar._pageIndex = Math.floor(startRowIndex / pagingBar._pageSize);
                pagingBar.render();
            });
            dataSource.deleted.add(function () {
                pagingBar.totalRowCount = pagingBar.totalRowCount - 1;
                pagingBar.render();
            });
            dataSource.inserted.add(function () {
                pagingBar.totalRowCount = pagingBar.totalRowCount + 1;
                pagingBar.render();
            });
        };
        Object.defineProperty(PagingBar.prototype, "pageCount", {
            get: function () {
                var pageCount = Math.ceil(this.totalRowCount / this.pageSize);
                return pageCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagingBar.prototype, "pageSize", {
            get: function () {
                return this._pageSize;
            },
            set: function (value) {
                this._pageSize = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagingBar.prototype, "pageIndex", {
            get: function () {
                return this._pageIndex;
            },
            set: function (value) {
                this._pageIndex = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagingBar.prototype, "totalRowCount", {
            get: function () {
                return this._totalRowCount;
            },
            set: function (value) {
                this._totalRowCount = value;
            },
            enumerable: true,
            configurable: true
        });
        PagingBar.prototype.render = function () {
            throw wuzhui.Errors.notImplemented('The table-row render method is not implemented.');
        };
        return PagingBar;
    }());
    wuzhui.PagingBar = PagingBar;
    var NumberPagingBar = (function (_super) {
        __extends(NumberPagingBar, _super);
        function NumberPagingBar(params) {
            if (!params.dataSource)
                throw wuzhui.Errors.argumentNull('dataSource');
            if (!params.element)
                throw wuzhui.Errors.argumentNull('element');
            var pagerSettings = $.extend({
                pageButtonCount: 10,
                firstPageText: '<<',
                lastPageText: '>>',
                nextPageText: '...',
                previousPageText: '...',
            }, params.pagerSettings || {});
            _super.call(this);
            this.dataSource = params.dataSource;
            this.pagerSettings = pagerSettings;
            this.element = params.element;
            this.numberButtons = new Array();
            this.createButton = params.createButton || this.createPagingButton;
            this.createLabel = params.createTotal || this.createTotalLabel;
            this.createPreviousButtons();
            this.createNumberButtons();
            this.createNextButtons();
            this.totalElement = this.createLabel();
            this.totalElement.visible = false;
            this.init(params.dataSource);
        }
        NumberPagingBar.prototype.createPagingButton = function () {
            var _this = this;
            var button = document.createElement('a');
            button.href = 'javascript:';
            this.element.appendChild(button);
            var result = {
                get visible() {
                    return $(button).is(':visible');
                },
                set visible(value) {
                    if (value)
                        $(button).show();
                    else
                        $(button).hide();
                },
                get pageIndex() {
                    return new Number($(button).attr('pageIndex')).valueOf();
                },
                set pageIndex(value) {
                    $(button).attr('pageIndex', value);
                },
                get text() {
                    return button.innerHTML;
                },
                set text(value) {
                    button.innerHTML = value;
                },
                get active() {
                    return button.href != null;
                },
                set active(value) {
                    if (value == true) {
                        $(button).removeAttr('href');
                        return;
                    }
                    button.href = 'javascript:';
                }
            };
            $(button).click(function () {
                if (result.onclick) {
                    result.onclick(result, _this);
                }
            });
            return result;
        };
        NumberPagingBar.prototype.createTotalLabel = function () {
            var totalElement = document.createElement('span');
            totalElement.className = 'total';
            var textElement = document.createElement('span');
            textElement.className = 'text';
            textElement.innerHTML = '总记录：';
            totalElement.appendChild(textElement);
            var numberElement = document.createElement('span');
            numberElement.className = 'number';
            totalElement.appendChild(numberElement);
            this.element.appendChild(totalElement);
            return {
                get text() {
                    return numberElement.innerHTML;
                },
                set text(value) {
                    numberElement.innerHTML = value;
                },
                get visible() {
                    return $(totalElement).is(':visible');
                },
                set visible(value) {
                    if (value == true)
                        $(totalElement).show();
                    else
                        $(totalElement).hide();
                }
            };
        };
        NumberPagingBar.prototype.createPreviousButtons = function () {
            this.firstPageButton = this.createButton();
            this.firstPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.firstPageButton.text = this.pagerSettings.firstPageText;
            this.firstPageButton.visible = false;
            this.previousPageButton = this.createButton();
            this.previousPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.previousPageButton.text = this.pagerSettings.previousPageText;
            this.previousPageButton.visible = false;
        };
        NumberPagingBar.prototype.createNextButtons = function () {
            this.nextPageButton = this.createButton();
            this.nextPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.nextPageButton.text = this.pagerSettings.nextPageText;
            this.nextPageButton.visible = false;
            this.lastPageButton = this.createButton();
            this.lastPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.lastPageButton.text = this.pagerSettings.lastPageText;
            this.lastPageButton.visible = false;
        };
        NumberPagingBar.prototype.createNumberButtons = function () {
            var pagingBar = this;
            var buttonCount = this.pagerSettings.pageButtonCount;
            for (var i = 0; i < buttonCount; i++) {
                var button = this.createButton();
                button.onclick = NumberPagingBar.on_buttonClick;
                this.numberButtons[i] = button;
            }
            $(this.numberButtons).click(function () {
                NumberPagingBar.on_buttonClick(this, pagingBar);
            });
        };
        NumberPagingBar.on_buttonClick = function (button, pagingBar) {
            var pageIndex = button.pageIndex;
            if (!pageIndex == null) {
                return;
            }
            var args = pagingBar.dataSource.selectArguments;
            args.maximumRows = pagingBar.pageSize;
            args.startRowIndex = pageIndex * pagingBar.pageSize;
            pagingBar.pageIndex = pageIndex;
            pagingBar.dataSource.select();
        };
        NumberPagingBar.prototype.render = function () {
            var pagerSettings = this.pagerSettings;
            var buttonCount = pagerSettings.pageButtonCount;
            var pagingBarIndex = Math.floor(this.pageIndex / buttonCount);
            var pagingBarCount = Math.floor(this.pageCount / buttonCount) + 1;
            this.previousPageButton.pageIndex = (pagingBarIndex - 1) * buttonCount;
            this.nextPageButton.pageIndex = (pagingBarIndex + 1) * buttonCount;
            this.firstPageButton.pageIndex = 0;
            this.lastPageButton.pageIndex = this.pageCount - 1;
            for (var i = 0; i < this.numberButtons.length; i++) {
                var pageIndex = pagingBarIndex * buttonCount + i;
                if (pageIndex < this.pageCount) {
                    this.numberButtons[i].pageIndex = pageIndex;
                    this.numberButtons[i].text = (pagingBarIndex * buttonCount + i + 1).toString();
                    this.numberButtons[i].visible = true;
                    this.numberButtons[i].active = pageIndex == this.pageIndex;
                }
                else {
                    this.numberButtons[i].visible = false;
                }
            }
            this.totalElement.text = this.totalRowCount;
            this.totalElement.visible = true;
            this.firstPageButton.visible = false;
            this.previousPageButton.visible = false;
            this.lastPageButton.visible = false;
            this.nextPageButton.visible = false;
            if (pagingBarIndex > 0) {
                this.firstPageButton.visible = true;
                this.previousPageButton.visible = true;
            }
            if (pagingBarIndex < pagingBarCount - 1) {
                this.lastPageButton.visible = true;
                this.nextPageButton.visible = true;
            }
        };
        return NumberPagingBar;
    }(PagingBar));
    wuzhui.NumberPagingBar = NumberPagingBar;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    wuzhui.ajaxTimeout = 5000;
    function ajax(url, data) {
        var result = $.Deferred();
        $.ajax({
            url: url,
            data: data,
            method: 'post',
            traditional: true
        }).done(function (data, textStatus, jqXHR) {
            if (data.Type == 'ErrorObject' && data.Code != 'Success') {
                result.reject(data, textStatus, jqXHR);
            }
            else {
                result.resolve(data, textStatus, jqXHR);
            }
        }).fail(function (jqXHR, textStatus) {
            var err = { Code: textStatus, status: jqXHR.status, Message: jqXHR.statusText };
            result.reject(err);
        }).always(function () {
            clearTimeout(timeoutid);
        });
        var timeoutid = setTimeout(function () {
            if (result.state() == 'pending') {
                result.reject({ Code: 'Timeout', Message: 'Ajax call timemout.' });
            }
        }, wuzhui.ajaxTimeout);
        return result;
    }
    wuzhui.ajax = ajax;
    function applyStyle(element, value) {
        var style = value || '';
        if (typeof style == 'string')
            $(element).attr('style', style);
        else {
            for (var key in style) {
                element.style[key] = style[key];
            }
        }
    }
    wuzhui.applyStyle = applyStyle;
    function callbacks() {
        return $.Callbacks();
    }
    wuzhui.callbacks = callbacks;
    function fireCallback(callback, sender, args) {
        return callback.fireWith(this, [sender, args]);
    }
    wuzhui.fireCallback = fireCallback;
    (function () {
        var prefix = '/Date(';
        function parseStringToDate(value) {
            var star = prefix.length;
            var len = value.length - prefix.length - ')/'.length;
            var str = value.substr(star, len);
            var num = parseInt(str);
            var date = new Date(num);
            return date;
        }
        $.ajaxSettings.converters['text json'] = function (json) {
            var result = $.parseJSON(json);
            if (typeof result === 'string') {
                if (result.substr(0, prefix.length) == prefix)
                    result = parseStringToDate(result);
                return result;
            }
            var stack = new Array();
            stack.push(result);
            while (stack.length > 0) {
                var item = stack.pop();
                for (var key in item) {
                    var value = item[key];
                    if (value == null)
                        continue;
                    if ($.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            stack.push(value[i]);
                        }
                        continue;
                    }
                    if ($.isPlainObject(value)) {
                        stack.push(value);
                        continue;
                    }
                    if (typeof value == 'string' && value.substr(0, prefix.length) == prefix) {
                        item[key] = parseStringToDate(value);
                    }
                }
            }
            return result;
        };
    })();
})(wuzhui || (wuzhui = {}));
