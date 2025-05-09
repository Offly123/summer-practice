'use server'

import { cookies } from 'next/headers';

import { getSHA256, connectToDB, showDBError } from '../db';
import { createJWT } from '../jwt';

interface LoginData {
    client_login: string,
    client_password: string
}


export async function POST(req: Request): Promise<Response> {
    const loginData: LoginData = await req.json();

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
        answerDB = await connection.execute(sqldbHash, [loginData.client_login]);
        answerDB = answerDB[0][0];
    } catch (err) {
        return await showDBError(connection, err);
    }
    


    connection.end();

    // Если неправильный логин/пароль - возвращаем ошибку
    if (!answerDB || 
        !loginData.client_password || 
        isEmpty(loginData.client_password) || 
        getSHA256(loginData.client_password) !== answerDB.client_password
    ) {
        return new Response(JSON.stringify({client_password: {
            error: true,
            message: 'Неправильный логин или пароль'
        }}))
    }



    // Получаем куки (или чё-то подобное)
    const cookieStore = await cookies();

    // Генерируем JWT и вставляем в куки
    const clientId = answerDB.client_id;
    const jwtLifeTime = 60 * 60 * 24 * 14; // 2 недели
    const jwtSecret: any = process.env.JWTSECRET;
    const JWT = createJWT({clientId: clientId}, jwtSecret, jwtLifeTime);
    cookieStore.set('client_session', JWT, {httpOnly: true, maxAge: jwtLifeTime, path: '/'});

    return new Response(JSON.stringify({}));
}


const isEmpty = (obj: Object) => {
    return Object.keys(obj).length === 0;
}
