import { parseUrl } from "maishu-chitu";
import { DataSource } from "maishu-wuzhui";

export let constants = {
    pageSize: 15,
    buttonTexts: {
        add: '添加',
        edit: '修改',
        delete: '删除',
        view: '查看'
    },
    buttonCodes: {
        add: 'add',
        edit: 'edit',
        delete: 'delete',
        view: 'view'
    },
    noImage: '暂无图片',
    base64SrcPrefix: 'data:image',
}

export let services = {
    imageService: null
}

export interface NameValue {
    name: string,
    value: any,
}

export function getObjectType(url: string) {
    let obj = parseUrl(url)
    let arr = obj.pageName.split('/')
    return arr[0];
}

export function toDataSource<T>(source: Promise<T[]>): DataSource<T> {
    return new DataSource({
        select: async () => {
            let items = await source;
            return { dataItems: items, totalRowCount: items.length };
        }
    })
}


