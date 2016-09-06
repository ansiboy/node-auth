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

//class  eventNames {
const CONTROLLER_CREATED = 'controllerCreated'
//}

export class Application {
    private server: http.Server;
    private port: number;
    private hostname: string;
    private controllersPath: string;
    private event: EventEmitter;



    constructor(args: { port: number, hostname: string, controllersPath: string }) {
        this.port = args.port;
        this.hostname = args.hostname;
        this.controllersPath = args.controllersPath;
        this.server = http.createServer((req, res) => this.requestListen(req, res));
        this.event = new EventEmitter();
    }

    on_controllerCreated(callback: Function) {
        this.event.on(CONTROLLER_CREATED, callback);
    }


    private requestListen(request: http.IncomingMessage, response: http.ServerResponse) {
        let output: Promise<string> | string = '';
        let actionResult: Promise<any>;
        try {
            let u = url.parse(request.url, true);

            let path: string;// = u.pathname;
            let arr = u.pathname.split('/').filter(o => o != '');

            let controllersPath = this.controllersPath; //'./controllers/';
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

            //let appid = '4C22F420-475F-4085-AA2F-BE5269DE6043';
            let controller = new Controller();//this.createController(Controller);
            this.event.emit(CONTROLLER_CREATED, controller);
            //let action = controller[actionName];
            if (controller[actionName] == null)
                throw Errors.actionNotExists(actionName);

            controller.request = request;
            controller.response = response;
            let query = u.query;

            //如果含有 JSON ，则转化为对象
            for (let key in query) {
                let value = (<string>query[key]).trim();
                if (value[0] == '{' && value[value.length - 1] == '}') {
                    query[key] = JSON.parse(value);
                }
            }

            actionResult = controller[actionName](query || {});
            if (actionResult == null || actionResult.then == null || actionResult.catch == null) {
                actionResult = Promise.resolve(actionResult);
            }
        }
        catch (exc) {
            actionResult = Promise.resolve(exc);
        }

        actionResult
            .then((o) => this.outputToResponse(o, response))
            .catch((o) => this.outputToResponse(o, response));
    }

    private outputToResponse(obj: any, response: http.ServerResponse) {
        if (obj == null)
            obj = {};

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json;charset=utf-8');

        let objectType = typeof obj;
        // if (objectType == 'string' || objectType == 'number') {
        //     response.write(obj);
        // }
        // else
        if (objectType == 'object') {
            obj = this.toJSONObject(obj);
        }
        response.write(JSON.stringify(obj));
        response.end();

    }

    private toJSONObject(obj: any): any {
        let type = typeof obj;
        if (type == 'object' && obj instanceof Array) {
            type = 'array';
        }

        if (type == 'array') {
            let arr = obj;
            for (let i = 0; i < arr.length; i++) {
                arr[i] = this.toJSONObject(arr[i]);
            }
            return arr;
        }
        else if (type == 'number' || type == 'string') {
            return obj;
        }

        console.assert(type != 'function');

        let result = {};
        for (let key in obj) {
            result[key] = obj[key];
        }
        let propertyNames = Object.getOwnPropertyNames(obj);
        for (let name of propertyNames) {
            result[name] = obj[name];
        }

        return result;
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