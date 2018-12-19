let node_modules = "../../node_modules"
requirejs.config({
    shim: {
        "maishu-chitu-admin": {
            deps: ['react', 'react-dom', 'maishu-chitu', 'maishu-chitu-react', 'maishu-ui-toolkit']
        },
        "application": {
            deps: ['maishu-chitu-admin', 'maishu-ui-toolkit', 'services/user']
        },
        "services/user": {
            deps: ['../config']
        }
    },
    paths: {
        "react": `${node_modules}/react/umd/react.development`,
        "react-dom": `${node_modules}/react-dom/umd/react-dom.development`,
        "maishu-chitu": `${node_modules}/maishu-chitu/dist/chitu`,
        "maishu-chitu-admin": `${node_modules}/maishu-chitu-admin/dist/chitu_admin`,
        "maishu-chitu-react": `${node_modules}/maishu-chitu-react/out/index`,
        "maishu-dilu": `${node_modules}/maishu-dilu/dist/dilu`,
        "maishu-ui-toolkit": `${node_modules}/maishu-ui-toolkit/dist/index`
    }
})

requirejs(['application'], function (chitu_admin) {
    // define('modules/index', function () {
    //     return modules_admin
    // })
})