import React = require("react");
import { guid } from "maishu-chitu-service";
import { ValidateDataField, ItemDialogContext } from "../item-dialog";

export interface InputControlProps<T> extends ValidateDataField {
    dataField: keyof T,
}

export abstract class InputControl<T, P extends InputControlProps<T> = InputControlProps<T>, S = {}> extends React.Component<P, S> {

    static defaultProps: InputControlProps<any> = { validateRules: [] } as InputControlProps<any>;

    abstract set value(value: any);
    abstract get value(): any;

    id = guid();

    constructor(props: InputControl<T, P>["props"]) {
        super(props);

        let render = this.render;
        this.render = () => {
            return <ItemDialogContext.Consumer>
                {args => {
                    args.controlCreated(this);
                    return render.apply(this)
                }}
            </ItemDialogContext.Consumer>
        }
    }
}