
declare module 'fs' {
    function readFileSync(path: string): any
}

declare let requirejs: any;

declare module "js-md5" {
    let md5: {
        (text: string): string;
    };
    export = md5;
}

declare module "auth/settings" {
    let settings: { gateway: string };
    export = settings;
}