export declare const contentTypes: {
    application_json: string;
    text_plain: string;
};
export declare class ContentResult {
    data: string;
    statusCode: number;
    contentType: string;
    constructor(data: string, contentType: string, statusCode?: number);
}
