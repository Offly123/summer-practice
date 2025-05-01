'use server'

interface FieldResponse {
    error: boolean,
    message: string,
    got: string
}

export interface FormResponse {     
    [key: string]: FieldResponse
}

export async function POST(req: Request): Promise<Response> {
    const formData = await req.json();

    let res: FormResponse = {};

    if (!(/^[а-яА-ЯеЁ\s-]+$/).test(formData.first_name)) {
        res = {
            ...res, first_name: {
                error: true, 
                message: 'Имя может содержать только кириллические буквы, пробелы и тире',
                got: formData.first_name
            }
        };
    }

    if (!(/^[а-яА-ЯеЁ\s-]+$/).test(formData.last_name)) {
        res = {
            ...res, last_name: {
                error: true, 
                message: 'Фамилия может содержать только кириллические буквы, пробелы и тире',
                got: formData.last_name
            }
        };
    }

    if (!(/^[0-9]+$/).test(formData.phone_number)) {
        res = {
            ...res, phone_number: {
                error: true, 
                message: 'Номер телефона может содержать только цифры'
            }
        };
    }

    if (!(/^[0-9a-zA-Z\-_]+@[0-9a-zA-Z\-_]+\.[0-9a-zA-Z\-_]+$/).test(formData.email)) {
        res = {
            ...res, email: {
                error: true, 
                message: 'Адрес должен быть формата some@mail.com'
            }
        };
    }

    return new Response(JSON.stringify(res));
}
