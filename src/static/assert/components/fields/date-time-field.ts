import { customDataField } from "./custom-data-field";
import { CustomField } from "maishu-wuzhui";

export function dateTimeField<T>(args: { dataField: Extract<keyof T, string>, headerText: string, }): CustomField<T> {

    return customDataField<T>({
        // dataField: args.dataField,
        headerText: args.headerText,
        headerStyle: { textAlign: 'center', width: '160px' } as CSSStyleDeclaration,
        itemStyle: { textAlign: 'center', width: `160px` } as CSSStyleDeclaration,
        // dataFormatString: "{gg}"
        render: (dataItem) => {
            let value = dataItem[args.dataField] as any;
            // if (typeof value == 'number')
            return toDateTimeString(value)
        }
    })
}

export function toDateTimeString(datetime: number | Date) {
    if (datetime == null)
        return null

    let d: Date
    if (typeof datetime == 'number')
        d = new Date(datetime)
    else
        d = datetime

    let month = `${d.getMonth() + 1}`
    month = month.length == 1 ? '0' + month : month

    let date = `${d.getDate()}`
    date = date.length == 1 ? '0' + date : date

    let hours = `${d.getHours()}`
    hours = hours.length == 1 ? '0' + hours : hours

    let minutes = `${d.getMinutes()}`
    minutes = minutes.length == 1 ? '0' + minutes : minutes

    return `${d.getFullYear()}-${month}-${date} ${hours}:${minutes}`
}