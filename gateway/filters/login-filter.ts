import { Settings, ActionResult, getLogger } from "maishu-node-mvc";
import { g, constants, tokenName } from "../global";
import { LoginResult } from "../types";
import { createDataContext } from "../data-context";
import { TokenData } from "../entities";
import { guid } from "maishu-chitu-service";
import { statusCodes } from "../status-codes";
import Cookies = require("cookies");

export let loginFilter: Settings["requestFilters"][0] = function (req, res): Promise<ActionResult> {
    let write = res.write;

    let logger = getLogger(`${constants.projectName}:${loginFilter.name}`, g.settings.logLevel);
    res.write = function (chunk: Uint8Array) {
        let args = [];
        for (let i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        if (res.statusCode != statusCodes.login) {
            return write.apply(this, args);
        }

        let responseResult = chunk.toString();
        try {
            let loginResult: LoginResult = JSON.parse(responseResult);
            if (!loginResult.userId) {
                logger.error(`Login result is incorrect, userId field is required.`);
                return;
            }

            let tokenData: TokenData = {
                id: guid(), userId: loginResult.userId, roleIds: loginResult.roleIds,
                createDateTime: new Date(Date.now())
            }

            loginResult.token = tokenData.id;
            createDataContext(g.settings.db).then(dc => {
                dc.tokenDatas.insert(tokenData);
            })

            chunk = new Buffer(JSON.stringify(loginResult));
            res.setHeader("content-length", chunk.length);

            args[0] = chunk;
            write.apply(this, args);
            let cookies = new Cookies(req, res);
            cookies.set(tokenName, tokenData.id);
        }
        catch (err) {
            logger.error(err);
        }
    }

    return null;
}