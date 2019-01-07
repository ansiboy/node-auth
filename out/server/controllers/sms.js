"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const QcloudSms = require("qcloudsms_js");
const settings = require("../settings");
const errors_1 = require("../errors");
const database_1 = require("../database");
function sendVerifyCode({ mobile, type }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mobile)
            throw errors_1.errors.argumentNull('mobile');
        if (!type)
            throw errors_1.errors.argumentNull('type');
        let verifyCode = getRandomInt(1000, 9999).toFixed(0);
        let verifyCodeText = settings.verifyCodeText.default;
        let msg = verifyCodeText.replace('{0}', verifyCode);
        let obj = yield database_1.connect((conn) => __awaiter(this, void 0, void 0, function* () {
            if (type == 'register') {
                // 检查手机号码未被注册
                let sql = 'select mobile from user where mobile = ?';
                let [rows] = yield database_1.execute(conn, sql, [mobile]);
                if (rows.length != 0)
                    throw errors_1.errors.mobileExists(mobile);
            }
            let sql = 'insert into sms_record set ?';
            let obj = {
                id: database_1.guid(), mobile, content: msg,
                code: verifyCode, create_date_time: new Date(Date.now())
            };
            yield database_1.execute(conn, sql, obj);
            sendMobileMessage(mobile, msg);
            return obj;
        }));
        return { smsId: obj.id };
    });
}
exports.sendVerifyCode = sendVerifyCode;
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function sendMobileMessage(mobile, content) {
    //=====================================
    // 如果测试模式
    if (settings.test != null) {
        // 如果不发短信，则退出
        if (!settings.test.sendMessage)
            return;
        // 短信发送到测试手机
        if (settings.test.mobile)
            mobile = settings.test.mobile;
    }
    //=====================================
    return new Promise((resolve, reject) => {
        // 短信应用SDK AppID
        var appid = 1400061073; // SDK AppID是1400开头
        // 短信应用SDK AppKey
        var appkey = "1d912a9628717fe43a464874313ca996";
        // 实例化QcloudSms
        var qcloudsms = QcloudSms(appid, appkey);
        let ssender = qcloudsms.SmsSingleSender();
        var smsType = 0; // Enum{0: 普通短信, 1: 营销短信}
        ssender.send(smsType, 86, mobile, content, "", "", (err, res, resData) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(resData);
        });
    });
}
// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
function callback(err, res, resData) {
    if (err) {
        console.log("err: ", err);
    }
    else {
        console.log("request data: ", res.req);
        console.log("response data: ", resData);
    }
}
//# sourceMappingURL=sms.js.map