let node_modules = 'node_modules'
let lib = 'assert/lib'


requirejs.config({
    baseUrl: './',
    paths: {
        css: `${lib}/css`,
        less: `${lib}/require-less-0.1.5/less`,
        lessc: `${lib}/require-less-0.1.5/lessc`,
        normalize: `${lib}/require-less-0.1.5/normalize`,
        text: `${lib}/text`,

        jquery: `${lib}/jquery-2.1.3`,
        "jquery.event.drag": `${lib}/jquery.event.drag-2.2/jquery.event.drag-2.2`,
        "jquery.event.drag.live": `${lib}/jquery.event.drag-2.2/jquery.event.drag.live-2.2`,

        "js-md5": `${node_modules}/js-md5/src/md5`,

        pin: `${lib}/jquery.pin/jquery.pin.min`,

        "react": `${node_modules}/react/umd/react.development`,
        "react-dom": `${node_modules}/react-dom/umd/react-dom.development`,
        "maishu-chitu": `${node_modules}/maishu-chitu/dist/index`,
        "maishu-chitu-admin": `${node_modules}/maishu-chitu-admin/dist/chitu_admin`,
        "maishu-chitu-react": `${node_modules}/maishu-chitu-react/dist/index`,
        "maishu-chitu-service": `${node_modules}/maishu-chitu-service/dist/index`,
        "maishu-dilu": `${node_modules}/maishu-dilu/dist/index`,
        "maishu-services-sdk": `${node_modules}/maishu-services-sdk/dist/index`,
        "maishu-image-components": `${node_modules}/maishu-image-components/index`,
        "maishu-ui-toolkit": `${node_modules}/maishu-ui-toolkit/dist/index`,
        "maishu-node-auth": `${node_modules}/maishu-node-auth/dist/client/index`,
        "maishu-wuzhui": `${node_modules}/maishu-wuzhui/dist/index`,
        "maishu-wuzhui-helper": `${node_modules}/maishu-wuzhui-helper/dist/index`,
        "swiper": `${node_modules}/swiper/dist/js/swiper`,
        "xml2js": `${node_modules}/xml2js/lib/xml2js`,
        "polyfill": `${node_modules}/@babel/polyfill/dist/polyfill`,
        "url-pattern": `${node_modules}/url-pattern/lib/url-pattern`,
        "error-handle": `_error-handle`,
    }
})

requirejs(["assert/startup"], function (startupModule) {

    console.assert(startupModule != null && typeof startupModule["default"] == "function");
    startupModule["default"]();

})