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
        define(["require", "exports", "maishu-services-sdk", "../common", "react-dom", "react", "maishu-wuzhui-helper", "maishu-ui-toolkit", "maishu-wuzhui", "dataSources"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_services_sdk_1 = require("maishu-services-sdk");
    const common_1 = require("../common");
    const ReactDOM = require("react-dom");
    const React = require("react");
    const maishu_wuzhui_helper_1 = require("maishu-wuzhui-helper");
    const ui = require("maishu-ui-toolkit");
    const maishu_wuzhui_1 = require("maishu-wuzhui");
    const dataSources_1 = require("dataSources");
    function operationField(props, objectType, width, callback) {
        width = width || '120px';
        let dataSource = dataSources_1.dataSources[objectType];
        let resourceId = props.data.resourceId;
        let app = props.app;
        let permissionService = app.currentPage.createService(maishu_services_sdk_1.PermissionService);
        return maishu_wuzhui_helper_1.customField({
            headerText: '操作',
            itemStyle: { textAlign: 'center', width },
            headerStyle: { width },
            createItemCell(dataItem) {
                let cell = new maishu_wuzhui_1.GridViewCell();
                renderCell(dataItem, cell);
                return cell;
            },
        });
        function renderCell(dataItem, cell) {
            return __awaiter(this, void 0, void 0, function* () {
                let menuItem = yield permissionService.getMenuItem(resourceId);
                let resources = menuItem.children.filter(o => o.type == 'button');
                for (let i = 0; i < resources.length; i++) {
                    let button = document.createElement('button');
                    let iconClassName;
                    switch (resources[i].name) {
                        case common_1.constants.buttonTexts.add:
                            continue;
                        case common_1.constants.buttonTexts.view:
                            button.className = 'btn btn-minier btn-success';
                            button.title = '点击查看';
                            iconClassName = 'icon-eye-open';
                            button.onclick = function () {
                                app.forward(`${objectType}/item?objectType=${objectType}&mode=view&id=${dataItem.id}&resource_id=${resources[i].id}`);
                            };
                            ReactDOM.render(React.createElement("i", { className: iconClassName }, " "), button);
                            break;
                        case common_1.constants.buttonTexts.edit:
                            button.className = 'btn btn-minier btn-info';
                            button.title = '点击编辑';
                            iconClassName = 'icon-pencil';
                            button.onclick = function () {
                                app.forward(`${objectType}/item?objectType=${objectType}&mode=edit&id=${dataItem.id}&resource_id=${resources[i].id}`);
                            };
                            ReactDOM.render(React.createElement("i", { className: iconClassName }, " "), button);
                            break;
                        case common_1.constants.buttonTexts.delete:
                            button.className = 'btn btn-minier btn-danger';
                            button.title = '点击删除';
                            button.onclick = ui.buttonOnClick(button, () => {
                                return dataSource.delete(dataItem);
                            }, {
                                confirm() {
                                    let name = dataItem['name'] || dataItem['mobile'];
                                    let msg = name ? `确定删除'${name}' 吗` : `确定删除吗`;
                                    return msg;
                                }
                            });
                            iconClassName = 'icon-trash';
                            ReactDOM.render(React.createElement("i", { className: iconClassName }, " "), button);
                            break;
                        default:
                            button.className = 'btn btn-minier btn-default';
                            button.innerHTML = resources[i].name;
                            button.onclick = function () {
                                if (callback) {
                                    callback(dataItem, resources[i]);
                                    return;
                                }
                                app.forward(`${resources[i].path}?objectType=${objectType}&mode=edit&id=${dataItem.id}&resource_id=${resources[i].id}`);
                            };
                            break;
                    }
                    cell.element.appendChild(button);
                }
            });
        }
    }
    exports.operationField = operationField;
});
