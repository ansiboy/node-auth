import { Path } from "entities";
import { ControlArguments, ItemPageContext, createItemDialog, Buttons } from "assert/index";
import React = require("react");
import { rules, FormValidator } from "maishu-dilu";
import { errors } from "assert/errors";
import { textbox } from "maishu-wuzhui-helper";
import { dataSources, Module } from "assert/dataSources";

let itemDialog = createItemDialog(dataSources.module, "路径",
    <ItemPageContext.Consumer>
        {args => {
            let dataItem: Module = args.dataItem;
            let name = dataItem.name;
            let p = dataItem.parent;
            while (p) {
                name = p.name + " " + name;
                p = p.parent;
            }

            return <>
                <div className="form-group clearfix">
                    <PathList dataItem={dataItem} />
                </div>
            </>
        }}
    </ItemPageContext.Consumer>
);

class PathList extends React.Component<{ dataItem: Module }, { dataItem: Module }> {
    formElement: HTMLElement;
    validator: FormValidator;
    newItem: Path = {} as any;

    constructor(props: PathList["props"]) {
        super(props);

        this.state = { dataItem: props.dataItem };
    }
    private addItem() {
        if (!this.validator.check())
            return;

        this.state.dataItem.paths.push(this.newItem);
        this.setState({ dataItem: this.state.dataItem });
        this.newItem = {} as any;
    }
    private removeItem(path: Path) {
        this.state.dataItem.paths = this.state.dataItem.paths.filter(o => o.id != path.id);
        this.setState({ dataItem: this.state.dataItem });
    }
    componentDidMount() {
        this.validator = new FormValidator(this.formElement,
            { name: "path", rules: [rules.required("请输入路径")] }
        )
    }
    componentWillReceiveProps(props: PathList["props"]) {
        this.setState({ dataItem: props.dataItem });
    }
    render() {
        let { dataItem } = this.state;
        return <table style={{ marginBottom: 0 }} className="table table-striped table-bordered" >
            <tbody>
                {dataItem.paths.map((p, i) =>
                    <tr key={i}>
                        <td>
                            <input className="form-control" ref={e => {
                                if (!e) return;
                                textbox<Path>({ element: e, dataField: "value", dataItem: p, valueType: "string" })
                            }} />
                        </td>
                        <td style={{ textAlign: "center", width: "50px" }}>
                            <button className="btn btn-danger" onClick={() => this.removeItem(p)}>
                                <i className="icon-trash" style={{ marginRight: 4 }}></i>
                                <span>删除</span>
                            </button>
                        </td>
                    </tr>
                )}
            </tbody>
            <tfoot ref={e => this.formElement = this.formElement || e}>
                <tr>
                    <td>
                        <input name="path" className="form-control"
                            placeholder="请输入该模块允许访问的路径"
                            ref={e => e ? textbox<Path>({ element: e, dataField: "value", dataItem: this.newItem, valueType: "string" }) : null} />
                    </td>
                    <td style={{ textAlign: "center", width: "50px" }}>
                        <button className="btn btn-info" onClick={() => this.addItem()}>
                            <i className="icon-plus" style={{ marginRight: 4 }}></i>
                            <span>添加</span>
                        </button>
                    </td>
                </tr>
            </tfoot>
        </table>
    }
}

export default function (args: ControlArguments<Module>) {
    let control: HTMLElement;
    switch (args.resource.data.code) {
        case Buttons.codes.add:
            control = Buttons.createPageAddButton(async () => {
                itemDialog.show(args.dataItem);
            })
            break;
        case Buttons.codes.edit:
            control = Buttons.createListEditButton(() => {
                itemDialog.show(args.dataItem);
            })
            break;
        case Buttons.codes.view:
            control = Buttons.createListViewButton(() => {
                itemDialog.show(args.dataItem);
            })
            break;
        default:
            throw errors.unknonwResourceName(args.resource.name);
    }

    return control;
}