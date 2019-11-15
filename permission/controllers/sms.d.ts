import { AuthDataContext } from '../data-context';
export default class SMSController {
    sendVerifyCode(dc: AuthDataContext, { mobile, type }: {
        mobile: string;
        type: 'register' | 'resetPassword';
    }): Promise<{
        smsId: string;
    }>;
    checkVerifyCode(dc: AuthDataContext, { smsId, verifyCode }: {
        smsId: string;
        verifyCode: string;
    }): Promise<boolean>;
}
