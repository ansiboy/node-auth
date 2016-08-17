import * as http from 'http';
import * as https from 'https';
//import * as settings from './settings';


export class ProxyServer {
    private server: http.Server;
    private port: number;
    private proxyHost: string;

    constructor(params: { port: number, targetHost: string }) {
        this.createServer();
        this.port = params.port;
        this.proxyHost = params.targetHost;
    }


    private request(req: http.IncomingMessage, res: http.ServerResponse, data?: string) {
        let host = this.proxyHost;

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

    private createServer() {
        this.server = http.createServer((req, res) => {

            let appToken = req.headers['appToken'];


            if (req.method == 'POST') {
                req.on('data', (data) => {
                    this.request(req, res, data);
                });
            }
            else {
                let data: string;
                let queryStringIndex = req.url.indexOf('?');
                if (queryStringIndex >= 0) {
                    data = req.url.substr(queryStringIndex + 1);
                }
                this.request(req, res, data);
            }

        });
        return this.server;
    }
    start() {
        this.server.listen(9000);
    }
}