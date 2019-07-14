var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "react", "react-dom", "./masterPage", "maishu-chitu-react", "json5"], function (require, exports, React, ReactDOM, masterPage_1, chitu_react, json5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let element = document.createElement('div');
    document.body.insertBefore(element, document.body.children[0]);
    let masterPage = ReactDOM.render(React.createElement(masterPage_1.MasterPage, null), element);
    class Application extends chitu_react.Application {
        constructor() {
            super({ container: masterPage.pageContainer });
            this.loadConfig();
            this.loadStyle();
        }
        loadConfig() {
            if (this.config)
                return Promise.resolve(this.config);
            return new Promise((resolve, reject) => {
                requirejs(['text!config.json5'], (str) => {
                    this.config = json5.parse(str);
                    resolve(this.config);
                }, (err) => {
                    reject(err);
                });
            });
        }
        /** 加载样式文件 */
        loadStyle() {
            requirejs(['text!../content/admin_style_default.less', 'less'], (str, less) => __awaiter(this, void 0, void 0, function* () {
                let config = yield this.loadConfig();
                if (config.firstPanelWidth)
                    str = str + `\r\n@firstPanelWidth: ${config.firstPanelWidth};`;
                less.render(str, function (e, result) {
                    if (e) {
                        console.error(e);
                        return;
                    }
                    let style = document.createElement('style');
                    document.head.appendChild(style);
                    style.innerText = result.css;
                });
            }));
        }
        createMasterPage() {
        }
        run() {
            super.run();
            masterPage.init(this);
        }
    }
    exports.Application = Application;
    let app = new Application();
    exports.default = app;
});
