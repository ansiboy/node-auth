import http = require("http");
import url = require("url");
import { ActionResult, ContentResult } from 'maishu-node-mvc';
import { createDataContext } from "../dataContext";
import { Path } from "../entities";
import { errorStatusCodes, errorNames } from "../errors";


let resourcePaths: Path[];

/**
 * 检查路径是否允许访问
 */
export async function checkPath(req: http.IncomingMessage, res: http.ServerResponse): Promise<ActionResult> {
    if (!resourcePaths) {
        let dc = await createDataContext();
        resourcePaths = await dc.paths.find();
    }

    let u = url.parse(req.url);
    let r = resourcePaths.filter(o => o.value ==  u.pathname);
    if (r.length > 0) {
        return null
    }

    let error = new Error(`Has none permission to visit path '${u.pathname}'`);
    error.name = errorNames.noPermission;
    let result = new ContentResult("{}", "application/json; charset=utf-8", errorStatusCodes.noPermission);
    console.warn(error);

    return result;
}