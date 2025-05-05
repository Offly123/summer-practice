'use server'
import { cookies } from 'next/headers';

import { FormData } from '$/Form';

import { getSHA256, connectToDB, showDBError } from '../db';
import { createJWT } from '../jwt';


interface RegistrationData {
    client_login: string,
    client_password: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
    gender: string
}

export async function POST(req: Request): Promise<Response> {
    const registrationData: RegistrationData = await req.json();
    
    
    const errorList = await getErrorList(registrationData);

    if (!isEmpty(errorList)) {
        return new Response(JSON.stringify(errorList));
    }



    let connection = await connectToDB();
    if (connection.type === Response) {
        return connection;
    }
    


    connection.beginTransaction();



    // Вставка данных пользователя в БД
    const sqlInsertRegistration = `
    INSERT IGNORE INTO clients 
    (client_login, client_password, first_name, last_name, phone_number, email, gender) 
    values (?, ?, ?, ?, ?, ?, ?)
    `;
    const insertRegistration = [
        registrationData.client_login,
        getSHA256(registrationData.client_password),
        registrationData.first_name, 
        registrationData.last_name,
        registrationData.phone_number,
        registrationData.email,
        registrationData.gender
    ];

    let DBResponse;
    try {
        DBResponse = await connection.execute(sqlInsertRegistration, insertRegistration);
    } catch (err) {
        return await showDBError(connection, err);
    }



    connection.commit();
    connection.end();

    // Получаем куки (или чё-то подобное)
    const cookieStore = await cookies();


    // Получаем вставленный айди клиента и создаём JWT, 
    // вставляем его в куки как session
    const clientId = DBResponse[0].insertId;
    const jwtLifeTime = 60 * 60 * 24 * 14; // 2 недели
    const jwtSecret: any = process.env.JWTSECRET;
    const JWT = createJWT({clientId: clientId}, jwtSecret, jwtLifeTime);
    cookieStore.set('client_session', JWT, {httpOnly: true, maxAge: jwtLifeTime, path: '/'});

    return new Response(JSON.stringify({}));
}


export const getErrorList = async (registrationData: RegistrationData): Promise<FormData> => {

    let errorList: FormData = {};

    if (!(/^[a-zA-Z0-9_]+$/).test(registrationData.client_login)) {
        errorList = {
            ...errorList, client_login: {
                error: true, 
                message: 'Логин должен состоять только из букв латинского алфавита, цифр и _'
            }
        };
    }

    if ( !(/^[a-zA-Z0-9_]+$/).test(registrationData.client_password) || (registrationData.client_password.length < 8) ) {
        errorList = {
            ...errorList, client_password: {
                error: true, 
                message: 'Пароль должен состоять только из букв латинского алфавита, цифр и _'
            }
        };
    }

    if (!(/^[а-яА-ЯёЁ\-]+$/).test(registrationData.first_name)) {
        errorList = {
            ...errorList, first_name: {
                error: true, 
                message: 'Имя может содержать только кириллические буквы и тире'
            }
        };
    }

    if (!(/^[а-яА-ЯёЁ\s-]+$/).test(registrationData.last_name)) {
        errorList = {
            ...errorList, last_name: {
                error: true, 
                message: 'Фамилия может содержать только кириллические буквы и тире'
            }
        };
    }

    if (!(/^[0-9]+$/).test(registrationData.phone_number)) {
        errorList = {
            ...errorList, phone_number: {
                error: true, 
                message: 'Номер телефона может содержать только цифры'
            }
        };
    }

    if (!(/^[0-9a-zA-Z\-\._]+@[0-9a-zA-Z\-_]+\.[0-9a-zA-Z\-_]+$/).test(registrationData.email)) {
        errorList = {
            ...errorList, email: {
                error: true, 
                message: 'Адрес должен быть формата some@mail.com'
            }
        };
    }

    if (registrationData.gender !== 'male' && registrationData.gender !== 'female') {
        errorList = {
            ...errorList, gender: {
                error: true,
                message: 'Укажите ваш пол'
            }
        }
    }

    return errorList;
}


const isEmpty = (obj: Object) => {
    return Object.keys(obj).length === 0;
}