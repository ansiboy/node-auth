import React = require("react");
import { dateTimeField } from "assert/index";
import { ListPage } from "assert/index";
import { dataSources } from "assert/dataSources";
import { boundField } from "maishu-wuzhui-helper";
import { hideDialog } from "maishu-ui-toolkit";
import { Token } from "entities";
import { PageProps } from "assert/index";

export default class TokenListPage extends React.Component<PageProps> {

    dialogElement: HTMLElement;

    render() {
        return <>
            <ListPage<Token> resourceId={this.props.data.resourceId} context={this} dataSource={dataSources.token}
                columns={[
                    boundField<Token>({ dataField: "id", headerText: "编号", headerStyle: { width: "300px" } }),
                    boundField<Token>({ dataField: "content", headerText: "内容" }),
                    dateTimeField<Token>({ dataField: "create_date_time", headerText: "创建时间" })
                ]}
            />
            <div className="modal fade" ref={e => this.dialogElement = e || this.dialogElement}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">添加</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">用户名</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" id="inputEmail3" placeholder="请输入登录用户的手机号或用户名" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-default" onClick={() => hideDialog(this.dialogElement)}>
                                <i className="icon-reply" />
                                <span>取消</span>
                            </button>
                            <button className="btn btn-primary">
                                <i className="icon-save" />
                                <span>保存</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}