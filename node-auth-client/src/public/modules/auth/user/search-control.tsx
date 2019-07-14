import ReactDOM = require("react-dom");
import React = require("react");
import { ControlArguments } from "assert/index";
import { User } from "entities";
import { DataSourceSelectArguments } from "maishu-wuzhui";
import { dataSources } from "assert/dataSources";

export default function (args: ControlArguments<User>) {
    let control: HTMLElement = document.createElement("div");
    let searchTextInput: HTMLInputElement;
    ReactDOM.render(<React.Fragment>
        <button key={"search-button"} className="btn btn-primary pull-right"
            onClick={() => search(searchTextInput.value)}>
            <i className="icon-search" />
            <span>搜索</span>
        </button>

        <input key="search-text" type="text" placeholder="请输入用户账号" className="form-control pull-right"
            style={{ width: 300 }} ref={e => searchTextInput = searchTextInput || e}
            onKeyDown={e => {
                if (!e) return
                if (e.keyCode == 13) {
                    search(searchTextInput.value)
                }
            }} />
    </React.Fragment>, control);

    return control;
}

function search(searchText: string) {
    searchText = (searchText || '').trim();
    let args: DataSourceSelectArguments = {
        filter: `mobile like '%${searchText}%' or user_name like '%${searchText}%' or email like '%${searchText}%'`
    }
    return dataSources.user.select(args);
}