
//==============================================================
// 说明：启动反向代理服务器
import * as settings from './settings';
import { ProxyServer } from './proxyServer';
import { BaseControllerConstructor } from './controllers/baseController';
let proxyServer = new ProxyServer({ port: 9000, targetHost: settings.serviceHost });
proxyServer.start();
//==============================================================

import * as http from 'http';
import * as querystring from 'querystring';
import * as url from 'url';
import * as mvc from './core/mvc';

class Errors {
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

let server = http.createServer((request, response) => {

  let output: Promise<string> | string = '';
  try {
    let u = url.parse(request.url, true);

    let path: string;// = u.pathname;
    let arr = u.pathname.split('/').filter(o => o != '');

    const CONTROLLERS_PATH = './controllers/';
    const DEFAULT_CONTROLLER = 'home';
    const DEFAULT_ACTION = 'index';
    let controllerName: string;
    let actionName: string;
    if (arr.length == 0) {
      controllerName = DEFAULT_CONTROLLER + 'Controller';
      actionName = DEFAULT_ACTION;
      path = CONTROLLERS_PATH + DEFAULT_CONTROLLER;
    }
    else if (arr.length == 1) {
      controllerName = arr[0] + 'Controller';
      actionName = DEFAULT_ACTION;
      path = CONTROLLERS_PATH + arr[0];
    }
    else if (arr.length == 2) {
      controllerName = arr[0] + 'Controller';
      actionName = arr[1];
      path = CONTROLLERS_PATH + arr[0];
    }
    else {
      controllerName = arr[arr.length - 2] + 'Controller';
      actionName = arr[arr.length - 1];
      path = CONTROLLERS_PATH + arr.filter((value, index, arr) => index < arr.length - 1).join('/');
    }

    let Controller = findController(require(path), controllerName);
    if (Controller == null) {
      throw Errors.controllerNotExists(controllerName);
    }

    let appid = '4C22F420-475F-4085-AA2F-BE5269DE6043';
    let controller = new Controller(appid);
    //let action = controller[actionName];
    if (controller[actionName] == null)
      throw Errors.actionNotExists(actionName);

    controller.request = request;
    controller.response = response;
    let query = u.query;
    let actionResult = controller[actionName](query || {});
    if (typeof actionResult == 'string') {
      output = actionResult;
    }
    else if ((<Promise<any>>actionResult).then && (<Promise<any>>actionResult).catch) {
      output = (<Promise<any>>actionResult);
    }
    else if (typeof actionResult == 'object') {
      output = toJSON(actionResult);
    }

  }
  catch (exc) {
    let err = <Error>exc;
    let obj = {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
    output = JSON.stringify(obj);
    console.log(exc);
  }

  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  if (typeof output == 'string') {
    response.write(output);
    response.end();
  }
  else {
    (<Promise<any>>output)
      .then((result) => {
        response.write(toJSON(result));
        response.end();
      })
      .catch((result) => {
        response.write(toJSON(result));
        response.end();
      });
  }
});

function findController(module: any, name): BaseControllerConstructor {
  for (var key in module) {
    if (key.toLowerCase() == name.toLowerCase())
      return module[key];
  }
  return null;
}

function toJSON(obj: any): string {
  let result = {};
  for (let key in obj) {
    result[key] = obj[key];
  }
  return JSON.stringify(result);
}


const hostname = 'localhost';
const port = 3000;
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});