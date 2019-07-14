import React = require("react");
import * as ui from 'maishu-ui-toolkit'
import { dataSources, MyDataSource } from "assert/dataSources";
import { FormValidator, ValidateField, Rule } from 'maishu-dilu'
import { Page, Application } from "maishu-chitu-react";
import { parseUrl } from "maishu-chitu";


function getObjectType(url: string) {
    // let url = location.hash.substr(1);
    let obj = parseUrl(url)
    let arr = obj.pageName.split('/')
    return arr[0];
}

interface ValidateDataField {
    validateRules?: Rule[]
}

interface State {
    dataItem: any,
    originalDataItem: any,
}

type BeforeSave = (dataItem: any) => Promise<any>
export let ItemPageContext = React.createContext({
    dataItem: {} as any, updatePageState: (dataItem) => null,
    beforeSave: (callback: BeforeSave) => null,
})

export interface ItemPageProps<T> {
    app: Application;
    source: Page;
    data: {
        id: string,
        sourceId: string,
        resourceId: string,
        mode?: string
    };
    createService: Page["createService"];
    beforeSave?: (dataItem: T) => Promise<any>,
    afterGetItem?: (dataItem: T) => void
}


export class ItemPage<T> extends React.Component<ItemPageProps<T>, State> {
    dataSource: MyDataSource<any>;
    fieldsConatiner: HTMLDivElement;
    validator: FormValidator;
    beforeSaves: BeforeSave[];

    constructor(props) {
        super(props)
        getObjectType(this.props.source.url)
        this.state = { dataItem: {}, originalDataItem: {} }
        if (this.props.afterGetItem) {
            this.props.afterGetItem(this.state.dataItem)
        }

        let objectType = getObjectType(this.props.source.url);
        this.dataSource = dataSources[objectType];
        if (this.props.data.id || this.props.data.sourceId) {
            this.loadDataItem(this.props.data.id || this.props.data.sourceId)
        }
        this.beforeSaves = []
        if (this.props.beforeSave) {
            this.beforeSaves.push(this.props.beforeSave)
        }
    }
    loadDataItem(itemId: string) {
        let objectType = getObjectType(this.props.source.url);
        this.dataSource = dataSources[objectType];
        this.dataSource.getItem(itemId).then(item => {
            console.assert(item != null)
            let originalDataItem = JSON.parse(JSON.stringify(item))
            this.setState({ dataItem: item, originalDataItem })
            if (this.props.afterGetItem) {
                this.props.afterGetItem(item)
            }
        })
    }
    async save() {
        this.validator.clearErrors()
        if (!this.validator.check()) {
            return Promise.reject('validate fail')
        }
        let { dataItem, originalDataItem } = this.state
        if (this.beforeSaves.length > 0) {
            await Promise.all(this.beforeSaves.map(m => m(dataItem)));
        }

        let changedData: any = {}
        let names = Object.getOwnPropertyNames(dataItem)
        for (let i = 0; i < names.length; i++) {
            if (dataItem[names[i]] == originalDataItem[names[i]])
                continue

            changedData[names[i]] = dataItem[names[i]]
        }

        if (Object.getOwnPropertyNames(changedData).length == 0) {
            console.log('Data item is not changed.')
            return
        }

        if (dataItem.id) {
            if (!this.props.data.sourceId) {
                changedData.id = dataItem.id;
                let r = await this.dataSource.update(changedData)
                Object.assign(dataItem, r || {})
            }
            else {
                let obj = Object.assign({}, dataItem, changedData)
                delete obj.id
                let r = await this.dataSource.insert(obj)
                Object.assign(dataItem, r || {})
            }
        }
        else {
            let r = await this.dataSource.insert(changedData)
            Object.assign(dataItem, r || {})
        }

        originalDataItem = JSON.parse(JSON.stringify(dataItem))
        this.setState({ originalDataItem, dataItem })
    }
    componentWillReceiveProps(props: this['props']) {
        let { dataItem } = this.state
        let dataItemId = props.data.id || props.data.sourceId
        if (dataItemId != dataItem.id) {
            this.setState({ dataItem: {}, originalDataItem: {} })
            if (props.data.id || props.data.sourceId) {
                this.loadDataItem(props.data.id || props.data.sourceId)
            }
        }
    }
    componentDidMount() {
        let children: React.ReactNode[] = this.props.children == null ? [] :
            Array.isArray(this.props.children) ? this.props.children : [this.props.children];

        var validateFields = children.filter(o => o != null)
            .map((o: React.ReactElement<any>) => {
                let props = o.props as ValidateDataField & { dataField: string, name: string }
                if (props == null || props.validateRules == null)
                    return null

                let f: ValidateField = { name: props.name || props.dataField, rules: props.validateRules || [] }
                return f
            })
            .filter(o => o != null)

        this.validator = new FormValidator(this.fieldsConatiner, ...validateFields)
    }
    render() {
        let { dataItem } = this.state
        return <>
            <div className="tabbable">
                <ul className="nav nav-tabs">
                    <li className="pull-right">
                        {(this.props.data as any).mode == 'view' ? null :
                            <button className="btn btn-primary"
                                ref={e => {
                                    if (!e) return
                                    ui.buttonOnClick(e, () => this.save(), { toast: '保存成功' })
                                }}>
                                <i className="icon-save" />
                                <span>保存</span>
                            </button>
                        }
                        <button className="btn btn-primary" onClick={() => this.props.app.back()}>
                            <i className="icon-reply" />
                            <span>返回</span>
                        </button>
                    </li>
                </ul>
            </div>
            <div ref={e => this.fieldsConatiner = e || this.fieldsConatiner}>
                <ItemPageContext.Provider value={{
                    dataItem,
                    updatePageState: (dataItem) => {
                        this.setState({ dataItem })
                    },
                    beforeSave: (callback: BeforeSave) => {
                        this.beforeSaves.push(callback);
                    }
                }}>
                    {this.props.children}
                </ItemPageContext.Provider>
            </div>
        </>
    }
}