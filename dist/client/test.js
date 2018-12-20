// For Test
let node_modules = "../../node_modules";
requirejs.config({
    shim: {
        "maishu-chitu-admin": {
            deps: ['react', 'react-dom', 'maishu-chitu', 'maishu-chitu-react', 'maishu-ui-toolkit']
        },
        "index": {
            deps: ['maishu-chitu-admin', 'maishu-ui-toolkit', 'maishu-dilu', 'services/user']
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
});

define('modules/index', ['react'], function (React) {
    class IndexPage extends React.Component {
        render() {
            return null
        }
    }
    return {
        default: IndexPage
    }
})

requirejs(['react', 'react-dom', 'maishu-chitu-react', "maishu-chitu-admin",'../../out/client/modules'], function () {
    requirejs(['../../out/client/bundle'], function (mod) {
        debugger
        mod.app.run()
    });
})
