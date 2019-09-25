import { BasePage } from "./base-page";
import { DataSource, DataControlField, GridView, CustomField, GridViewCell } from "maishu-wuzhui";
import React = require("react");
import { createGridView } from "maishu-wuzhui-helper";
import { createItemDialog, Dialog } from "components/item-dialog";
import ReactDOM = require("react-dom");

export abstract class DataListPage<T> extends BasePage {
    abstract dataSource: DataSource<T>;
    abstract itemName: string;
    abstract columns: DataControlField<T>[];
    pageSize?: number = 15;
    headerFixed = false;

    private itemTable: HTMLTableElement;
    gridView: GridView<T>;
    dialog: Dialog<T>;

    componentDidMount() {

        let it = this;
        this.columns = this.columns || [];
        this.columns.push(new CustomField<T>({
            headerText: "操作",
            headerStyle: { textAlign: "center" },
            itemStyle: { textAlign: "center" },
            createItemCell(dataItem: T) {
                let cell = new GridViewCell();
                ReactDOM.render(
                    <DataCommand {...{ dataItem, dataSource: it.dataSource, dialog: it.dialog }} />,
                    cell.element
                );
                return cell;
            }
        }))
        this.gridView = createGridView({
            element: this.itemTable,
            dataSource: this.dataSource,
            columns: this.columns,
            pageSize: this.pageSize
        })
    }

    renderEditor(): React.ReactElement {
        return null;
    }

    renderToolbarRight() {
        let editor = this.renderEditor();
        if (editor == null) {
            return [];
        }

        this.dialog = createItemDialog(this.dataSource, this.itemName, editor);

        let button = <button key="btnAdd" className="btn btn-primary btn-sm"
            onClick={() => this.dialog.show({} as T)}>
            <i className="icon-plus"></i>
            <span>添加</span>
        </button>

        return [button]
    }

    render() {

        return <table ref={e => this.itemTable = e || this.itemTable}>

        </table>
    }
}

interface DataCommandProps<T> {
    dataSource: DataSource<T>,
    dataItem: T,
    dialog: Dialog<T>
}

class DataCommand extends React.Component<DataCommandProps<any>> {
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