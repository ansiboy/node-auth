import { Callbacks } from 'maishu-chitu-service'
import { LoginInfo } from './services/service';
import { PermissionService } from './services/permission-service';
export let events = {
    /** 成功调用 login 方法后引发 */
    login: Callbacks<PermissionService, LoginInfo>(),
    /** 成功调用 logout 方法后引发 */
    logout: Callbacks<PermissionService, LoginInfo>(),
    /** 成功调用 register 方法后引发 */
    register: Callbacks<PermissionService, LoginInfo>(),
} 