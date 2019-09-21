import React = require("react");
import { PageProps } from "maishu-chitu-react";

interface Props extends PageProps {
    data: {
        target: string
    }
}

export default class OuterPage extends React.Component<Props> {
    private element: HTMLElement;

    updateSize() {
        this.element.style.height = `${window.innerHeight - 100}px`;
    }
    componentDidMount() {
        this.updateSize();
        window.addEventListener("change", () => {
            this.updateSize();
        })
    }
    render() {
        return <iframe style={{ width: "100%", border: "none" }} ref={e => this.element = e || this.element}
            src={this.props.data.target || ""}>

        </iframe>
    }
}