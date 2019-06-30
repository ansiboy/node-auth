import { ListPageProps } from "data-component/list-page";
import { Resource } from "maishu-services-sdk";
import { DataSources } from "dataSources";
export declare function operationField<T extends Entity>(props: ListPageProps, objectType: keyof DataSources, width?: string, callback?: (dataItem: T, resource: Resource) => void): import("../../../../node_modules/maishu-wuzhui/out/index").CustomField<unknown>;
