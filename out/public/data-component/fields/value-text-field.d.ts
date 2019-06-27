export declare function valueTextField<T>(args: {
    dataField: keyof T;
    items: {
        [value: string]: string;
    };
    headerText: string;
    sortExpression?: string;
    itemStyle?: Partial<CSSStyleDeclaration>;
}): import("../../../../node_modules/maishu-wuzhui/out/index").CustomField<unknown>;
