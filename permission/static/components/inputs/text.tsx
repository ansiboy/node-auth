import React = require("react");
import { InputControl, InputControlProps } from "./input-control";
import { rules } from "maishu-dilu";

interface InputFieldProps<T> extends InputControlProps<T> {
    placeholder?: string, type?: 'text' | 'password',
    dataType: 'string' | 'number',
}

interface InputFieldState {
    value?: string | number
}

export class TextInput<T> extends InputControl<T, InputFieldProps<T>, InputFieldState> {
    input: HTMLInputElement;

    constructor(props) {
        super(props)

        this.state = {}
        if (this.props.dataType == "number") {
            this.props.validateRules.push(rules.numeric("请输入数字"));
        }
    }
    get value(): InputFieldState["value"] {
        return this.state.value;
    }
    set value(value: InputFieldState["value"]) {
        this.setState({ value })
    }
    render() {
        let { dataField, placeholder, dataType } = this.props;
        let { value } = this.state;
        return <input name={name || dataField as string} className="form-control"
            placeholder={placeholder} type={this.props.type}
            value={value || ""}
            ref={e => this.input = e || this.input}
            onChange={e => {
                if (dataType == "number") {
                    if (!rules.numeric().validate(e.target.value))
                        return;

                    var integerRegex = /^\d+$/;
                    let value = integerRegex.test(e.target.value) ? parseInt(e.target.value) : parseFloat(e.target.value);
                    this.setState({ value })
                }
                this.setState({ value: e.target.value })
            }} />
    }
}

