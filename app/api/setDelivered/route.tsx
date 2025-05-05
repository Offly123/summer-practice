'use server'

import { cookies } from "next/headers";

import { isValideJWT, decodeJWT, JWT } from "../jwt";
import { connectToDB, showDBError } from "../db";

export async function POST(req: Request): Promise<Response> {
    const cookieStore = await cookies();

    // Получаем JWT из куков
    const clientJwt: string | undefined = cookieStore.get('courier_session')?.value;
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


    
    
    
    const connection = await connectToDB();
    if (connection.type === Response) {
        return connection;
    }
    
    
    
    // Обновление статуса заказа
    const sqlUpdateOrder = `
    UPDATE orders SET
    order_status = 'delivered', courier_id=?
    WHERE order_id=?
    `;
    const courierId = decodedJwt.payload.courier_id;
    const orderId = (await req.json()).order_id;
    try {
        await connection.execute(sqlUpdateOrder, [courierId, orderId]);
    } catch (err) {
        return await showDBError(connection, err);
    }

    console.log(orderId);

    return new Response('delivered');
}