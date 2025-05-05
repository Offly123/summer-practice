'use client'

import Loading from '$/Loading';
import Form from '$/Form';
import TextInput from '$/TextInput';


export default function CourierLogin() {
    return (
        <Form action='/api/courierLogin' headText='Вход' sendButtonText='Отправить' successRedirect='/courier/'>
            <TextInput error={false} onChange={undefined} name='courier_login' label='Логин' type='text' />
            <TextInput error={false} onChange={undefined} name='courier_password' label='Пароль' type='password' />
        </Form>
    );
}