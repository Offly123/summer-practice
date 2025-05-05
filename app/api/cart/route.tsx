'use server'

import { connectToDB, showDBError } from "../db"
import { Product } from "$/ProductCard";

interface DBProduct {
    product_id: string,
    product_name: string,
    cost: string,
    src: string,
    product_description: string
}

export async function POST(req: Request): Promise<Response> {
    let cartData;

    // Если кривой запрос кидаем ошибку
    try {
        cartData = await req.json();
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify([{empty: true}]));
    }

    // Много всяких непонятных но нужных проверок
    if (cartData.empty || cartData === '[]') {
        return new Response(JSON.stringify([{empty: true}]));
    }
    if (cartData.constructor !== Object) {
        cartData = JSON.parse(cartData);
    }
    if (cartData.constructor !== Array) {
        cartData = [cartData]
    }



    const connection = await connectToDB();
    if (connection.type === Response) {
        return connection;
    }


    
    let dbProductList: Array<any> = [];
    const sqlProductList = `
    SELECT * FROM products
    WHERE product_id=?
    `;
    try {
        const promises = cartData.map(async (productId: number) => {
            let productInfo = await connection.execute(sqlProductList, [productId]);
            return productInfo[0][0]
        });
        dbProductList = await Promise.all(promises);
    } catch (err) {
        return await showDBError(connection, err);
    }



    connection.end();


    
    const productList = toProductInterface(dbProductList);

    return new Response(JSON.stringify(productList));
}

const toProductInterface = (dbResponse: any): Product[] => {
    let productList: Product[] = [];
    dbResponse.forEach((prod: DBProduct, index) => {
        productList = [
            ...productList, {
                render_id: index,
                id: prod.product_id,
                name: prod.product_name,
                cost: prod.cost,
                src: prod.src,
                description: prod.product_description
            }
        ];
    });

    return productList;
}