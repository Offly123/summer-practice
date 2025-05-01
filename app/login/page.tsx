'use client'

import { useState } from 'react';

import TextInput from '$/TextInput';

import style from '@/login.module.scss';
import FormHead from '$/FormHead';


export default function Login() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [yoo, setYoo] = useState('');

    const handleSumbit = async (event) => {
        event.preventDefault();

        const res = await fetch('/api/login', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({login, password})
        });

        if (!res.ok) {
            console.error('No yo');
            return;
        }

        const data = await res.text();
        setYoo(data);
    }

    return (
        <form className={style.form} onSubmit={handleSumbit}>
            <FormHead>Логин</FormHead>
            <div className={style.main}>
                <TextInput id='login' label='Логин' type='text' />
                <TextInput id='password' label='Пароль' type='text' />
            </div>
            <div className={style.end}>
                <button type='submit'>Отправить</button>
            </div>
        </form>
    )
}