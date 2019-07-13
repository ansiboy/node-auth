"use strict";

var node_modules = '../../node_modules';
var lib = '../../lib';
requirejs.config({
  // baseUrl: 'out/public',
  paths: {
    css: "".concat(lib, "/css"),
    less: "".concat(lib, "/require-less-0.1.5/less"),
    lessc: "".concat(lib, "/require-less-0.1.5/lessc"),
    text: "".concat(lib, "/text"),
    jquery: "".concat(lib, "/jquery-2.1.3"),
    "jquery.event.drag": "".concat(lib, "/jquery.event.drag-2.2/jquery.event.drag-2.2"),
    "jquery.event.drag.live": "".concat(lib, "/jquery.event.drag-2.2/jquery.event.drag.live-2.2"),
    pin: "".concat(lib, "/jquery.pin/jquery.pin.min"),
    "react": "".concat(node_modules, "/react/umd/react.development"),
    "react-dom": "".concat(node_modules, "/react-dom/umd/react-dom.development"),
    "maishu-chitu": "".concat(node_modules, "/maishu-chitu/dist/index"),
    "maishu-chitu-admin": "".concat(node_modules, "/maishu-chitu-admin/dist/chitu_admin"),
    "maishu-chitu-react": "".concat(node_modules, "/maishu-chitu-react/dist/index"),
    "maishu-chitu-service": "".concat(node_modules, "/maishu-chitu-service/dist/index"),
    "maishu-dilu": "".concat(node_modules, "/maishu-dilu/dist/index"),
    "maishu-services-sdk": "".concat(node_modules, "/maishu-services-sdk/dist/index"),
    "maishu-image-components": "".concat(node_modules, "/maishu-image-components/index"),
    "maishu-ui-toolkit": "".concat(node_modules, "/maishu-ui-toolkit/dist/index"),
    "maishu-node-auth": "".concat(node_modules, "/maishu-node-auth/dist/client/index"),
    "maishu-wuzhui": "".concat(node_modules, "/maishu-wuzhui/dist/index"),
    "maishu-wuzhui-helper": "".concat(node_modules, "/maishu-wuzhui-helper/dist/index"),
    "swiper": "".concat(node_modules, "/swiper/dist/js/swiper"),
    "xml2js": "".concat(node_modules, "/xml2js/lib/xml2js"),
    "polyfill": "".concat(node_modules, "/@babel/polyfill/dist/polyfill"),
    "content": "../../content"
  }
});
requirejs(['./application', "clientjs/init"], function (appModule, initModule) {
  if (initModule && typeof initModule.default == 'function') {
    initModule.default(appModule.app);
  }

  console.assert(appModule != null && appModule.app != null);
  appModule.app.run();
});
