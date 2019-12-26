import React = require("react");
import { guid } from "maishu-chitu-service";
import { ValidateDataField } from "../item-dialog";

export interface InputControlProps<T> extends ValidateDataField {
    dataField: keyof T,
}

export interface InputControlState {
    value?: any,
}

export interface ItemDialog {
    inputControls: InputControl<any>[]
}

export abstract class InputControl<T, P extends InputControlProps<T> = InputControlProps<T>,
    S extends InputControlState = InputControlState> extends React.Component<P, S> {

    static defaultProps: InputControlProps<any> = { validateRules: [] } as InputControlProps<any>;

    id = guid();

    constructor(props: InputControl<T, P>["props"]) {
        super(props);
    }
}