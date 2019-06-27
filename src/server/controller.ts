import http = require('http')
import * as db from 'maishu-mysql-helper'


// export function action() {
//     return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
//         let method = descriptor.value as Function
//         descriptor.value = async function (args, req: http.IncomingMessage, res: http.ServerResponse) {
//             if (args.conn == null) {
//                 let application_id = args['application-id'];
//                 if (application_id == null && req != null) {
//                     application_id = req.headers['application-id']
//                 }

//                 // if (!application_id)
//                 //     throw errors.parameterRequired('application-id')

//                 args.conn = await db.getConnection(application_id)
//             }

//             if (args.conn == null)
//                 throw errors.getConnectionFail()

//             let p: Promise<any> = method.apply(this, [args, req, res])
//             if (p.then == null || p.catch == null) {
//                 args.conn.end()
//                 throw errors.actionResultNotPromise(propertyKey)
//             }

//             console.assert(args.conn != null, 'conn is null')
//             p.then(o => {
//                 (args.conn as db.Connection).end()
//                 return o
//             }).catch(o => {
//                 console.log(o)
//                 console.assert(args.conn != null);
//                 (args.conn as db.Connection).end()
//                 return o
//             })
//             return p
//         }
//     };
// }

class Errors {
    getConnectionFail(): any {
        let error = new Error('Get connection fail')
        return error
    }
    actionResultNotPromise(actionName: string): any {
        let error = new Error(`Action '${actionName}' result is not a promise.`);
        return error
    }
    arugmentNull(name: string): any {
        let error = new Error(`Argument ${name} cannt null or empty.`);
        return error
    }
    billDetailNotExists(productId: string) {
        let error = new Error(`Bill detail with product id ${productId} is not exists.`)
        return error
    }
    parameterRequired(name: string) {
        let error = new Error(`Parameter '${name}' is required.`)
        error.name = Errors.prototype.parameterRequired.name
        return error
    }
}

let errors = new Errors

