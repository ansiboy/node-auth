
//==============================================================
// 说明：启动反向代理服务器
import * as settings from './settings';
import { ProxyServer } from './proxyServer';
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

  let output: string = '';
  try {
    // let query = querystring.parse(request.url);
    // console.log(query);
    let u = url.parse(request.url);

    let path = u.path;
    let arr = u.path.split('/').filter(o => o != '');

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

    let Controller = require(path)[controllerName];
    if (Controller == null) {
      throw Errors.controllerNotExists(controllerName);
    }
    let controller = new (<mvc.ControllerConstructor>Controller)();
    let action = controller[actionName];
    if (action == null)
      throw Errors.actionNotExists(actionName);

    controller.request = request;
    controller.response = response;
    let query = u.query;
    let actionResult = action(query);
    if (typeof actionResult == 'string') {
      output = actionResult;
    }
    else if (typeof actionResult == 'object') {
      output = JSON.stringify(actionResult);
    }

    //TODO:处理 controller 不存在

    //TODO:检查文件是否存
    // let action_path = './modules' + path;
    // let action = require(action_path)['execute'];
    // if (typeof action == 'function') {
    //   let actionResult = action(query);
    //   if (typeof actionResult == 'string') {
    //     output = actionResult;
    //   }
    //   else if (typeof actionResult == 'object') {
    //     output = JSON.stringify(actionResult);
    //   }
    // }
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
  response.write(output);
  response.end();
});



const hostname = 'localhost';
const port = 3000;
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});