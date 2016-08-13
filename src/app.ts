import * as http from 'http';
import * as https from 'https';
import * as settings from './settings';

function request(req: http.IncomingMessage, res: http.ServerResponse, data?: string) {
  let host = settings.serviceHost;

  let headers: any = req.headers;
  headers.host = host;

  if (data) {
    headers['Content-Length'] = data.length;
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  let request = http.request(
    {
      host: host,
      path: req.url,
      method: req.method,
      headers: headers,
    },
    (response) => {
      for (var key in response.headers) {
        res.setHeader(key, response.headers[key]);
      }
      response.pipe(res);
    }
  );

  if (data)
    request.write(data);

  request.end();
}

http.createServer(function (req, res) {

  let appToken = req.headers['appToken'];


  if (req.method == 'POST') {
    req.on('data', (data) => {
      request(req, res, data);
    });
  }
  else {
    let data: string;
    let queryStringIndex = req.url.indexOf('?');
    if (queryStringIndex >= 0) {
      data = req.url.substr(queryStringIndex + 1);
    }
    request(req, res, data);
  }

}).listen(9000);