import { CustomField } from "maishu-wuzhui";
export declare function booleanSwitchField<T>(args: {
    dataField: keyof T;
    headerText?: string;
    itemStyle?: Partial<CSSStyleDeclaration>;
    headerStyle?: Partial<CSSStyleDeclaration>;
    defaultValue?: boolean;
}): CustomField<unknown>;
