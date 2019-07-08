import { AuthDataContext } from "../dataContext";
import { Path } from "../entities";
export declare class PathController {
    list(dc: AuthDataContext): Promise<Path[]>;
    add(dc: AuthDataContext, { item }: {
        item: Path;
    }): Promise<Partial<Path>>;
    update(dc: AuthDataContext, { item }: {
        item: Path;
    }): Promise<Partial<Path>>;
    remove(dc: AuthDataContext, { id }: {
        id: any;
    }): Promise<Partial<Path>>;
}
