
class ObjectTraver {
    private obj;

    constructor(obj) {
        this.obj = obj;
    }

    execute(): any {
        return this.visit(this.obj);
    }

    protected visitField() {

    }

    protected visitArray(obj: Array<any>): any {
        let result = [];
        for (let i = 0; i < (obj as []).length; i++) {
            result[i] = this.visit(obj[i]);
        }
        return result;
    }

    protected visitNumber(obj: number): any {
        return obj;
    }

    protected visitObject(obj: Object) {
        let result = {};
        for (let key in obj) {
            result[key] = this.visit(obj[key]);
        }
        return result;
    }

    protected visit(obj): Object {
        if ($.isArray(obj)) {
            return this.visitArray(obj);
        }
        else if ($.isPlainObject(obj)) {
            return this.visitObject(obj);
        }
        else if ($.isNumeric(obj)) {
            return this.visitNumber(obj);
        }
        else if (typeof obj == 'string') {
            return obj;
        }
        else {
            throw 'not implment';
        }
    }
}

class MyObjectTraver extends ObjectTraver {
    constructor(obj) {
        super(obj);
    }

    protected visitObject(obj) {
        let result = {};
        for (let key in obj) {
            let value = this.visit(obj[key]);;
            if (key == '_id') {
                result['id'] = value;
            }
            else {
                result[key] = this.visit(obj[key]);
            }
        }
        return result;
    }
}


let HTTP = 'http://';
const HTTP_LENGTH = 7;
let host = 'http://localhost:3000/';
export function ajax<T>(url: string, data?: any): JQueryDeferred<T> {

    if (url.length < HTTP_LENGTH || url.substr(0, HTTP.length) != HTTP) {
        url = host + url;
    }

    let result = $.Deferred<T>();
    data = data || {};
    $.ajax(url, {
        data: data
    }).done(function (data) {
        let d = new MyObjectTraver(data).execute();
        result.resolve(d);
    });

    return result;
}