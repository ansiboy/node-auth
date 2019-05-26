import * as QcloudSms from 'qcloudsms_js'
import * as settings from '../settings'
import { errors } from '../errors';
import { connect, execute, guid, connection } from '../database';
import { Connection } from 'maishu-mysql-helper';
import { controller, action, formData } from 'maishu-node-mvc';
import * as mysql from 'mysql'

interface SMSRecord {
    id: string,
    mobile: string,
    content: string,
    code: string,
    create_date_time: Date
}

@controller('sms')
export default class SMSController {
    @action()
    async sendVerifyCode(@formData { mobile, type }: { mobile: string, type: 'register' | 'resetPassword' }) {

        if (!mobile) throw errors.argumentNull('mobile')
        if (!type) throw errors.argumentNull('type')

        let verifyCode = getRandomInt(1000, 9999).toFixed(0)
        let verifyCodeText: string = settings.verifyCodeText.default;

        let msg = verifyCodeText.replace('{0}', verifyCode);
        let obj = await connect(async conn => {

            if (type == 'register') {
                // 检查手机号码未被注册
                let sql = 'select mobile from user where mobile = ?'
                let [rows] = await execute(conn, sql, [mobile])
                if (rows.length != 0)
                    throw errors.mobileExists(mobile)
            }

            let sql = 'insert into sms_record set ?'
            let obj: SMSRecord = {
                id: guid(), mobile, content: msg,
                code: verifyCode, create_date_time: new Date(Date.now())
            }
            await execute(conn, sql, obj)
            sendMobileMessage(mobile, msg)
            return obj
        })

        return { smsId: obj.id }
    }

    @action()
    async checkVerifyCode(@connection conn: mysql.Connection, { smsId, verifyCode }: { smsId: string, verifyCode: string }) {
        if (!conn) throw errors.argumentNull('conn')
        let sql = `select code from sms_record where id = ?`
        let [rows] = await execute(conn, sql, [smsId])
        if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
            // throw errors.verifyCodeIncorrect(verifyCode)
            return false
        }
        return true
    }

}

// export async function checkVerifyCode(@connection conn: mysql.Connection, { smsId, verifyCode }): Promise<boolean> {
//     if (!smsId) throw errors.argumentNull('smsId')
//     if (!verifyCode) throw errors.argumentNull('verifyCode')

//     // let r = await connect(async conn => {
//     let sql = `select code from sms_record where id = ?`;
//     let [rows] = await execute(conn, sql, [smsId])
//     if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
//         return false
//     }

//     return true
//     // })

//     // return r
// }

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function sendMobileMessage(mobile: string, content: string) {

    //=====================================
    // 如果测试模式
    if (settings.test != null) {
        // 如果不发短信，则退出
        if (!settings.test.sendMessage)
            return

        // 短信发送到测试手机
        if (settings.test.mobile)
            mobile = settings.test.mobile;
    }
    //=====================================

    return new Promise((resolve, reject) => {
        // 短信应用SDK AppID
        var appid = 1400061073;  // SDK AppID是1400开头

        // 短信应用SDK AppKey
        var appkey = "1d912a9628717fe43a464874313ca996";

        // 实例化QcloudSms
        var qcloudsms = QcloudSms(appid, appkey);
        let ssender = qcloudsms.SmsSingleSender();
        var smsType = 0; // Enum{0: 普通短信, 1: 营销短信}
        ssender.send(smsType, 86, mobile, content, "", "", (err, res, resData) => {
            if (err) {
                reject(err)
                return
            }

            resolve(resData)
        });
    })
}

// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
function callback(err, res, resData) {
    if (err) {
        console.log("err: ", err);
    } else {
        console.log("request data: ", res.req);
        console.log("response data: ", resData);
    }
}