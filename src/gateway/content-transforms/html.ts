import { ContentTransform, RequestContext, RequestResult } from "maishu-node-web-server";
import { JSDOM } from "jsdom";
import stream = require("stream");
import { getApplicationIdFromRequest } from "../common";
import { HeaderNames } from "../global";

export class HtmlContentTransform implements ContentTransform {
    async execute(result: RequestResult, context: RequestContext) {

        let contentType = result.headers == null ? "" : result.headers["content-type"] || result.headers["Content-Type"] || "";
        if (contentType.indexOf("html") < 0) {
            return result;
        }

        let html = await this.contentToString(result.content);
        let jsdom = new JSDOM(html);
        let document = jsdom.window.document;
        let scriptElement = document.createElement("script");
        let app_id = await getApplicationIdFromRequest(context.req);
        if (app_id) {
            scriptElement.innerHTML = `window["${HeaderNames.applicationId}"]="${app_id}";`;
        }
        else {
            scriptElement.innerHTML = `window["${HeaderNames.applicationId}"]=null;`;
        }

    }

    contentToString(content: RequestResult["content"]) {
        return new Promise<string>((resolve, reject) => {
            if (content instanceof stream.Readable) {
                let buffer = Buffer.from([]);
                content.on("data", (data) => {
                    buffer = Buffer.concat([buffer, data])
                })
                content.on("end", function () {
                    resolve(buffer.toString())
                })
                content.on("error", function (err) {
                    reject(err);
                })
            }
            else if (typeof content == "string") {
                resolve(content)
            }
            else {
                resolve(content.toString());
            }
        })
    }

}