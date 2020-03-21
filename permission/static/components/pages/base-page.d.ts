import React = require("react");
export declare abstract class BasePage<P = {}, S = {}> extends React.Component<P, S> {
    constructor(props: any);
    renderToolbarLeft(): React.ReactElement[];
    renderToolbarRight(): React.ReactElement[];
}
