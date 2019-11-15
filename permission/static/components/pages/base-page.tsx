import React = require("react");

export abstract class BasePage<P = {}, S = {}> extends React.Component<P, S> {
    constructor(props) {
        super(props);

        let render = this.render;
        this.render = () => {
            let toolbarLeft = this.renderToolbarLeft();
            let toolbarRight = this.renderToolbarRight();
            return <>
                <div className="tabbable">
                    <ul className="nav nav-tabs">
                        {toolbarLeft.map((o, i) =>
                            <li key={i} className="pull-left">{o}</li>
                        )}
                        {toolbarRight.reverse().map((o, i) =>
                            <li key={i} className="pull-right">{o}</li>
                        )}
                        <li className="pull-right">
                            <button className="btn btn-primary pull-right" style={{ display: "none" }}>
                                <i className="icon-reply"></i>
                                <span>返回</span>
                            </button>
                        </li>
                    </ul>
                </div>
                {render ? render.apply(this) : null}
            </>
        }
    }

    renderToolbarLeft(): React.ReactElement[] {
        return [];
    }

    renderToolbarRight(): React.ReactElement[] {
        return [];
    }
}