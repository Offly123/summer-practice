'use server'

import { cookies } from "next/headers";

import { decodeJWT, isValideJWT, JWT } from "../jwt";
import { connectToDB } from "../db";

export async function POST(req: Request): Promise<Response> {

    const cookieStore = await cookies();

    // Получаем JWT из куков
    const clientJwt: string | undefined = cookieStore.get('session')?.value;
    if (!clientJwt) {
        return new Response(JSON.stringify({error: true}));
    }

    // Декодируем JWT и проверяем его валидность
    const decodedJwt: JWT = decodeJWT(clientJwt);
    const jwtSecret: string | undefined = process.env.JWTSECRET;

    if (!isValideJWT(decodedJwt, jwtSecret)) {
        cookieStore.delete('session');
        return new Response(JSON.stringify({error: true}));
    }



    const connection: any = await connectToDB();



    const sqlGetData = `
    SELECT client_login, client_password, first_name, last_name, phone_number, email, gender FROM clients
    WHERE client_id=?
    `;
    let userData;
    try {
        userData = await connection.execute(sqlGetData, [decodedJwt.payload.clientId]);
        userData = userData[0][0];
    } catch (err) {
        return new Response(JSON.stringify({error: true}));
    }



    connection.end();

    return new Response(JSON.stringify(userData));
}