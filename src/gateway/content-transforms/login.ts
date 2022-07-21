import { ContentTransformFunc, RequestResult, getLogger } from "maishu-node-mvc";
import { StatusCode } from "../status-codes";
import { constants, guid, TOKEN_NAME, g } from "../global";
import { LoginResult } from "../types";
import { TokenData } from "../entities";
import { AuthDataContext } from "../data-context";
import Cookies = require("maishu-cookies");
import * as stream from "stream";

export let loginTransform: ContentTransformFunc = async (result, context) => {

    if (context.res.statusCode != StatusCode.Login) {
        return result;
    }

    let logger = getLogger(constants.projectName);
    logger.info("Status code is login status code, process login logic.");

    console.assert(result != null);

    let text = await getContentText(result);
    let content: LoginResult = JSON.parse(text);
    let tokenData = createTokenData(content.userId);
    content.token = tokenData.id;

    let expires = new Date(Date.now() + 60 * 60 * 1000 * 24 * 365);
    let cookies = new Cookies(context.req, context.res);
    cookies.set(TOKEN_NAME, tokenData.id, {
        overwrite: true, expires,
        httpOnly: false,
    });

    result.content = JSON.stringify(content);
    return result;
}

function getContentText(r: RequestResult) {
    return new Promise<string>((resolve, reject) => {
        if (r.content instanceof stream.Readable) {
            let buffer = Buffer.from([]);
            r.content.on("data", (data) => {
                buffer = Buffer.concat([buffer, data])
            })
            r.content.on("end", function () {
                resolve(buffer.toString())
            })
            r.content.on("error", function (err) {
                reject(err);
            })
        }
        else if (typeof r.content == "string") {
            resolve(r.content)
        }
        else {
            resolve(r.content.toString());
        }
    })
}

function createTokenData(userId: string): TokenData {
    let tokenData: TokenData = {
        id: guid(), user_id: userId,
        create_date_time: new Date(Date.now())
    }

    let logger = getLogger(`${constants.projectName}:${createTokenData.name}`, g.settings.logLevel);
    AuthDataContext.create(g.settings.db).then(dc => {
        return dc.tokenDatas.insert(tokenData);
    }).catch(err => {
        logger.error(err);
    })


    return tokenData;
}

