// import { Settings, ActionResult, getLogger } from "maishu-node-mvc";
// import { g, constants, TOKEN_NAME } from "../global";
// import { LoginResult } from "../types";
// import { createDataContext } from "../data-context";
// import { TokenData } from "../entities";
// import { guid } from "maishu-chitu-service";
// import { statusCodes } from "../status-codes";
// import Cookies = require("cookies");

// export let loginFilter: Settings["requestFilters"][0] = function (req, res): Promise<ActionResult> {

//     if (res.statusCode != statusCodes.login) {
//         return;
//     }

//     return new Promise(function (resolve, reject) {
//         let write = res.write;
//         res.setHeader("Set-Cookie", "1");
//         let logger = getLogger(`${constants.projectName}:${loginFilter.name}`, g.settings.logLevel);
//         res.write = function (chunk: Uint8Array) {
//             let args = [];
//             for (let i = 0; i < arguments.length; i++) {
//                 args.push(arguments[i]);
//             }

//             res.setHeader("Set-Cookie", "2");
//             let responseResult = chunk.toString();
//             try {
//                 let loginResult: LoginResult = JSON.parse(responseResult);
//                 if (!loginResult.userId) {
//                     logger.error(`Login result is incorrect, userId field is required.`);
//                     resolve();
//                     return;
//                 }

//                 let tokenData: TokenData = {
//                     id: guid(), user_id: loginResult.userId,
//                     create_date_time: new Date(Date.now())
//                 }

//                 loginResult.token = tokenData.id;
//                 createDataContext(g.settings.db).then(dc => {
//                     return dc.tokenDatas.insert(tokenData);
//                 }).catch(err => {
//                     logger.error(err);
//                 })

//                 chunk = Buffer.from(JSON.stringify(loginResult));
//                 res.setHeader("content-length", chunk.length);
//                 res.setHeader("Set-Cookie", "3");
//                 args[0] = chunk;
//                 let cookies = new Cookies(req, res);
//                 if (!req.headers.host) {
//                     logger.error(`Request headers host filed is null or empty.`);
//                 }
//                 logger.log(`Set token cookie form domain '${req.headers.host}'`);
//                 cookies.set(TOKEN_NAME, tokenData.id, { expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 365), domain: req.headers.host });
//                 let r = write.apply(this, args);
//                 resolve();
//                 return r;
//             }
//             catch (err) {
//                 logger.error(err);
//             }
//         }
//     })

// }