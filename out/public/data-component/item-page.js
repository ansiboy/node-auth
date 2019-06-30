var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "maishu-ui-toolkit", "dataSources", "maishu-dilu"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("react");
    const ui = require("maishu-ui-toolkit");
    const dataSources_1 = require("dataSources");
    const maishu_dilu_1 = require("maishu-dilu");
    exports.ItemPageContext = React.createContext({
        dataItem: {}, updatePageState: (dataItem) => null,
        beforeSave: (callback) => null,
    });
    class ItemPage extends React.Component {
        constructor(props) {
            super(props);
            this.state = { dataItem: {}, originalDataItem: {} };
            if (this.props.afterGetItem) {
                this.props.afterGetItem(this.state.dataItem);
            }
            console.assert(this.props.data.objectType != null);
            this.dataSource = dataSources_1.dataSources[this.props.data.objectType];
            if (this.props.data.id || this.props.data.sourceId) {
                // let itemId = this.props.data.id || this.props.data.sourceId
                // this.dataSource.getItem(itemId).then(item => {
                //     console.assert(item != null)
                //     let originalDataItem = JSON.parse(JSON.stringify(item))
                //     this.setState({ dataItem: item, originalDataItem })
                //     if (this.props.afterGetItem) {
                //         this.props.afterGetItem(item)
                //     }
                // })
                this.loadDataItem(this.props.data.id || this.props.data.sourceId);
            }
            this.beforeSaves = [];
            if (this.props.beforeSave) {
                this.beforeSaves.push(this.props.beforeSave);
            }
        }
        loadDataItem(itemId) {
            this.dataSource = dataSources_1.dataSources[this.props.data.objectType];
            // let itemId = this.props.data.id || this.props.data.sourceId
            this.dataSource.getItem(itemId).then(item => {
                console.assert(item != null);
                let originalDataItem = JSON.parse(JSON.stringify(item));
                this.setState({ dataItem: item, originalDataItem });
                if (this.props.afterGetItem) {
                    this.props.afterGetItem(item);
                }
            });
        }
        save() {
            return __awaiter(this, void 0, void 0, function* () {
                this.validator.clearErrors();
                if (!this.validator.check()) {
                    return Promise.reject('validate fail');
                }
                let { dataItem, originalDataItem } = this.state;
                if (this.beforeSaves.length > 0) {
                    yield Promise.all(this.beforeSaves.map(m => m(dataItem)));
                }
                let changedData = {};
                let names = Object.getOwnPropertyNames(dataItem);
                for (let i = 0; i < names.length; i++) {
                    if (dataItem[names[i]] == originalDataItem[names[i]])
                        continue;
                    changedData[names[i]] = dataItem[names[i]];
                }
                if (Object.getOwnPropertyNames(changedData).length == 0) {
                    console.log('Data item is not changed.');
                    return;
                }
                if (dataItem.id) {
                    if (!this.props.data.sourceId) {
                        changedData.id = dataItem.id;
                        let r = yield this.dataSource.update(changedData);
                        Object.assign(dataItem, r || {});
                    }
                    else {
                        let obj = Object.assign({}, dataItem, changedData);
                        delete obj.id;
                        let r = yield this.dataSource.insert(obj);
                        Object.assign(dataItem, r || {});
                    }
                }
                else {
                    let r = yield this.dataSource.insert(changedData);
                    Object.assign(dataItem, r || {});
                }
                originalDataItem = JSON.parse(JSON.stringify(dataItem));
                this.setState({ originalDataItem, dataItem });
            });
        }
        componentWillReceiveProps(props) {
            let { dataItem } = this.state;
            let dataItemId = props.data.id || props.data.sourceId;
            if (dataItemId != dataItem.id) {
                this.setState({ dataItem: {}, originalDataItem: {} });
                if (props.data.id || props.data.sourceId) {
                    this.loadDataItem(props.data.id || props.data.sourceId);
                }
            }
        }
        componentDidMount() {
            let children = this.props.children == null ? [] :
                Array.isArray(this.props.children) ? this.props.children : [this.props.children];
            var validateFields = children.filter(o => o != null)
                .map((o) => {
                let props = o.props;
                if (props == null || props.validateRules == null)
                    return null;
                let f = { name: props.name || props.dataField, rules: props.validateRules || [] };
                return f;
            })
                .filter(o => o != null);
            this.validator = new maishu_dilu_1.FormValidator(this.fieldsConatiner, ...validateFields);
        }
        render() {
            let { dataItem } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "tabbable" },
                    React.createElement("ul", { className: "nav nav-tabs" },
                        React.createElement("li", { className: "pull-right" },
                            this.props.data.mode == 'view' ? null :
                                React.createElement("button", { className: "btn btn-primary", ref: e => {
                                        if (!e)
                                            return;
                                        ui.buttonOnClick(e, () => this.save(), { toast: '保存成功' });
                                    } },
                                    React.createElement("i", { className: "icon-save" }),
                                    React.createElement("span", null, "\u4FDD\u5B58")),
                            React.createElement("button", { className: "btn btn-primary", onClick: () => this.props.app.back() },
                                React.createElement("i", { className: "icon-reply" }),
                                React.createElement("span", null, "\u8FD4\u56DE"))))),
                React.createElement("div", { className: "well", ref: e => this.fieldsConatiner = e || this.fieldsConatiner },
                    React.createElement(exports.ItemPageContext.Provider, { value: {
                            dataItem,
                            updatePageState: (dataItem) => {
                                this.setState({ dataItem });
                            },
                            beforeSave: (callback) => {
                                this.beforeSaves.push(callback);
                            }
                        } }, this.props.children)));
        }
    }
    exports.ItemPage = ItemPage;
});
