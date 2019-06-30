import React = require("react");
import { MenuItem } from "maishu-services-sdk";
import { ItemPageProps } from "../../data-component/index";
interface Props extends ItemPageProps<MenuItem> {
    mode: 'new' | 'edit' | 'readonly';
}
interface State {
    checkedChildren: string[];
}
export default class ResourceAdd extends React.Component<Props, State> {
    private operationField;
    constructor(props: any);
    render(): JSX.Element;
}
export {};
