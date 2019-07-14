import { customField } from "maishu-wuzhui-helper";
import { CustomField, GridViewCell } from "maishu-wuzhui";

export function sortNumberField() {
    return customField({
        headerText: '序号',
        headerStyle: { width: '80px' },
        itemStyle: { width: '80px' },
        createItemCell(dataItem) {
            let self = this as CustomField<any>
            let cell = new GridViewCell()
            cell.element.innerHTML = `${self.gridView.element.tBodies[0].rows.length + self.gridView.selectArguments.startRowIndex}`
            return cell
        },
    })
}

