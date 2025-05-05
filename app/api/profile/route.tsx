'use server'

import { cookies } from "next/headers";

import { JWT, decodeJWT, isValideJWT } from "../jwt";
import { connection } from "next/server";
import { connectToDB, showDBError } from "../db";

interface Order {
    order_id: number,
    order_date: Date,
    order_address: string,
    order_status: string,
    cost: number
    product_list: OrderedProducts[]
}

interface OrderedProducts {
    product_id: number,
    product_name: string,
    amount: number,
    product_description: string
    src: string,
}

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
    o.order_id, order_date, order_address, order_status, amount, product_name, cost, src, product_description
    FROM orders o 
    JOIN ordered_products op ON o.order_id=op.order_id
    JOIN products p ON p.product_id=op.product_id
    WHERE client_id=?
    `;
    const clientId = decodedJwt.payload.clientId;
    let orderList;
    try {
        orderList = (await connection.execute(sqlGetOrders, [clientId]))[0];
    } catch(err) {
        return await showDBError(connection, err);
    }

    
    // Оставь надежду всяк сюда входящий
    let orderListBeautiful: Order[];
    orderList.forEach((order) => {
        // Если не вставлено ни одного заказа
        if (!orderListBeautiful) {
            orderListBeautiful = [{
                order_id: order.order_id,
                order_date: order.order_date,
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



    connection.end();



    return new Response(JSON.stringify(orderListBeautiful));
}

const getIndexByOrderId = (orderList: Order[], order_id: number) => {
    let ii = -1;
    orderList.forEach((order, index) => {
        console.log('foreach order: ' + JSON.stringify(order));
        if (order.order_id === order_id) {
            console.log('INSIDE IF INDEX ' + index);
            ii = index;
        }
    });


    return ii;
}


// if (!orderListBeautiful || !orderListBeautiful.length) {
//     orderListBeautiful = [{
//         order_id: order.order_id,
//         order_date: order.order_date,
//         order_address: order.order_address,
//         order_status: order.order_status,
//         cost: orderListBeautiful ? 
//                 orderListBeautiful.cost ? orderListBeautiful.cost + order.cost * order.amount : 
//                     order.cost * order.amount : 
//                 order.cost * order.amount,
//         product_list: orderListBeautiful ? [
//             ...orderListBeautiful.product_list, {
//                 product_id: order.product_id,
//                 product_name: order.product_name,
//                 amount: order.amount,
//                 product_description: order.product_description,
//                 src: order.src,
//             }
//         ] : [ {
//                 product_id: order.product_id,
//                 product_name: order.product_name,
//                 amount: order.amount,
//                 product_description: order.product_description,
//                 src: order.src,
//         } ]
//     }]
// } else {
    
// }