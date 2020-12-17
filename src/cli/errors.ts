import { Errors } from "maishu-toolkit";

class MyErrors extends Errors {
    notSupportedDatabaseType(dbType: string) {
        let msg = `Database type '${dbType}' is not supported.`;
        let error = new Error(msg);
        let name: keyof MyErrors = "notSupportedDatabaseType";
        error.name = name;
        return error;
    }
}

export let errors = new MyErrors();