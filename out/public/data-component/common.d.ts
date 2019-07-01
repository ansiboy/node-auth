import { ImageService } from "maishu-services-sdk";
import { Rule } from "maishu-dilu";
import { DataSource } from "maishu-wuzhui";
export declare let constants: {
    pageSize: number;
    buttonTexts: {
        add: string;
        edit: string;
        delete: string;
        view: string;
    };
    noImage: string;
    base64SrcPrefix: string;
};
export declare let services: {
    imageService: ImageService;
};
export interface ValidateDataField {
    validateRules?: Rule[];
}
export interface NameValue {
    name: string;
    value: any;
}
export declare function getObjectType(url: string): string;
export declare function toDataSource<T>(source: Promise<T[]>): DataSource<T>;
