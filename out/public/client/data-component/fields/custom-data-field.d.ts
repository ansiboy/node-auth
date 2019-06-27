import { CustomField } from "maishu-wuzhui";
export declare function customDataField<T>(params: {
    headerText?: string;
    headerStyle?: Partial<CSSStyleDeclaration>;
    itemStyle?: Partial<CSSStyleDeclaration>;
    render: (dataItem: T, element: HTMLElement) => string | void;
}): CustomField<unknown>;
