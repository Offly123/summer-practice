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

export async function GET(req: Request): Promise<Response> {

    const connection = await connectToDB();
    if (connection.type === Response) {
        return connection;
    }

    let dbProductList: DBProduct;
    const sqlProductList = `
    SELECT * FROM products
    `;
    try {
        dbProductList = await connection.execute(sqlProductList);
        dbProductList = dbProductList[0];
    } catch (err) {
        return await showDBError(connection, err);
    }

    const productList = toProductInterface(dbProductList)

    return new Response(JSON.stringify(productList));
}

const toProductInterface = (dbResponse: any): Product[] => {
    let productList: Product[] = [];
    dbResponse.forEach((prod: DBProduct) => {
        productList = [
            ...productList, {
                render_id: 1,
                id: prod.product_id,
                name: prod.product_name,
                cost: prod.cost,
                src: prod.src,
                description: prod.product_description,
            }
        ];
    });

    return productList;
}