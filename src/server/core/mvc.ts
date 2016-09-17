import * as http from 'http';
import * as url from 'url';
import { EventEmitter } from 'events';

class Errors {
    static notImplement(methodName: string) {
        let msg = `The method '${methodName}' is not implement.`
        let err = new Error(msg);
        err.name = 'notImplement';
        return err;
    }
    static argumentNull(argumentName: string) {
        let msg = `Argument '${argumentName}' cannt be null.`;
        let err = new Error(msg);
        err.name = 'argumentName';
        return err;
    }
    static controllerNotExists(controllerName: string) {
        let error = new Error(`Controller '${controllerName}' is not exists.`);
        error.name = 'controllerNotExists';
        return error;
    }
    static actionNotExists(actionName: string) {
        let error = new Error(`Action '${actionName}' is not exists.`);
        error.name = 'actionNotExists';
        return error;
    }
}

abstract class ControllerResultType {
    toString(): string {
        throw Errors.notImplement('toString');
    }
}

class JsonResultType extends ControllerResultType {
    private obj: any;
    constructor(obj: any) {
        if (obj == null)
            throw Errors.argumentNull('obj');

        super();
    }
    toString() {
        return JSON.stringify(this.obj);
    }
}

export interface ControllerConstructor {
    new (): Controller;
}

export class Controller {
    private _request: http.IncomingMessage;
    private _response: http.ServerResponse;

    protected json(obj: any) {
        return new JsonResultType(obj);
    }
    get request() {
        return this._request;
    }
    set request(value: http.IncomingMessage) {
        this._request = value;
    }
    get response() {
        return this._response;
    }
    set response(value: http.ServerResponse) {
        this._response = value;
    }
}

const CONTROLLER_CREATED = 'controllerCreated'
const OUTPUTING = 'outputing';

export class ObjectTraver {
    private obj;

    constructor(obj) {
        this.obj = obj;
    }

    execute(): any {
        return this.visit(this.obj);
    }

    protected visitArray(obj: Array<any>): any {
        let result = [];
        for (let i = 0; i < (obj as []).length; i++) {
            result[i] = this.visit(obj[i]);
        }
        return result;
    }

    protected visitValue(obj: number): any {
        return obj;
    }

    protected visitObject(obj: Object) {
        let keys = Object.keys(obj).concat(Object.getOwnPropertyNames(obj));
        let result = {};
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            result[key] = this.visitField(obj, key);
        }
        return result;
    }

    protected visitField(obj: any, fieldName: string) {
        return this.visit(obj[fieldName]);
    }

    // protected visitProperty(obj: any, propertyName: string) {
    //     return this.visit(obj[propertyName]);
    // }

    protected visitDate(obj: Date) {
        let d = obj;
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }

    protected visitFunction(obj: Function) {
        return '';
    }

    protected visit(obj): Object {
        if (obj == null)
            return null;

        let type = typeof obj;
        if (type == 'object') {
            if (obj instanceof Array)
                type = 'array';
            else if (obj instanceof Date)
                type = 'date';
        }

        if (type == 'array') {
            return this.visitArray(obj);
        }
        else if (type == 'number' || type == 'string') {
            return this.visitValue(obj);
        }
        else if (type == 'date') {
            return this.visitDate(obj);
        }
        else if (type == 'function') {
            return this.visitFunction(obj);
        }
        else if (type == 'object') {
            return this.visitObject(obj);
        }
        else {
            throw `Type '${type}' not implemented.`;
        }
    }
}


export type ApplicationArguments = { port: number, hostname: string, controllersPath: string };
export class Application {
    private server: http.Server;
    private port: number;
    private hostname: string;
    private controllersPath: string;
    private event: EventEmitter;

    constructor(args: ApplicationArguments) {
        this.port = args.port;
        this.hostname = args.hostname;
        this.controllersPath = args.controllersPath;
        this.server = http.createServer((req, res) => this.requestListen(req, res));
        this.event = new EventEmitter();
    }

    on_controllerCreated(callback: (controller: Controller) => void) {
        this.event.on(CONTROLLER_CREATED, callback);
    }

    on_outputing(callback: (obj: any) => void) {
        this.event.on(OUTPUTING, callback);
    }


