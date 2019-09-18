import React = require("react");
import { ItemPageProps, ItemPage } from "assert/index";
import { Token } from "entities";

export default class TokenItemPage extends React.Component<ItemPageProps<Token>> {
    render() {
        return <ItemPage {...this.props}>
            <div className="item">
                <label>用户名</label>
                <span>

                </span>
            </div>
        </ItemPage>
    }
}