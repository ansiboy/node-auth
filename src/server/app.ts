import * as http from 'http';
import * as https from 'https';
import * as settings from './settings';
import { ProxyServer } from './proxyServer';
import * as express from 'express';

let proxyServer = new ProxyServer({ port: 9000, targetHost: settings.serviceHost });
proxyServer.start();

let app = express();
app.use((req, res) => {
  let arr = req.path.split('/').filter((value, index, array) => {
    return value != '';
  });

  let output: string;
  if (arr.length >= 2) {
    let controllerName = arr[0];
    let Controller = require('./modules/' + controllerName);
    if (Controller != null) {
      let controller = new Controller();
      let action = <Function>controller[arr[1]];
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

  if (output == null) {
    output = 'empty';
  }

  res.send(output);

});

function processError(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
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