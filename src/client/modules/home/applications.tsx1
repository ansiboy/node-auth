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

class ApplicationsPage extends chitu.Page {
    constructor(params) {
        super(params);
        this.load.add(this.page_load);
    }

    private page_load(sender: chitu.Page, args) {
        let appListElement = document.createElement('div');
        sender.element.appendChild(appListElement);
        ReactDOM.render(React.createElement(PageView), appListElement);
    }
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

interface App {
    title: string,
    name: string
}

class PageView extends React.Component<{}, { apps: App[] }>{
    constructor(props) {
        super(props);

        this.state = { apps };
        window.setTimeout(() => {
            this.addApp();
        }, 500);
    }

    addApp = () => {
        let state = (this.refs["dialog"] as Dialog).state;
        state.showModal = true;
        state.title = '添加应用';
        (this.refs["dialog"] as Dialog).setState(state);
    }

    render() {
        return (
            <ul className="apps">
                {
                    this.state.apps.map((item) => (
                        <li key={guid() }>
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
                    <Dialog key={guid() } ref="dialog" ></Dialog>
                </li>
            </ul>
        );
    }
}


export = ApplicationsPage;