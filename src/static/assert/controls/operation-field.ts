import { PermissionService } from "assert/services/index";
import { ValueStore } from "maishu-chitu";
import { MenuItem } from "assert/masters/main-master-page";
import { translateToMenuItems } from "assert/dataSources";
import { customField } from "maishu-wuzhui-helper";
import { GridViewCell } from "maishu-wuzhui";
import { loadControlModule } from "./page-view";

export function operationField<T extends Entity>
    (resourceId: string, permissionService: PermissionService, pageView: object, width?: string) {

    width = width || '120px'
    let menuItemStorage = new ValueStore<MenuItem>();
    permissionService.resource.list().then(resources => {
        let menuItems = translateToMenuItems(resources);
        let currentMenuItem = menuItems.filter(o => o.id == resourceId)[0];
        console.assert(currentMenuItem != null);
        menuItemStorage.value = currentMenuItem;
    })

    return customField<T>({
        headerText: '操作',
        itemStyle: { textAlign: 'center', width } as CSSStyleDeclaration,
        headerStyle: { width } as CSSStyleDeclaration,
        createItemCell(dataItem: T) {
            let cell = new GridViewCell()
            renderCell(dataItem, cell)
            return cell
        },
    })

    async function renderCell(dataItem: T, cell: GridViewCell) {
        if (menuItemStorage.value) {
            renderOperationButtons(menuItemStorage.value, cell.element, dataItem, pageView)
        }
        else {
            menuItemStorage.add((menuItem) => {
                renderOperationButtons(menuItem, cell.element, dataItem, pageView)
            })
        }

    }

    // }
}

export async function renderOperationButtons<T>
    (menuItem: MenuItem, element: HTMLElement, dataItem: T, pageView: any) {
    let children = menuItem.children || [];
    children.forEach(o => o.data = o.data || {} as any);
    children = children.filter(o => o.data.position == "in-list");
    let funcs = await Promise.all(children.map(o => loadControlModule(o.page_path)))
    let controlElements = children.map((o, i) => funcs[i]({ resource: o, dataItem, context: pageView }));
    controlElements.forEach(child => {
        element.appendChild(child)
    })
}

