'use client'

import { useState, useEffect } from 'react';

import Loading from '$/Loading';
import Form from '$/Form';
import TextInput from '$/TextInput';

import style from '@/courier/courier.module.scss';


export default function CourierLogin() {
    const [defaultValues, setDefaultValues] = useState(undefined);
    useEffect(() => {
        const fetchValues = async () => {
            const res = await fetch('/api/courierLogin', {
                method: 'POST'
            });
            if (res.ok) {
                let fetchData = await res.json();
                setDefaultValues(fetchData);
            }
        };
        
        fetchValues();
    }, [])
    
    return (
        <Form action='/api/courierLogin' headText='Вход' sendButtonText='Отправить' successRedirect='/courier/'>
            <TextInput error={false} onChange={undefined} name='courier_login' label='Логин' type='text' />
            <TextInput error={false} onChange={undefined} name='courier_password' label='Пароль' type='password' />
        </Form>
    );
}