import { ImageService } from "maishu-services-sdk";

export let constants = {
    pageSize: 15,
    buttonTexts: {
        add: '添加',
        edit: '修改',
        delete: '删除',
        view: '查看'
    },
    noImage: '暂无图片',
    base64SrcPrefix: 'data:image',
}

export let services = {
    imageService: new ImageService()
}