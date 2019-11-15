import { BasePage } from "./base-page";
import { DataSource, DataControlField, GridView, CustomField, GridViewCell, GridViewEditableCell, BoundField } from "maishu-wuzhui";
import React = require("react");
import { createGridView } from "maishu-wuzhui-helper";
import { createItemDialog, Dialog, ItemDialogContext } from "components/item-dialog";
import ReactDOM = require("react-dom");
import { InputControl, InputControlProps } from "components/inputs/input-control";
import { GridViewCellControl } from "maishu-wuzhui";

interface BoundInputControlProps<T> extends InputControlProps<T> {
    boundField: BoundField<T>
}

let OperationColumnWidth = 140;
let ScrollBarWidth = 18;

class BoundInputControl<T> extends InputControl<T, BoundInputControlProps<T>>{
    control: GridViewCellControl;
    cell: GridViewEditableCell<T>;

    constructor(props: BoundInputControl<T>["props"]) {
        super(props);

    }

    set value(value: any) {
        this.control.value = value;
    }

    get value(): any {
        return this.control.value;
    }

    render() {
        return <span ref={e => {
            if (e == null || this.control != null)
                return;

            this.control = this.props.boundField.createControl();
            this.control.element.className = "form-control";
            e.appendChild(this.control.element);
        }}>

        </span>
    }

}

export abstract class DataListPage<T> extends BasePage {
    abstract dataSource: DataSource<T>;
    abstract itemName: string;
    abstract columns: DataControlField<T>[];

    protected translate?: (items: T[]) => T[];

    pageSize?: number = 15;
    headerFixed = false;

    private itemTable: HTMLTableElement;
    gridView: GridView<T>;
    dialog: Dialog<T>;
    operationColumn: CustomField<T>;

    constructor(props) {
        super(props);

        let it = this;
        this.operationColumn = new CustomField<T>({
            headerText: "操作",
            headerStyle: { textAlign: "center" },
            itemStyle: { textAlign: "center", width: `${OperationColumnWidth}px` },
            createItemCell(dataItem: T) {
                let cell = new GridViewCell();
                ReactDOM.render(
                    <DataCommand<T> {...{ dataItem, dataSource: it.dataSource, dialog: it.dialog, }} />,
                    cell.element
                );
                return cell;
            }
        });
    }

    componentDidMount() {
        this.columns = this.columns || [];
        this.gridView = createGridView({
            element: this.itemTable,
            dataSource: this.dataSource,
            columns: [... this.columns, this.operationColumn],
            pageSize: this.pageSize,
            translate: this.translate,
            showHeader: this.headerFixed != true,
        })
    }

    renderEditor(): React.ReactElement {
        return <>
            {this.columns.filter(o => o instanceof BoundField && o.readOnly != true).map((col, i) =>
                <div key={i} className="form-group clearfix input-control">
                    <label>{col.headerText}</label>
                    <BoundInputControl boundField={col as BoundField<any>} dataField={(col as BoundField<any>).dataField} />
                </div>
            )}
        </>
    }

    renderToolbarRight() {
        let editor = this.renderEditor();
        if (editor == null) {
            return [];
        }

        this.dialog = createItemDialog(this.dataSource, this.itemName, editor);
        let button = <button key="btnAdd" className="btn btn-primary"
            onClick={() => this.dialog.show({} as T)}>
            <i className="icon-plus"></i>
            <span>添加</span>
        </button>

        return [button]
    }

    render() {
        if (this.headerFixed) {
            let columns = this.columns || [];
            return <>
                <table className="table table-striped table-bordered table-hover" style={{ margin: 0 }}>
                    <thead>
                        <tr>
                            {columns.map((col, i) =>
                                <th key={i} ref={e => {
                                    if (!e) return;
                                    if (!col.itemStyle)
                                        return;

                                    e.style.width = col.itemStyle["width"];

                                }}>{col.headerText}</th>
                            )}
                            <th style={{ width: OperationColumnWidth + ScrollBarWidth }}>
                                {this.operationColumn.headerText}
                            </th>
                        </tr>
                    </thead>
                </table>
                <div style={{
                    height: "calc(100% - 160px)", width: 'calc(100% - 300px)',
                    position: 'absolute', overflowY: "scroll", overflowX: "hidden"
                }}>
                    <table ref={e => this.itemTable = e || this.itemTable}>

                    </table>
                </div>
            </>
        }

        return <table ref={e => this.itemTable = e || this.itemTable}>

        </table>
    }
}

interface DataCommandProps<T> {
    dataSource: DataSource<T>,
    dataItem: T,
    dialog: Dialog<T>
}

class DataCommand<T> extends React.Component<DataCommandProps<T>> {
    private edit() {
        this.props.dialog.show(this.props.dataItem);
    }
    render() {
        return <>
            <button className="btn btn-minier btn-info"
                onClick={() => this.edit()}>
                <i className="icon-pencil"></i>
            </button>
            <button className="btn btn-minier btn-danger">
                <i className="icon-trash"></i>
            </button>
        </>
    }
}