import { cookies } from 'next/headers';

import { connectToDB, showDBError } from '../db';
import { FormData } from '$/Form';
import { JWT, decodeJWT, isValideJWT } from '../jwt';
import { redirect } from 'next/dist/server/api-utils';
import { NextResponse } from 'next/server';

interface UpdateData {
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
}

export async function POST(req: Request): Promise<Response> {
    const updateData: UpdateData = await req.json();

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



    // Валидация введённых данных
    const errorList = await getErrorList(updateData);
    if (!isEmpty(errorList)) {
        return new Response(JSON.stringify(errorList));
    }


    // Подключение к БД
    const connection = await connectToDB();
    if (connection.type === Response) {
        return connection;
    }



    connection.beginTransaction();



    const sqlUpdateInfo = `
    UPDATE clients
    SET first_name=?, last_name=?, phone_number=?, email=?
    WHERE client_id=?
    `;
    const updateInfo = [
        updateData.first_name, 
        updateData.last_name, 
        updateData.phone_number, 
        updateData.email, 
        decodedJwt.payload.clientId
    ];
    try {
        await connection.execute(sqlUpdateInfo, updateInfo)
    } catch (err) {
        return await showDBError(connection, err);
    }



    connection.commit();
    connection.end();



    return new Response(JSON.stringify({}));
}

const getErrorList = async (updateData: UpdateData): Promise<FormData> => {

    let errorList: FormData = {};

    if (!(/^[а-яА-ЯёЁ\-]+$/).test(updateData.first_name)) {
        errorList = {
            ...errorList, first_name: {
                error: true, 
                message: 'Имя может содержать только кириллические буквы и тире'
            }
        };
    }

    if (!(/^[а-яА-ЯеЁ\s-]+$/).test(updateData.last_name)) {
        errorList = {
            ...errorList, last_name: {
                error: true, 
                message: 'Фамилия может содержать только кириллические буквы и тире'
            }
        };
    }

    if (!(/^[0-9]+$/).test(updateData.phone_number)) {
        errorList = {
            ...errorList, phone_number: {
                error: true, 
                message: 'Номер телефона может содержать только цифры'
            }
        };
    }

    if (!(/^[0-9a-zA-Z\-_]+@[0-9a-zA-Z\-_]+\.[0-9a-zA-Z\-_]+$/).test(updateData.email)) {
        errorList = {
            ...errorList, email: {
                error: true, 
                message: 'Адрес должен быть формата some@mail.com'
            }
        };
    }

    return errorList;
}

const isEmpty = (obj: Object) => {
    return Object.keys(obj).length === 0;
}