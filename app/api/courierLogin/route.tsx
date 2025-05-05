'use server'

import { cookies } from 'next/headers';

import { getSHA256, connectToDB, showDBError } from '../db';
import { createJWT } from '../jwt';

interface CourierLoginData {
    courier_login: string,
    courier_password: string
}


export async function POST(req: Request): Promise<Response> {
    const loginData: CourierLoginData = await req.json();

    console.log(loginData);

    const connection = await connectToDB();

    if (connection.type === Response) {
        return connection;
    }



    let answerDB;
    const sqldbHash = `
    SELECT courier_password FROM couriers
    WHERE courier_login=?
    `;
    try {
        answerDB = await connection.execute(sqldbHash, [loginData.courier_login]);
        answerDB = answerDB[0][0];
    } catch (err) {
        return await showDBError(connection, err);
    }
    


    connection.end();

    // Если неправильный логин/пароль - возвращаем ошибку
    if (!answerDB || 
        !loginData.courier_password || 
        isEmpty(loginData.courier_password) || 
        getSHA256(loginData.courier_password) !== answerDB.courier_password
    ) {
        return new Response(JSON.stringify({courier_password: {
            error: true,
            message: 'Неправильный логин или пароль'
        }}))
    }



    // Получаем куки (или чё-то подобное)
    const cookieStore = await cookies();

    // Генерируем JWT и вставляем в куки
    const clientId = answerDB.client_id;
    const jwtLifeTime = 60 * 60 * 24; // 1 день
    const jwtSecret: any = process.env.JWTSECRET;
    const JWT = createJWT({clientId: clientId}, jwtSecret, jwtLifeTime);
    cookieStore.set('courier_session', JWT, {httpOnly: true, maxAge: jwtLifeTime, path: '/'});

    return new Response(JSON.stringify({}));
}


const isEmpty = (obj: Object) => {
    return Object.keys(obj).length === 0;
}
