import React = require("react");
import { Application } from "../application";

export interface MasterPageProps {
    app: Application
}

export interface MasterPageConstructor {
    new(props: MasterPageProps): MasterPage<any>
}

export abstract class MasterPage<S> extends React.Component<MasterPageProps, S> {
    constructor(props: MasterPageProps) {
        super(props)
    }

    abstract get name(): string;

    abstract get pageContainer(): HTMLElement;
    abstract get element(): HTMLElement;
}

