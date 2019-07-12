import * as mysql from 'mysql';
export default class SMSController {
    sendVerifyCode({ mobile, type }: {
        mobile: string;
        type: 'register' | 'resetPassword';
    }): Promise<{
        smsId: string;
    }>;
    checkVerifyCode(conn: mysql.Connection, { smsId, verifyCode }: {
        smsId: string;
        verifyCode: string;
    }): Promise<boolean>;
}
