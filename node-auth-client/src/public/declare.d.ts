declare module 'fs' {
    function readFileSync(path: string): any
}

// declare function require(path: string): any

// declare module "./content/admin_style_default.less"

declare let requirejs: any;

declare module "js-md5" {
    let md5: {
        (text: string): string;
    };
    export = md5;
}