    private async requestListen(request: http.IncomingMessage, response: http.ServerResponse) {
        let output: Promise<string> | string = '';
        let actionResult: Promise<any>;
        try {
            let u = url.parse(request.url, true);

            let path: string;
            let arr = u.pathname.split('/').filter(o => o != '');

            let controllersPath = this.controllersPath;
            if (!controllersPath.endsWith('/'))
                controllersPath = controllersPath + '/';

            const DEFAULT_CONTROLLER = 'home';
            const DEFAULT_ACTION = 'index';
            let controllerName: string;
            let actionName: string;
            if (arr.length == 0) {
                controllerName = DEFAULT_CONTROLLER + 'Controller';
                actionName = DEFAULT_ACTION;
                path = controllersPath + DEFAULT_CONTROLLER;
            }
            else if (arr.length == 1) {
                controllerName = arr[0] + 'Controller';
                actionName = DEFAULT_ACTION;
                path = controllersPath + arr[0];
            }
            else if (arr.length == 2) {
                controllerName = arr[0] + 'Controller';
                actionName = arr[1];
                path = controllersPath + arr[0];
            }
            else {
                controllerName = arr[arr.length - 2] + 'Controller';
                actionName = arr[arr.length - 1];
                path = controllersPath + arr.filter((value, index, arr) => index < arr.length - 1).join('/');
            }

            let Controller = this.findController(require(path), controllerName);
            if (Controller == null) {
                throw Errors.controllerNotExists(controllerName);
            }

            let controller = this.createController(Controller);
            if (controller[actionName] == null)
                throw Errors.actionNotExists(actionName);

            controller.request = request;
            controller.response = response;
            let query = u.query || {};


            let p: Promise<any> = Promise.resolve();
            if ((request.method || '').toUpperCase() == 'POST') {
                p = this.getFormData(request).then((data) => {
                    for (let key in data) {
                        query[key] = data[key];
                    }
                });
            }

            actionResult = new Promise((reslove, reject) => {
                p.then(() => {
                    //如果含有 JSON ，则转化为对象
                    for (let key in query) {
                        if (typeof query[key] != 'string')
                            continue;

                        let value = (<string>query[key]).trim();
                        if (value[0] == '{' && value[value.length - 1] == '}') {
                            query[key] = JSON.parse(value);
                        }
                    }

                    let r: Promise<any> = controller[actionName](query);
                    if (r == null || r.then == null || r.catch == null) {
                        reslove(r);
                    }
                    else {
                        r.then((data) => reslove(data)).catch((err) => reject(err));
                    }
                })
            });
        }
        catch (exc) {
            actionResult = Promise.resolve(exc);
        }

        actionResult
            .then((o) => {
                let obj = new ObjectTraver(o).execute();
                this.outputToResponse(o, response);
            })
            .catch((o) => this.outputToResponse(o, response));
    }

    protected createController(Controller): Controller {
        let controller = new Controller();
        this.event.emit(CONTROLLER_CREATED, controller);
        return controller;
    }

    private getFormData(request: http.IncomingMessage): Promise<any> {
        let method = (request.method || '').toLowerCase();
        if (method != 'post') {
            return Promise.resolve({});
        }

        let length = request.headers['content-length'] || 0;
        if (length <= 0)
            return Promise.resolve({});

        return new Promise((reslove, reject) => {
            let query: any = {};
            request.on('data', (data) => {
                try {
                    let obj = url.parse('?' + data.toString(), true).query;
                    for (let key in obj) {
                        query[key] = obj[key];
                    }
                    reslove(query);
                }
                catch (exc) {
                    reject(exc);
                }
            });
        });
    }

    protected outputToResponse(obj: any, response: http.ServerResponse) {
        console.assert(obj != null);

        this.event.emit(OUTPUTING, obj);

        response.statusCode = 200;
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Content-Type', 'application/json;charset=utf-8');

        //===================================================
        // 将 mysql error 转换为 Error
        if (obj.code != null) {
            let err = new Error(obj.message);
            err.name = obj.code;
            err.stack = obj.stack;

            obj = err;
        }
        //===================================================



        response.write(JSON.stringify(obj));
        response.end();
    }

    private findController(module: any, name): ControllerConstructor {
        for (var key in module) {
            if (key.toLowerCase() == name.toLowerCase())
                return module[key];
        }
        return null;
    }

    start() {
        this.server.listen(this.port, this.hostname, () => {

        });
    }
} 
