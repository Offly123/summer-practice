'use client'

import TextInput from '$/TextInput';
import Form from '$/Form';


export default function Login() {

    return (
        <Form action='/api/login' headText='Вход' sendText='Отправить' successRedirect='/about/'>
            <TextInput error={false} onChange={undefined} name='login' label='Логин' type='text' />
            <TextInput error={false} onChange={undefined} name='password' label='Пароль' type='password' />
        </Form>
    )
}
