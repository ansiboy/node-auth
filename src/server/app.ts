
//==============================================================
// 说明：启动反向代理服务器
import * as settings from './settings';
import { ProxyServer } from './proxyServer';
import { BaseController } from './controllers/baseController';
let proxyServer = new ProxyServer({ port: 9000, targetHost: settings.serviceHost });
proxyServer.start();
//==============================================================

import * as http from 'http';
import * as querystring from 'querystring';
import * as url from 'url';
import * as mvc from './core/mvc';

const hostname = 'localhost';
const port = 3000;
const controllersPath = '../controllers';
let app = new mvc.Application({ port, hostname, controllersPath });
app.on_controllerCreated((controller: BaseController) => {
  controller.applicationId = '4C22F420-475F-4085-AA2F-BE5269DE6043';
})
app.start();
