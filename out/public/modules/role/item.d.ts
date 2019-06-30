import { ItemPageProps } from "../../data-component/index";
import React = require("react");
import { Role } from "maishu-services-sdk";
import { PermissionService } from "services/permission-service";
export default class RoleItem extends React.Component<ItemPageProps<Role>> {
    ps: PermissionService;
    constructor(props: any);
    render(): JSX.Element;
}
