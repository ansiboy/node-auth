import React = require("react");
import { DataSource } from "maishu-wuzhui";
import { Rule } from "maishu-dilu";
import { InputControl } from "./inputs/input-control";
declare type BeforeSave<T> = (dataItem: T) => Promise<any>;
export interface ValidateDataField {
    validateRules?: Rule[];
}
export declare let ItemDialogContext: React.Context<{
    controlCreated: (ctrl: InputControl<any, any, {}>) => void;
}>;
export interface Dialog<T> {
    show: (args: T) => void;
}
export declare function createItemDialog<T>(dataSource: DataSource<T>, name: string, child: React.ReactElement, beforeSave?: BeforeSave<T>): Dialog<T>;
export interface ValidateDataField {
    validateRules?: Rule[];
}
export {};
