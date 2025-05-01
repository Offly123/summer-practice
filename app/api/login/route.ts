'use server'

export interface FieldResponse {
    error: boolean,
    message: string
}

export interface FormResponse {
    [key: string]: FieldResponse
}

export async function POST(req: Request): Promise<Response> {
    const formData = await req.json();

    let res: FormResponse = {};

    if (formData.password !== 'nimda') {
        res = {
            ...res, password: {
                error: true, 
                message: 'Неправильный пароль'
            }
        };
    }

    if (formData.login !== 'admin') {
        res = {
            ...res, login: {
                error: true, 
                message: 'Неправильный логин'
            }
        };
    }

    return new Response(JSON.stringify(res));
}
