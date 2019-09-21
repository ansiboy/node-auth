import { customField } from "maishu-wuzhui-helper";
import { GridViewDataCell, CustomField } from "maishu-wuzhui";

export function valueTextField<T>(args: {
    dataField: keyof T,
    items: { [value: string]: string },
    headerText: string,
    sortExpression?: string,
    itemStyle?: Partial<CSSStyleDeclaration>,
}): CustomField<any> {
    
    return customField({
        headerText: args.headerText,
        sortExpression: args.sortExpression,
        itemStyle: args.itemStyle as CSSStyleDeclaration,
        createItemCell() {
            let cell = new GridViewDataCell({
                render(dataItem: T, element) {
                    let value = dataItem[args.dataField] as any
                    let text = args.items[value] || value
                    element.innerHTML = text
                }
            })
            return cell
        }
    })
}
