'use server'

import { cookies } from "next/headers";

import { JWT, decodeJWT, isValideJWT } from "../jwt";
import { connection } from "next/server";
import { connectToDB, showDBError } from "../db";

export async function POST(res: Response): Promise<Response> {
    const cookieStore = await cookies();

    // Получаем JWT из куков
    const clientJwt: string | undefined = cookieStore.get('client_session')?.value;
    if (!clientJwt) {
        return new Response(JSON.stringify({error: true, message: 'No jwt'}));
    }

    // Декодируем JWT и проверяем его валидность
    const decodedJwt: JWT = decodeJWT(clientJwt);
    const jwtSecret: string | undefined = process.env.JWTSECRET;

    if (!isValideJWT(decodedJwt, jwtSecret)) {
        cookieStore.delete('client_session');
        return new Response(JSON.stringify({error: true, message: 'Invalid jwt'}));
    }


    // Подключение к БД
    const connection = await connectToDB();
    if (connection.type === Response) {
        return connection;
    }



    // Получаем список заказов для клиента
    const sqlGetOrders = `
    SELECT
    client_id, order_date, order_address, order_status, amount, product_id
    FROM orders o 
    JOIN ordered_products op ON o.order_id=op.order_id
    WHERE client_id=?;
    `;
    const clientId = decodedJwt.payload.clientId;
    let orderList;
    try {
        orderList = (await connection.execute(sqlGetOrders, [clientId]))[0];
    } catch(err) {
        return await showDBError(connection, err);
    }



    connection.end();



    return new Response(JSON.stringify(orderList));
}