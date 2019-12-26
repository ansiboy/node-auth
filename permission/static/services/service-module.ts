import { Service } from "maishu-chitu-admin/static";
import { errors } from "errors";

export class ServiceModule {
    service: Service & { baseUrl: string };
    getByJson: Service["getByJson"];
    postByJson: Service["postByJson"];
    get: Service["get"];
    post: Service["post"];

    constructor(service: ServiceModule["service"]) {
        this.service = service;
        this.getByJson = this.service.getByJson.bind(this.service);
        this.postByJson = this.service.postByJson.bind(this.service);
        this.get = this.service.get.bind(this.service);
        this.post = this.service.post.bind(this.service);
    }

    protected url(path: string) {
        if (!this.service.baseUrl)
            throw errors.serviceUrlCanntNull('permissionService')

        return `${this.service.baseUrl}${path}`
    }
}