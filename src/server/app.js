'use strict'
var http = require('http');
var https = require('https');
var express = require('express');
var settings = require('./settings');
var p = require('./proxyServer');
let proxyServer = new p.ProxyServer({
    port: 9000,
    targetHost: settings.serviceHost,
});
proxyServer.start();

let app = express();
app.use((req, res) => {

    let arr = req.path.split('/').filter((value) = value != '');
    let output = '';
    if (arr.length >= 2) {
        let controllerName = arr[0];
        let Controller = require('./modules/' + controllerName);
        if (Controller != null) {
            let controller = new Controller();
            let action = controller[arr[1]];
            if (action != null) {
                let actionResult = action();
                if (typeof actionResult == 'string') {
                    output = actionResult;
                }
                else if (typeof actionResult == 'object') {
                    output = JSON.stringify(actionResult);
                }
            }
        }
    }

    res.send(output);
});

/**
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next 
 */
function processError(err, req, res, next) {
  console.log(err);
  let obj = {
    name: err.name,
    message: err.message,
    stack: err.stack
  }
  res.send(JSON.stringify(obj));
}
app.use(processError);

app.listen(8030);
