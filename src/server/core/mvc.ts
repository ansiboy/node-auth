import * as http from 'http';
import * as url from 'url';

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

export class Application {
    private server: http.Server;
    private port: number;
    private hostname: string;
    private controllersPath: string;

    constructor(args: { port: number, hostname: string, controllersPath: string }) {
        this.port = args.port;
        this.hostname = args.hostname;
        this.controllersPath = args.controllersPath;
        this.server = http.createServer((req, res) => this.requestListen(req, res));
    }

    private requestListen(request: http.IncomingMessage, response: http.ServerResponse) {
        let output: Promise<string> | string = '';
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
            let controller = this.createController(Controller);
            //let action = controller[actionName];
            if (controller[actionName] == null)
                throw Errors.actionNotExists(actionName);

            controller.request = request;
            controller.response = response;
            let query = u.query;
            let actionResult = controller[actionName](query || {});
            if (actionResult == null) {
                //do nothing
            } else if (typeof actionResult == 'string') {
                output = actionResult;
            }
            else if ((<Promise<any>>actionResult).then && (<Promise<any>>actionResult).catch) {
                output = (<Promise<any>>actionResult);
            }
            else if (typeof actionResult == 'object') {
                output = this.toJSON(actionResult);
            }

        }
        catch (exc) {
            let error: Error = exc;
            output = this.toJSON({
                name: error.name,
                stack: error.stack,
                message: error.message
            });
            console.log(exc);
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json;charset=utf-8');
        if (typeof output == 'string') {
            response.write(output);
            response.end();
        }
        else if ((<Promise<any>>output).catch && (<Promise<any>>output).then) {
            (<Promise<any>>output)
                .then((result) => {
                    response.write(this.toJSON(result));
                    response.end();
                })
                .catch((result) => {
                    response.write(this.toJSON(result));
                    response.end();
                });
        }
        else if (typeof output == 'object') {
            response.write(this.toJSON(output));
            response.end();
        }
    }

    protected createController(Controller: ControllerConstructor) {
        return new Controller();
    }

    private toJSON(obj: any): string {
        
        let result = {};
        for (let key in obj) {
            result[key] = obj[key];
        }
    
        return JSON.stringify(result);
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