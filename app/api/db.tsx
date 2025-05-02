import { createHash } from "crypto";
import mysql from 'mysql2/promise';

export function getSHA256(str: string) {
    return createHash('sha256').update(str).digest('base64url');
}

export async function connectToDB(): Promise<any> {
    let connection: any;
    try {
        connection = await mysql.createConnection({
            host:       process.env.DBHOST,
            user:       process.env.DBUSER,
            password:   process.env.DBPSWD,
            database:   process.env.DBNAME
        });
    } catch (err) {
        return new Response(JSON.stringify({ssdfg: {
            error: true,
            message: 'Что-то пошло не так'
        }}))
    }

    return connection;
}
