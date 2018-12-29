import * as chitu from 'maishu-chitu';
export default class Service extends chitu.Service {
    constructor();
    ajax<T>(url: string, options?: chitu.AjaxOptions): Promise<T>;
    /**
     * 遍历 JSON 对象各个字段，将日期字符串转换为 Date 对象
     * @param obj 要转换的 JSON 对象
     */
    private travelJSON;
    private isDateString;
    getByJson<T>(url: string, data?: any): Promise<T>;
    protected putByJson<T>(url: string, data?: any): Promise<T>;
    protected postByJson<T>(url: string, data?: any): Promise<T>;
    protected deleteByJson<T>(url: string, data: any): Promise<T>;
    protected get<T>(url: string, data?: any): Promise<T>;
    protected put<T>(url: string, data?: any): Promise<T>;
    protected post<T>(url: string, data?: any): Promise<T>;
    protected delete<T>(url: string, data: any): Promise<T>;
}
