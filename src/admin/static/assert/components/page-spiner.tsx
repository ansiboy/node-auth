import React = require("react");
interface Props extends React.Props<PageSpiner> {
    load: () => Promise<any>
}

interface State {
    status: 'Loading' | 'LoadSuccess' | 'LoadFail'
}

export let PageSpinerContext = React.createContext({ result: null })

export class PageSpiner extends React.Component<Props, State> {
    loadResult: any;
    constructor(props) {
        super(props)

        this.state = { status: 'Loading' }
    }

    componentDidMount() {
        this.load()
    }
    load() {
        this.setState({ status: 'Loading' })
        return this.props.load().then(o => {
            this.loadResult = o
            this.setState({ status: 'LoadSuccess' })
        }).catch(o => {
            console.error(o)
            this.setState({ status: 'LoadFail' })
        })
    }
    render() {
        let { status } = this.state
        switch (status) {
            case 'Loading':
                return <div className="loading">
                    <i className="icon-spinner icon-spin" style={{ marginRight: 4 }} />
                    <span>数据正在加载中</span>
                </div>
            case 'LoadSuccess':
                return <PageSpinerContext.Provider value={{ result: this.loadResult }}>
                    {this.props.children}
                </PageSpinerContext.Provider>
            case 'LoadFail':
                return <div className="load-fail">
                    <div onClick={() => this.load()}>
                        数据加载失败，点击重新加载
                    </div>
                </div>
        }
    }
}