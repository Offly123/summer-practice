'use server'

import { cookies } from "next/headers";

import { decodeJWT, isValideJWT, JWT } from "../jwt";
import { connectToDB, showDBError } from "../db";
import { error } from "console";

export async function POST(req: Request): Promise<Response> {
    const orderAddress: string = (await req.json()).order_address;

    const cookieStore = await cookies();

    // Получаем JWT из куков
    const clientJwt: string | undefined = cookieStore.get('client_session')?.value;
    if (!clientJwt) {
        return new Response(JSON.stringify({error: true}));
    }

    // Декодируем JWT и проверяем его валидность
    const decodedJwt: JWT = decodeJWT(clientJwt);
    const jwtSecret: string | undefined = process.env.JWTSECRET;

    if (!isValideJWT(decodedJwt, jwtSecret)) {
        cookieStore.delete('client_session');
        return new Response(JSON.stringify({yo: {
            error: true,
            message: 'Войдите в систему для оформления заказа'
        }}));
    }


    
    // Адрес не длиннее 100 символов
    if (orderAddress.length > 100) {
        return new Response(JSON.stringify({order_address: {
            error: true,
            message: 'Адрес не длиннее 100 символов'
        }}));
    }


    const connection = await connectToDB();
    if (connection.type === Response) {
        return connection;
    }
    connection.beginTransaction();



    // Создание заказа
    const clientId = decodedJwt.payload.clientId;
    const sqlCreateOrder = `
    INSERT IGNORE INTO orders
    (client_id, order_date, order_address, order_status)
    VALUES (?, ?, ?, 'created');
    `;
    const createOrder = [
        clientId, new Date(), orderAddress
    ];
    let orderId;
    try {
        orderId = await connection.execute(sqlCreateOrder, createOrder);
        orderId = orderId[0].insertId;
    } catch (err) {
        return await showDBError(connection, err);
    }

    

    // Добавление заказанных продуктов
    const sqlInsertProducts = `
    INSERT IGNORE INTO ordered_products
    (order_id, product_id, amount)
    VALUES (?, ?, ?);
    `;
    const cartString: string | undefined = cookieStore.get('cart')?.value;
    // В теории это невозможно но просто вот пусть будет
    if (!cartString) {
        return new Response(JSON.stringify({sssdfg: {
            error: true,
            message: 'Вы ничего не заказали'
        }}));
    }
    // Список продуктов из куки
    let cartList: Object = {};
    JSON.parse(cartString).forEach((productId) => {
        if (!cartList[productId]) {
            cartList[productId] = 1;
        } else {
            cartList[productId]++;
        }
    });
    //temp
    console.log('\n\n\n');
    try {
        const promises = Object.keys(cartList).map((product_id) => {
            const sqlInsertData = [
                orderId, product_id, cartList[product_id]
            ];
            return connection.execute(sqlInsertProducts, sqlInsertData);
        });
        Promise.all(promises);
    } catch(err) {
        return await showDBError(connection, err);
    }



    connection.commit();
    connection.end();


    return new Response(JSON.stringify({}));
}
