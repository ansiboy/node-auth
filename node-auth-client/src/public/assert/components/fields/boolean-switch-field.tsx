import { customField } from "maishu-wuzhui-helper";
import { GridViewDataCell, CustomField } from "maishu-wuzhui";
import ReactDOM = require("react-dom");
import { ListPageContext } from "../list-page";
import React = require("react");

export function booleanSwitchField<T>(args: {
    dataField: keyof T, headerText?: string, itemStyle?: Partial<CSSStyleDeclaration>, headerStyle?: Partial<CSSStyleDeclaration>, defaultValue?: boolean
}) {
    args.itemStyle = args.itemStyle || {} as Partial<CSSStyleDeclaration>;
    args.itemStyle.textAlign = args.itemStyle.textAlign || 'center'
    args.itemStyle.width = args.itemStyle.width || '100px'
    return customField({
        headerText: args.headerText,
        itemStyle: args.itemStyle as CSSStyleDeclaration,
        headerStyle: args.headerStyle as CSSStyleDeclaration,
        createItemCell() {
            let self = this as CustomField<any>
            let cell = new GridViewDataCell({
                render(dataItem: any, element) {
                    ReactDOM.render(<ListPageContext.Consumer>
                        {a => {
                            if (a != null) {
                                let dataSource = a.dataSource;
                                console.log(`dataSource ${dataSource}`)
                            }

                            return <label className="switch">
                                <input type="checkbox" className="ace ace-switch ace-switch-5"
                                    ref={e => {
                                        if (!e) return
                                        let value: boolean
                                        if (dataItem[args.dataField] == null && args.defaultValue != null) {
                                            value = args.defaultValue
                                        }
                                        else {
                                            value = dataItem[args.dataField]
                                        }
                                        e.checked = value == true
                                        e.onchange = async () => {
                                            console.assert(dataItem.id != null)
                                            let obj = { id: dataItem.id } as any
                                            obj[args.dataField] = e.checked;
                                            await self.gridView.dataSource.executeUpdate(obj)
                                            dataItem[args.dataField] = e.checked;
                                        }
                                    }} />
                                <span className="lbl middle"></span>
                            </label>
                        }}

                    </ListPageContext.Consumer>, element)
                }
            })

            return cell
        }
    })
}
