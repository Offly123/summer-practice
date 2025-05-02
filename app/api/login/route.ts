'use server'

import mysql from 'mysql2/promise';
import { cookies } from 'next/headers';

import { FormData } from '$/Form';

import { getSHA256, connectToDB } from '../db';
import { createJWT } from '../jwt';


export async function POST(req: Request): Promise<Response> {
    const loginData: Object = await req.json();

    const connection = await connectToDB();

    if (connection.type === Response) {
        return connection;
    }



    let answerDB;
    const sqldbHash = `
    SELECT client_password, client_id FROM clients
    WHERE client_login=?
    `;
    try {
        answerDB = await connection.execute(sqldbHash, [loginData.login]);
    } catch (err) {
        return new Response(JSON.stringify({ssdfg: {
            error: true,
            message: 'Что-то пошло не так'
        }}))
    }
    


    connection.end();

    // Если неправильный логин/пароль - возвращаем ошибку
    if (!loginData.client_password || isEmpty(loginData.client_password) || getSHA256(loginData.client_password) !== answerDB[0][0].client_password) {
        return new Response(JSON.stringify({client_password: {
            error: true,
            message: 'Неправильный логин или пароль'
        }}))
    }



    // Получаем куки (или чё-то подобное)
    const cookieStore = await cookies();

    // Генерируем JWT и вставляем в куки
    const clientId = answerDB[0][0].client_id;
    const jwtLifeTime = 60 * 60 * 24 * 14; // 2 недели
    const jwtSecret: any = process.env.JWTSECRET;
    const JWT = createJWT({clientId: clientId}, jwtSecret, jwtLifeTime);
    cookieStore.set('session', JWT, {httpOnly: true, maxAge: jwtLifeTime, path: '/'});

    return new Response(JSON.stringify({}));
}


const isEmpty = (obj: Object) => {
    return Object.keys(obj).length === 0;
}
