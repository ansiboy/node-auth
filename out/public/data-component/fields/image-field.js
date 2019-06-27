(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "maishu-wuzhui-helper", "maishu-wuzhui", "data-component/common", "react-dom", "react", "maishu-ui-toolkit"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const maishu_wuzhui_helper_1 = require("maishu-wuzhui-helper");
    const maishu_wuzhui_1 = require("maishu-wuzhui");
    const common_1 = require("data-component/common");
    const ReactDOM = require("react-dom");
    const React = require("react");
    const maishu_ui_toolkit_1 = require("maishu-ui-toolkit");
    function imageField(args) {
        return maishu_wuzhui_helper_1.customField({
            headerText: args.headerText,
            headerStyle: args.headerStyle,
            createItemCell() {
                let cell = new maishu_wuzhui_1.GridViewDataCell({
                    render(dataItem, element) {
                        let s = common_1.services.imageService;
                        let value = dataItem[args.dataField];
                        if (value == null) {
                            ReactDOM.render(React.createElement("img", { style: { height: 40 }, src: maishu_ui_toolkit_1.generateImageBase64(100, 40, common_1.constants.noImage) }), element);
                            return;
                        }
                        let imageids = value.split(',');
                        if (imageids.length > 0 && args.displayMax > 0) {
                            imageids = imageids.slice(0, args.displayMax);
                        }
                        ReactDOM.render(React.createElement(React.Fragment, null, imageids.map(id => React.createElement("img", { key: id, style: { height: 40 }, src: s.imageSource(id, null, 100), ref: e => {
                                if (!e)
                                    return;
                                maishu_ui_toolkit_1.renderImage(e, { imageSize: { height: 40, width: 40 }, imageText: common_1.constants.noImage });
                                exports.enableViewImage(e);
                            } }))), element);
                        if (args.afterRenderCell) {
                            args.afterRenderCell(cell, dataItem);
                        }
                    }
                });
                return cell;
            }
        });
    }
    exports.imageField = imageField;
    exports.enableViewImage = (function () {
        const closeButtonClassName = 'close';
        let imageDialogElement = document.createElement('div');
        imageDialogElement.className = 'modal fade';
        document.body.appendChild(imageDialogElement);
        ReactDOM.render(React.createElement("div", { className: "modal-dialog" },
            React.createElement("div", { className: "modal-content" },
                React.createElement("div", { className: "modal-header" },
                    React.createElement("button", { type: "button", className: closeButtonClassName, "data-dismiss": "modal", "aria-label": "Close" },
                        React.createElement("span", { "aria-hidden": "true" }, "\u00D7")),
                    React.createElement("h4", { className: "modal-title" }, "\u56FE\u7247\u9884\u89C8")),
                React.createElement("div", { className: "modal-body" },
                    React.createElement("img", { className: "img-responsive" })))), imageDialogElement);
        function viewImage(imageSource) {
            let sharpIndex = imageSource.indexOf('?');
            if (sharpIndex >= 0) {
                var search = imageSource.substring(sharpIndex + 1);
                let obj = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
                let imageId = obj.id;
                if (imageId) {
                    let s = common_1.services.imageService;
                    imageSource = s.imageSource(imageId);
                }
            }
            let imageElement = imageDialogElement.querySelector('img');
            imageElement.src = imageSource;
            imageElement['rendered'] = false;
            maishu_ui_toolkit_1.renderImage(imageElement, { imageSize: { width: 800, height: 400 }, imageText: '图片正在加载中' });
            maishu_ui_toolkit_1.showDialog(imageDialogElement, (button) => {
                if (button != null && button.className == closeButtonClassName) {
                    imageElement.src = '';
                }
            });
        }
        return function (imageElement) {
            const attr = 'enable-view-image';
            if (imageElement.getAttribute(attr) != null)
                return;
            imageElement.setAttribute(attr, '');
            imageElement.title = '点击查看图片';
            imageElement.addEventListener('click', () => viewImage(imageElement.src));
        };
    }());
});
