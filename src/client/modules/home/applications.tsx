//import * as ko from 'ko';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Dialog } from '../../components/dialog'

let apps = [
    { name: 'AAA', title: 'AAA' },
    { name: 'BBB', title: 'AAA' },
    { name: 'CCC', title: 'AAA' },
    { name: 'DDD', title: 'AAA' },
];

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

class ApplicationsPage extends chitu.Page {
    constructor(params) {
        super(params);
        this.load.add(this.page_load);
    }

    private page_load(sender: chitu.Page, args) {
        let dialogElement = document.createElement('div');
        sender.element.appendChild(dialogElement);
        ReactDOM.render(React.createElement(Dialog), dialogElement);

        let appListElement = document.createElement('div');
        sender.element.appendChild(appListElement);
        ReactDOM.render(React.createElement(AppList), appListElement);
    }
}

interface App {
    title: string,
    name: string
}

class AppView extends React.Component<App, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li>
                <p className="header smaller lighter green">
                    {this.props.title}
                </p>
                <div className="pull-left">
                    名称
                </div>
                <div>
                    {this.props.name}
                </div>
            </li>
        );
    }
}

class AppList extends React.Component<{}, { apps: App[] }>{
    constructor(props) {
        super(props);

        this.state = { apps };
    }

    addApp = () => {
        apps[apps.length] = { name: 'EEE', title: 'AAA' };
        this.setState({ apps });
    }

    render() {
        return (
            <ul className="apps">
                {
                    this.state.apps.map((item) => (
                        <li>
                            <div className="header">
                                <p className="smaller lighter green">
                                    {item.title}
                                </p>
                            </div>
                            <div className="body">
                                <div className="pull-left">
                                    名称
                                </div>
                                <div>
                                    {item.name}
                                </div>
                            </div>
                            <div className="footer">
                                <div className="col-xs-6">
                                    <button className="btn btn-primary btn-block">编辑</button>
                                </div>
                                <div className="col-xs-6">
                                    <button className="btn btn-success btn-block">详细</button>
                                </div>
                            </div>
                        </li>
                    ))

                }
                <li>
                    <div className="header">
                        <p className="smaller lighter green">
                            添加应用
                        </p>
                    </div>
                    <div style={{ paddingLeft: '50px' }} onClick={this.addApp}>
                        <i className="icon-plus" style={{ fontSize: '120px' }}></i>
                    </div>
                </li>
            </ul>
        );
    }
}


export = ApplicationsPage;