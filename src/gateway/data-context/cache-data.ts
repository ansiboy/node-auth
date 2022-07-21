import { Repository } from "maishu-node-data";
import { errors } from "../errors";
import NodeCache = require("node-cache");

type CacheItem = { id: string, applicationId?: string };
export class CacheData<T extends CacheItem>{

    private nodeCache: NodeCache;
    private repository: Repository<T>;

    private constructor(repository: Repository<T>) {
        this.nodeCache = new NodeCache();
        this.repository = repository;
    }

    async init() {
        let items = await this.repository.find();
        items.forEach(item => this.nodeCache.set(item.id, item));
    }

    async item(id: string): Promise<T | undefined | null> {
        if (!id) throw errors.argumentNull("id");

        let item = this.nodeCache.get<T | null>(id);
        if (item === undefined) {
            item = await this.repository.findOne({ where: { id } });
        }
        return item;
    }

    async insert(item: Partial<T>) {
        if (!item.id)
            throw errors.argumentFieldNull("id", "item");

        await this.repository.insert(item as any);
        this.nodeCache.set(item.id, item);
    }

    async update(item: Partial<T>) {
        if (!item) throw errors.argumentNull("item");
        if (!item.id) throw errors.argumentFieldNull("id", "item");

        let originalItem = await this.repository.findOne(item.id);
        if (!originalItem)
            throw errors.objectNotExistWithId(item.id, "item");

        this.nodeCache.del(originalItem.id);
        await this.repository.save(item as any);

        this.nodeCache.set(item.id, item);
    }

    async delete(id: string) {
        if (!id) throw errors.argumentNull("id");

        await this.repository.delete(id);
        this.nodeCache.del(id);
    }

    async all() {
        let keys = this.nodeCache.keys();
        let items = keys.map(k => this.nodeCache.get<T>(k)) as T[];
        return items;
    }

    static async create<T extends CacheItem>(repository: Repository<T>) {
        let obj = new CacheData<T>(repository);
        await obj.init();
        return obj;
    }
}