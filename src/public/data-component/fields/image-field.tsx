import { customField } from "maishu-wuzhui-helper";
import { GridViewDataCell } from "maishu-wuzhui";
import { services, constants } from "data-component/common";
import ReactDOM = require("react-dom");
import React = require("react");
import { generateImageBase64, renderImage, showDialog } from "maishu-ui-toolkit";

export function imageField(args: {
    dataField: string, headerText: string, headerStyle?: Partial<CSSStyleDeclaration>,
    displayMax?: number, afterRenderCell?: (cell: GridViewDataCell<any>, dataItem: any) => void
}) {
    return customField({
        headerText: args.headerText,
        headerStyle: args.headerStyle,
        createItemCell() {
            let cell = new GridViewDataCell({
                render(dataItem, element) {
                    let s = services.imageService
                    let value: string = dataItem[args.dataField]
                    if (value == null) {
                        ReactDOM.render(<img style={{ height: 40 }} src={generateImageBase64(100, 40, constants.noImage)} />, element);
                        return
                    }
                    let imageids = value.split(',')
                    if (imageids.length > 0 && args.displayMax > 0) {
                        imageids = imageids.slice(0, args.displayMax)
                    }
                    ReactDOM.render(<>{imageids.map(id =>
                        <img key={id} style={{ height: 40 }} src={s.imageSource(id, null, 100)}
                            ref={e => {
                                if (!e) return
                                renderImage(e, { imageSize: { height: 40, width: 40 }, imageText: constants.noImage })
                                enableViewImage(e)
                            }} />
                    )}</>, element);

                    if (args.afterRenderCell) {
                        args.afterRenderCell(cell, dataItem)
                    }
                }
            })
            return cell
        }
    })
}

export let enableViewImage = (function () {

    const closeButtonClassName = 'close'
    let imageDialogElement = document.createElement('div')
    imageDialogElement.className = 'modal fade'
    document.body.appendChild(imageDialogElement)

    ReactDOM.render(<div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <button type="button" className={closeButtonClassName} data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">图片预览</h4>
            </div>
            <div className="modal-body">
                <img className="img-responsive" />
            </div>
        </div>
    </div>, imageDialogElement)

    function viewImage(imageSource: string) {
        let sharpIndex = imageSource.indexOf('?')
        if (sharpIndex >= 0) {
            var search = imageSource.substring(sharpIndex + 1);
            let obj = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
            let imageId = obj.id
            if (imageId) {
                let s = services.imageService
                imageSource = s.imageSource(imageId)
            }
        }

        let imageElement = imageDialogElement.querySelector('img')
        imageElement.src = imageSource
        imageElement['rendered'] = false
        renderImage(imageElement, { imageSize: { width: 800, height: 400 }, imageText: '图片正在加载中' })
        showDialog(imageDialogElement, (button) => {
            if (button != null && button.className == closeButtonClassName) {
                imageElement.src = ''
            }
        })
    }

    return function (imageElement: HTMLImageElement) {

        const attr = 'enable-view-image'
        if (imageElement.getAttribute(attr) != null)
            return

        imageElement.setAttribute(attr, '')
        imageElement.title = '点击查看图片'
        imageElement.addEventListener('click', () => viewImage(imageElement.src))
    }

}())
