'use server'

import { connectToDB } from "../db"
import { Product } from "$/ProductCard";

interface DBProduct {
    product_name: string,
    cost: number,
    src: string,
    procuct_description: string
}

export async function GET(req: Request): Promise<Response> {

    const connection = await connectToDB();
    if (connection.type === Response) {
        return connection;
    }

    let dbProductList: DBResponse;
    const sqlProductList = `
    SELECT product_name, cost, src, product_description FROM products
    `;
    try {
        dbProductList = await connection.execute(sqlProductList);
        dbProductList = dbProductList[0];
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({error: true}));
    }

    const productList = toProductInterface(dbProductList)

    return new Response(JSON.stringify(productList));
}

const toProductInterface = (dbResponse: any): Product[] => {
    let productList: Product[] = [];
    dbResponse.forEach((prod: DBProduct) => {
        productList = [
            ...productList, {
                name: prod.product_name,
                cost: prod.cost,
                src: prod.src,
                description: prod.product_description
            }
        ];
    });

    return productList;
}