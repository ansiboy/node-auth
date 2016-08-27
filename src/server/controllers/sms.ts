import * as http from 'http';
import * as querystring from 'querystring';
import { BaseController } from './baseController';
import * as data from './../database';
import * as settings from '../settings';

let verifyCodeLength = settings.verifyCodeLength;
export class SMSController extends BaseController {
    sendCode(mobile: string, type: 'register' | 'receivePassword'): Promise<Error | string> {
        //SMSController.sendMobileMessage()
        return new Promise((reslove, reject) => {
            //=======================================
            // 说明：生成一个大于或等于验证码长度的随机字符串
            let num: number;
            do {
                num = Math.random();
            }
            while (num == 0);
            //=======================================
            // 使用 str 必定大于 verifyCodeLength，如果不足则 0 补足
            let str = num.toString().substr(2) + '0'.repeat(verifyCodeLength);
            //=======================================
            let verifyCode = str.substr(0, verifyCodeLength);
            let msg = settings.verifyCodeText.replace('{0}', verifyCode);
            SMSController.sendMobileMessage(mobile, msg);
            reslove(true);
        });
    }
    static verifyCode(smsId: string, code: string): Promise<boolean> {
        return new Promise((reslove, reject) => {

        });
    }
    test() {
        SMSController.sendMobileMessage('18502146746', '');
    }
    private static sendMobileMessage(mobile: string, msg: string) {
        return new Promise<any>((reslove, rejct) => {
            let content = '欢迎关注零食有约，您的验证码是1234【零食有约】';
            let data = querystring.stringify({
                userid: '',
                account: 'jk001',
                password: 'jk5543',
                mobile: '18502146746',
                content: content,
                action: 'send'
            });
            let headers = {
                "Content-Type": 'application/x-www-form-urlencoded',
                'Content-Length': data.length
            }
            let request = http.request({
                host: 'sh2.ipyy.com',
                path: '/sms.aspx',
                method: 'post',
                headers
            }, (response) => {
                let content_length = new Number(response.headers['content-length']).valueOf();
                let data = response.read(content_length);
                response.on('data', (e) => {
                    debugger;
                    let msg = new Buffer(e).toString();
                    reslove();
                });
                response.on('error', (e) => {
                    rejct(e);
                })
            });



            request.write(data);
            request.end();
        });
    }
}