import { GridViewDataCell } from "maishu-wuzhui";
export declare function imageField(args: {
    dataField: string;
    headerText: string;
    headerStyle?: Partial<CSSStyleDeclaration>;
    displayMax?: number;
    afterRenderCell?: (cell: GridViewDataCell<any>, dataItem: any) => void;
}): import("../../../../node_modules/maishu-wuzhui/out/index").CustomField<unknown>;
export declare let enableViewImage: (imageElement: HTMLImageElement) => void;
