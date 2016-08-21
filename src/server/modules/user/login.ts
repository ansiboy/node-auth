import { Database } from './../../database';

export async function execute(args: { username: string, password: string }) {
    let username = args.username;
    let password = args.password;
    let appToken = ''; 
    let db = await Database.createInstance(appToken);
}