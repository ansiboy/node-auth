import { DataSource } from "maishu-wuzhui";
import { ListPageProps } from "data-component/list-page";
import { Resource } from "maishu-services-sdk";
export declare function operationField<T extends Entity>(props: ListPageProps, dataSource: DataSource<T>, width?: string, callback?: (dataItem: T, resource: Resource) => void): import("../../../../../node_modules/maishu-wuzhui/out/index").CustomField<unknown>;
