'use server'

import { cookies } from "next/headers";

import { decodeJWT, isValideJWT, JWT } from "../jwt";
import { connectToDB } from "../db";

export interface Order {
    error?: boolean,
    order_id: number,
    order_date: Date,
    first_name: string,
    last_name: string,
    order_address: string,
    order_status: string,
    cost: number
    product_list: OrderedProduct[]
}

export interface OrderedProduct {
    product_id: number,
    product_name: string,
    amount: number,
    product_description: string
    src: string,
}

export async function POST(req: Request): Promise<Response> {

    const cookieStore = await cookies();

    // Получаем JWT из куков
    const clientJwt: string | undefined = cookieStore.get('courier_session')?.value;
    if (!clientJwt) {
        return new Response(JSON.stringify({error: true}));
    }

    // Декодируем JWT и проверяем его валидность
    const decodedJwt: JWT = decodeJWT(clientJwt);
    const jwtSecret: string | undefined = process.env.JWTSECRET;

    if (!isValideJWT(decodedJwt, jwtSecret)) {
        cookieStore.delete('courier_session');
        return new Response(JSON.stringify({error: true}));
    }



    // Подключение к БД
    const connection: any = await connectToDB();
    if (connection.type === Response) {
        return connection;
    }



    // Получаем данные пользователя для отображения
    const sqlGetAllOrders = `
    SELECT
    c.first_name, c.last_name, o.order_id, order_date, order_address, order_status, amount, product_name, cost, src, product_description
    FROM orders o 
    JOIN clients c ON o.client_id=c.client_id
    JOIN ordered_products op ON o.order_id=op.order_id
    JOIN products p ON p.product_id=op.product_id
    ORDER BY order_status;
    `;
    let allOrdersBD;
    try {
        allOrdersBD = await connection.execute(sqlGetAllOrders);
        allOrdersBD = allOrdersBD[0];
    } catch (err) {
        return new Response(JSON.stringify({error: true}));
    }



    connection.end();



    // Оставь надежду всяк сюда входящий
    let orderListBeautiful: Order[] = [];
    allOrdersBD.forEach((order) => {
        // Если не вставлено ни одного заказа
        if (!orderListBeautiful) {
            orderListBeautiful = [...orderListBeautiful, {
                
                order_id: order.order_id,
                order_date: order.order_date,
                first_name: order.first_name,
                last_name: order.last_name,
                order_address: order.order_address,
                order_status: order.order_status,
                cost: order.cost * order.amount,
                product_list: [{
                    product_id: order.product_id,
                    product_name: order.product_name,
                    amount: order.amount,
                    product_description: order.product_description,
                    src: order.src
                }]
            }]
        // Если есть заказы и найден заказ с таким же индексом
        } else if ( getIndexByOrderId(orderListBeautiful, order.order_id) != -1 ) {
            const index = getIndexByOrderId(orderListBeautiful, order.order_id);
            orderListBeautiful[index] = {
                ...orderListBeautiful[index],
                cost: orderListBeautiful[index].cost + order.cost * order.amount,
                product_list: [
                    ...orderListBeautiful[index].product_list, {
                    product_id: order.product_id,
                    product_name: order.product_name,
                    amount: order.amount,
                    product_description: order.product_description,
                    src: order.src
                }]
            }
        // Если есть заказы, но нет заказа с таким индексом
        } else {
            orderListBeautiful = [
                ...orderListBeautiful, {
                order_id: order.order_id,
                order_date: order.order_date,
                first_name: order.first_name,
                last_name: order.last_name,
                order_address: order.order_address,
                order_status: order.order_status,
                cost: order.cost * order.amount,
                product_list: [{
                    product_id: order.product_id,
                    product_name: order.product_name,
                    amount: order.amount,
                    product_description: order.product_description,
                    src: order.src
                }]
            }]
        }
    });



    return new Response(JSON.stringify(orderListBeautiful));
}

const getIndexByOrderId = (orderList: Order[], order_id: number) => {
    let ii = -1;
    orderList.forEach((order, index) => {
        if (order.order_id === order_id) {
            ii = index;
        }
    });


    return ii;
}